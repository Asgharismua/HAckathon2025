import { useState } from "react";
import { History, MapPin, Thermometer, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatMarkdown } from "@/lib/markdown";
import type { AdviceHistoryRecord } from "@shared/schema";

interface AdviceHistoryProps {
  history: AdviceHistoryRecord[];
}

function formatDate(dateString: Date | string, language: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-US', options);
}

export function AdviceHistory({ history }: AdviceHistoryProps) {
  const { language } = useLanguage();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (history.length === 0) {
    return (
      <Card data-testid="card-advice-history">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            {language === 'ar' ? 'سجل النصائح' : 'Advice History'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            {language === 'ar' 
              ? 'لا يوجد سجل نصائح بعد. ابدأ بطرح سؤال!' 
              : 'No advice history yet. Start by asking a question!'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-advice-history">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          {language === 'ar' ? 'سجل النصائح' : 'Advice History'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {history.map((record, index) => {
              const isExpanded = expandedId === record.id;
              return (
                <div 
                  key={record.id} 
                  className="rounded-lg border bg-card overflow-hidden"
                  data-testid={`history-item-${index}`}
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : record.id)}
                    className="w-full p-4 text-left hover-elevate active-elevate-2"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1">
                          {record.query}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {record.locationName || 'Unknown'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Thermometer className="w-3 h-3" />
                            {Math.round(record.temperature)}°C
                          </span>
                          <span>
                            {formatDate(record.timestamp, language)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-2 shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    {!isExpanded && (
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {record.advice}
                      </div>
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 text-sm border-t">
                      <div className="mt-3 space-y-2">
                        {formatMarkdown(record.advice)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
