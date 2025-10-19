import { z } from "zod";
import { pgTable, text, serial, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Weather data from Open-Meteo API
export const weatherDataSchema = z.object({
  temperature: z.number(),
  humidity: z.number(),
  rainfall: z.number(),
  windSpeed: z.number(),
  weatherCode: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  locationName: z.string().optional(),
});

export type WeatherData = z.infer<typeof weatherDataSchema>;

// 7-day weather forecast
export const forecastDaySchema = z.object({
  date: z.string(),
  maxTemp: z.number(),
  minTemp: z.number(),
  humidity: z.number(),
  rainfall: z.number(),
  windSpeed: z.number(),
  weatherCode: z.number(),
});

export type ForecastDay = z.infer<typeof forecastDaySchema>;

export const weatherForecastSchema = z.object({
  location: z.string(),
  forecast: z.array(forecastDaySchema),
});

export type WeatherForecast = z.infer<typeof weatherForecastSchema>;

// Request schema for farming advice
export const adviceRequestSchema = z.object({
  query: z.string().min(1, "Query cannot be empty"),
  language: z.enum(["en", "ar"]),
  weatherData: weatherDataSchema,
});

export type AdviceRequest = z.infer<typeof adviceRequestSchema>;

// Response schema for farming advice
export const adviceResponseSchema = z.object({
  advice: z.string(),
  language: z.enum(["en", "ar"]),
  timestamp: z.string(),
  weatherSummary: z.string(),
});

export type AdviceResponse = z.infer<typeof adviceResponseSchema>;

// Geolocation coordinates
export const locationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export type Location = z.infer<typeof locationSchema>;

// Crop calendar data
export const cropInfoSchema = z.object({
  id: z.string(),
  nameEn: z.string(),
  nameAr: z.string(),
  plantingMonths: z.array(z.number()),
  harvestMonths: z.array(z.number()),
  category: z.string(),
  descriptionEn: z.string().optional(),
  descriptionAr: z.string().optional(),
});

export type CropInfo = z.infer<typeof cropInfoSchema>;

// Advice history table
export const adviceHistory = pgTable("advice_history", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  advice: text("advice").notNull(),
  language: text("language").notNull(),
  temperature: real("temperature").notNull(),
  humidity: real("humidity").notNull(),
  rainfall: real("rainfall").notNull(),
  windSpeed: real("wind_speed").notNull(),
  locationName: text("location_name"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertAdviceHistorySchema = createInsertSchema(adviceHistory).omit({
  id: true,
  timestamp: true,
});

export type InsertAdviceHistory = z.infer<typeof insertAdviceHistorySchema>;
export type AdviceHistoryRecord = typeof adviceHistory.$inferSelect;
