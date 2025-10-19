interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation: number;
    wind_speed_10m: number;
    weather_code: number;
  };
}

interface OpenMeteoForecastResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    relative_humidity_2m_mean: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
    weather_code: number[];
  };
}

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  weatherCode: number;
  latitude: number;
  longitude: number;
  locationName?: string;
}

interface WeatherForecast {
  location: string;
  forecast: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
    weatherCode: number;
  }>;
}

export async function fetchWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
  try {
    // Fetch weather data from Open-Meteo API
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&timezone=auto`;
    
    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
      throw new Error(`Weather API error: ${weatherResponse.statusText}`);
    }
    
    const weatherData: OpenMeteoResponse = await weatherResponse.json();

    // Fetch location name using reverse geocoding
    let locationName = "Your Location";
    try {
      const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1`;
      const geocodeResponse = await fetch(geocodeUrl);
      
      if (geocodeResponse.ok) {
        const geocodeData = await geocodeResponse.json();
        if (geocodeData.results && geocodeData.results[0]) {
          const result = geocodeData.results[0];
          locationName = result.name || result.admin1 || result.country || "Your Location";
        }
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }

    return {
      temperature: weatherData.current.temperature_2m,
      humidity: weatherData.current.relative_humidity_2m,
      rainfall: weatherData.current.precipitation,
      windSpeed: weatherData.current.wind_speed_10m,
      weatherCode: weatherData.current.weather_code,
      latitude,
      longitude,
      locationName,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw new Error("Failed to fetch weather data");
  }
}

export async function fetchWeatherForecast(latitude: number, longitude: number): Promise<WeatherForecast> {
  try {
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean,precipitation_sum,wind_speed_10m_max,weather_code&timezone=auto&forecast_days=7`;
    
    const forecastResponse = await fetch(forecastUrl);
    if (!forecastResponse.ok) {
      throw new Error(`Forecast API error: ${forecastResponse.statusText}`);
    }
    
    const forecastData: OpenMeteoForecastResponse = await forecastResponse.json();

    let locationName = "Your Location";
    try {
      const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1`;
      const geocodeResponse = await fetch(geocodeUrl);
      
      if (geocodeResponse.ok) {
        const geocodeData = await geocodeResponse.json();
        if (geocodeData.results && geocodeData.results[0]) {
          const result = geocodeData.results[0];
          locationName = result.name || result.admin1 || result.country || "Your Location";
        }
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }

    const forecast = forecastData.daily.time.map((date, index) => ({
      date,
      maxTemp: forecastData.daily.temperature_2m_max[index],
      minTemp: forecastData.daily.temperature_2m_min[index],
      humidity: forecastData.daily.relative_humidity_2m_mean[index],
      rainfall: forecastData.daily.precipitation_sum[index],
      windSpeed: forecastData.daily.wind_speed_10m_max[index],
      weatherCode: forecastData.daily.weather_code[index],
    }));

    return {
      location: locationName,
      forecast,
    };
  } catch (error) {
    console.error("Error fetching weather forecast:", error);
    throw new Error("Failed to fetch weather forecast");
  }
}
