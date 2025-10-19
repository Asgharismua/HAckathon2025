import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export function EmptyState() {
  const { t } = useLanguage();

  return (
    <Card className="shadow-md" data-testid="card-empty">
      <CardContent className="flex flex-col items-center justify-center py-12 md:py-16 text-center">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
        </div>
        <p className="text-base md:text-lg text-muted-foreground max-w-md px-4">
          {t("noWeatherData")}
        </p>
      </CardContent>
    </Card>
  );
}
