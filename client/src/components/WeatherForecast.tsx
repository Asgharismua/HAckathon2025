import { Cloud, CloudRain, Sun, Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ForecastDay } from "@shared/schema";

interface WeatherForecastProps {
  forecast: ForecastDay[];
  location: string;
}

function getWeatherIcon(code: number) {
  if (code === 0) return <Sun className="w-6 h-6 text-yellow-500" />;
  if (code >= 61 && code <= 67) return <CloudRain className="w-6 h-6 text-blue-500" />;
  if (code >= 51 && code <= 57) return <CloudRain className="w-6 h-6 text-blue-400" />;
  return <Cloud className="w-6 h-6 text-gray-400" />;
}

function formatDate(dateString: string, language: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  };
  return date.toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', options);
}

export function WeatherForecast({ forecast, location }: WeatherForecastProps) {
  const { t, language } = useLanguage();

  return (
    <Card data-testid="card-weather-forecast">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="w-5 h-5" />
          {language === 'ar' ? 'توقعات الطقس لـ 7 أيام' : '7-Day Weather Forecast'}
          <span className="text-sm text-muted-foreground font-normal">
            {location}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {forecast.map((day, index) => (
            <div 
              key={day.date} 
              className="flex flex-col items-center p-3 rounded-lg bg-muted hover-elevate"
              data-testid={`forecast-day-${index}`}
            >
              <div className="text-xs text-muted-foreground mb-2 text-center">
                {formatDate(day.date, language)}
              </div>
              <div className="mb-2">
                {getWeatherIcon(day.weatherCode)}
              </div>
              <div className="text-sm font-medium">
                {Math.round(day.maxTemp)}°
              </div>
              <div className="text-xs text-muted-foreground">
                {Math.round(day.minTemp)}°
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {day.rainfall > 0 ? `${day.rainfall.toFixed(1)}mm` : ''}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
