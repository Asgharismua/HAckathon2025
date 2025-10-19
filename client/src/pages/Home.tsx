import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { Header } from "@/components/Header";
import { WeatherCard } from "@/components/WeatherCard";
import { AdviceInput } from "@/components/AdviceInput";
import { AdviceDisplay } from "@/components/AdviceDisplay";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { WeatherForecast } from "@/components/WeatherForecast";
import { CropCalendar } from "@/components/CropCalendar";
import { AdviceHistory } from "@/components/AdviceHistory";
import { ProgressiveLoader } from "@/components/ProgressiveLoader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { WeatherData, AdviceResponse, Location, WeatherForecast as ForecastType, CropInfo, AdviceHistoryRecord } from "@shared/schema";

export default function Home() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [location, setLocation] = useState<Location | null>(null);
  const [currentAdvice, setCurrentAdvice] = useState<AdviceResponse | null>(null);
  const [showLoader, setShowLoader] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);

  // Fetch weather data when location is available and loader is complete
  const { data: weatherData, isLoading: isLoadingWeather } = useQuery<WeatherData>({
    queryKey: ["/api/weather", location?.latitude, location?.longitude],
    enabled: !!location && isDataReady,
    queryFn: async () => {
      if (!location) throw new Error("Location not available");
      const response = await apiRequest(
        "GET",
        `/api/weather?lat=${location.latitude}&lon=${location.longitude}`
      );
      return await response.json();
    },
  });

  // Fetch 7-day weather forecast
  const { data: forecastData } = useQuery<ForecastType>({
    queryKey: ["/api/forecast", location?.latitude, location?.longitude],
    enabled: !!location && isDataReady,
    queryFn: async () => {
      if (!location) throw new Error("Location not available");
      const response = await apiRequest(
        "GET",
        `/api/forecast?lat=${location.latitude}&lon=${location.longitude}`
      );
      return await response.json();
    },
  });

  // Fetch crop calendar
  const { data: cropsData } = useQuery<CropInfo[]>({
    queryKey: ["/api/crops/current"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/crops/current");
      return await response.json();
    },
  });

  // Fetch advice history
  const { data: historyData } = useQuery<AdviceHistoryRecord[]>({
    queryKey: ["/api/advice/history"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/advice/history?limit=20");
      return await response.json();
    },
  });

  // Get advice mutation
  const adviceMutation = useMutation({
    mutationFn: async (query: string) => {
      if (!weatherData) {
        throw new Error("Weather data not available");
      }

      const response = await apiRequest("POST", "/api/advice", {
        query,
        language,
        weatherData,
      });

      return await response.json();
    },
    onSuccess: (data) => {
      setCurrentAdvice(data);
      queryClient.invalidateQueries({ queryKey: ["/api/advice/history"] });
    },
    onError: (error: Error) => {
      toast({
        title: t("errorTitle"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get user location
  const getLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: t("errorTitle"),
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setShowLoader(true);
      },
      (error) => {
        let message = t("locationError");
        if (error.code === error.PERMISSION_DENIED) {
          message = t("locationPermissionDenied");
        }
        toast({
          title: t("errorTitle"),
          description: message,
          variant: "destructive",
        });
      }
    );
  };

  const handleLoaderComplete = () => {
    setShowLoader(false);
    setIsDataReady(true);
  };

  const handleAdviceSubmit = (query: string) => {
    adviceMutation.mutate(query);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Location Button */}
          {!location && !showLoader && (
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={getLocation}
                className="min-w-[200px]"
                data-testid="button-get-location"
              >
                <MapPin className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                {t("getLocationBtn")}
              </Button>
            </div>
          )}

          {/* Progressive Loader */}
          {showLoader && location && (
            <ProgressiveLoader onComplete={handleLoaderComplete} />
          )}

          {/* Weather Card */}
          {isLoadingWeather && location && isDataReady && (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
                <p className="text-muted-foreground">{t("loading")}</p>
              </div>
            </div>
          )}

          {weatherData && isDataReady && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content - Left/Center Column */}
              <div className="lg:col-span-2 space-y-6">
                <WeatherCard weather={weatherData} />

                {/* Advice Input */}
                <AdviceInput
                  onSubmit={handleAdviceSubmit}
                  isLoading={adviceMutation.isPending}
                  disabled={!weatherData}
                />

                {/* Advice Display */}
                {adviceMutation.isPending && <LoadingState />}
                
                {currentAdvice && !adviceMutation.isPending && (
                  <AdviceDisplay advice={currentAdvice} />
                )}

                {/* 7-Day Forecast */}
                {forecastData && (
                  <WeatherForecast 
                    forecast={forecastData.forecast} 
                    location={forecastData.location} 
                  />
                )}
              </div>

              {/* Sidebar - Right Column */}
              <div className="space-y-6">
                <Tabs defaultValue="crops" data-testid="tabs-sidebar">
                  <TabsList className="w-full">
                    <TabsTrigger value="crops" className="flex-1" data-testid="tab-crops">
                      {language === 'ar' ? 'المحاصيل' : 'Crops'}
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex-1" data-testid="tab-history">
                      {language === 'ar' ? 'السجل' : 'History'}
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="crops" className="mt-4">
                    {cropsData && <CropCalendar crops={cropsData} />}
                  </TabsContent>
                  
                  <TabsContent value="history" className="mt-4">
                    {historyData && <AdviceHistory history={historyData} />}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!location && !weatherData && !showLoader && <EmptyState />}
        </div>
      </main>
    </div>
  );
}
