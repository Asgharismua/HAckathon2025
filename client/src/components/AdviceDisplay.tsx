import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatMarkdown } from "@/lib/markdown";
import type { AdviceResponse } from "@shared/schema";

interface AdviceDisplayProps {
  advice: AdviceResponse;
}

export function AdviceDisplay({ advice }: AdviceDisplayProps) {
  const { t } = useLanguage();

  const formattedTime = new Date(advice.timestamp).toLocaleTimeString(
    advice.language === "ar" ? "ar-AE" : "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const formattedDate = new Date(advice.timestamp).toLocaleDateString(
    advice.language === "ar" ? "ar-AE" : "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  return (
    <Card className="shadow-md" data-testid="card-advice">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
        <CardTitle className="text-xl md:text-2xl flex-1">
          {t("adviceTitle")}
        </CardTitle>
        <Badge variant="secondary" className="shrink-0">
          {advice.language === "ar" ? "عربي" : "English"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Advice Text */}
        <div
          className="text-base md:text-lg leading-relaxed text-foreground"
          style={{ lineHeight: advice.language === "ar" ? "1.7" : "1.6" }}
          data-testid="text-advice-content"
        >
          {formatMarkdown(advice.advice)}
        </div>

        {/* Metadata */}
        <div className="pt-4 border-t space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">{t("timestamp")}:</span>
            <span data-testid="text-advice-time">
              {formattedDate} {formattedTime}
            </span>
          </div>
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="font-medium shrink-0">{t("weatherConditions")}:</span>
            <span className="flex-1" data-testid="text-weather-summary">
              {advice.weatherSummary}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
