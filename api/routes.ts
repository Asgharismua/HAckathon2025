import type { Express } from "express";
import { createServer, type Server } from "http";
import { fetchWeatherData, fetchWeatherForecast } from "./weather";
import { generateFarmingAdvice } from "./gemini";
import { adviceRequestSchema } from "@shared/schema";
import { storage } from "./storage";
import { uaeCropCalendar, getCropsByMonth, getCurrentSeasonCrops } from "./cropCalendar";

export async function registerRoutes(app: Express): Promise<Server> {
  // Weather endpoint - fetch current weather data
  app.get("/api/weather", async (req, res) => {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lon = parseFloat(req.query.lon as string);

      if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ 
          error: "Invalid latitude or longitude" 
        });
      }

      const weatherData = await fetchWeatherData(lat, lon);
      res.json(weatherData);
    } catch (error) {
      console.error("Weather endpoint error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to fetch weather data" 
      });
    }
  });

  // Weather forecast endpoint - fetch 7-day forecast
  app.get("/api/forecast", async (req, res) => {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lon = parseFloat(req.query.lon as string);

      if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ 
          error: "Invalid latitude or longitude" 
        });
      }

      const forecast = await fetchWeatherForecast(lat, lon);
      res.json(forecast);
    } catch (error) {
      console.error("Forecast endpoint error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to fetch weather forecast" 
      });
    }
  });

  // Crop calendar endpoint - get all crops
  app.get("/api/crops", async (req, res) => {
    try {
      const month = req.query.month ? parseInt(req.query.month as string) : undefined;
      
      if (month !== undefined && (isNaN(month) || month < 1 || month > 12)) {
        return res.status(400).json({ 
          error: "Invalid month. Must be between 1 and 12" 
        });
      }

      const crops = month ? getCropsByMonth(month) : uaeCropCalendar;
      res.json(crops);
    } catch (error) {
      console.error("Crops endpoint error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to fetch crop data" 
      });
    }
  });

  // Current season crops endpoint
  app.get("/api/crops/current", async (req, res) => {
    try {
      const crops = getCurrentSeasonCrops();
      res.json(crops);
    } catch (error) {
      console.error("Current crops endpoint error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to fetch current season crops" 
      });
    }
  });

  // Advice endpoint - generate farming advice using Gemini AI
  app.post("/api/advice", async (req, res) => {
    try {
      // Validate request body
      const validation = adviceRequestSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ 
          error: "Invalid request data",
          details: validation.error.issues,
        });
      }

      const { query, language, weatherData } = validation.data;

      // Generate farming advice
      const advice = await generateFarmingAdvice({
        query,
        language,
        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
        rainfall: weatherData.rainfall,
        windSpeed: weatherData.windSpeed,
        location: weatherData.locationName || "your location",
      });

      // Create weather summary
      const weatherSummary = language === "ar"
        ? `${Math.round(weatherData.temperature)}°C، رطوبة ${Math.round(weatherData.humidity)}%`
        : `${Math.round(weatherData.temperature)}°C, ${Math.round(weatherData.humidity)}% humidity`;

      const response = {
        advice,
        language,
        timestamp: new Date().toISOString(),
        weatherSummary,
      };

      // Save to history
      await storage.saveAdviceHistory({
        query,
        advice,
        language,
        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
        rainfall: weatherData.rainfall,
        windSpeed: weatherData.windSpeed,
        locationName: weatherData.locationName,
        latitude: weatherData.latitude,
        longitude: weatherData.longitude,
      });

      res.json(response);
    } catch (error) {
      console.error("Advice endpoint error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to generate advice" 
      });
    }
  });

  // Advice history endpoint - get past advice
  app.get("/api/advice/history", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      
      if (isNaN(limit) || limit < 1 || limit > 100) {
        return res.status(400).json({ 
          error: "Invalid limit. Must be between 1 and 100" 
        });
      }

      const history = await storage.getAdviceHistory(limit);
      res.json(history);
    } catch (error) {
      console.error("History endpoint error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to fetch advice history" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
