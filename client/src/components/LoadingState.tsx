import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export function LoadingState() {
  const { t } = useLanguage();

  return (
    <Card className="shadow-md" data-testid="card-loading">
      <CardContent className="flex flex-col items-center justify-center py-12 md:py-16">
        <Loader2 className="w-12 h-12 md:w-16 md:h-16 text-primary animate-spin mb-4" />
        <p className="text-base md:text-lg text-muted-foreground text-center">
          {t("analyzingWeather")}
        </p>
      </CardContent>
    </Card>
  );
}
