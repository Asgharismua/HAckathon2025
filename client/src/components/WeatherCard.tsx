import { Thermometer, Droplets, CloudRain, Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import type { WeatherData } from "@shared/schema";

interface WeatherCardProps {
  weather: WeatherData;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const { t } = useLanguage();

  const weatherItems = [
    {
      icon: Thermometer,
      label: t("temperature"),
      value: `${Math.round(weather.temperature ?? 0)}°C`,
      color: "text-chart-3",
    },
    {
      icon: Droplets,
      label: t("humidity"),
      value: `${Math.round(weather.humidity ?? 0)}%`,
      color: "text-chart-2",
    },
    {
      icon: CloudRain,
      label: t("rainfall"),
      value: `${(weather.rainfall ?? 0).toFixed(1)} mm`,
      color: "text-chart-1",
    },
    {
      icon: Wind,
      label: t("windSpeed"),
      value: `${Math.round(weather.windSpeed ?? 0)} km/h`,
      color: "text-chart-4",
    },
  ];

  return (
    <Card className="shadow-md" data-testid="card-weather">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl md:text-2xl">{t("weatherTitle")}</CardTitle>
        {weather.locationName && (
          <p className="text-sm text-muted-foreground" data-testid="text-location">
            {weather.locationName}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {weatherItems.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 rounded-lg bg-muted/50"
              data-testid={`weather-item-${index}`}
            >
              <div className={`mt-0.5 ${item.color}`}>
                <item.icon className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-xs md:text-sm text-muted-foreground">
                  {item.label}
                </span>
                <span className="text-base md:text-lg font-semibold text-foreground truncate">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
