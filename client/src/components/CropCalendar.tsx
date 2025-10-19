import { Calendar, Leaf, Sprout } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CropInfo } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CropCalendarProps {
  crops: CropInfo[];
}

const monthNames = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  ar: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
};

export function CropCalendar({ crops }: CropCalendarProps) {
  const { language } = useLanguage();
  const currentMonth = new Date().getMonth() + 1;

  const formatMonths = (months: number[]) => {
    const names = language === 'ar' ? monthNames.ar : monthNames.en;
    return months.map(m => names[m - 1]).join(', ');
  };

  return (
    <Card data-testid="card-crop-calendar">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {language === 'ar' ? 'دليل زراعة المحاصيل' : 'Crop Planting Calendar'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {crops.map((crop) => {
              const isInSeason = crop.plantingMonths.includes(currentMonth);
              return (
                <div 
                  key={crop.id} 
                  className={`p-4 rounded-lg border ${isInSeason ? 'bg-primary/5 border-primary/20' : 'bg-card'} hover-elevate`}
                  data-testid={`crop-${crop.id}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-green-600" />
                      <h4 className="font-medium">
                        {language === 'ar' ? crop.nameAr : crop.nameEn}
                      </h4>
                    </div>
                    {isInSeason && (
                      <Badge variant="default" className="text-xs">
                        {language === 'ar' ? 'موسم الزراعة' : 'In Season'}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Sprout className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="text-muted-foreground">
                          {language === 'ar' ? 'الزراعة: ' : 'Plant: '}
                        </span>
                        <span className="font-medium">
                          {formatMonths(crop.plantingMonths)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="text-muted-foreground">
                          {language === 'ar' ? 'الحصاد: ' : 'Harvest: '}
                        </span>
                        <span className="font-medium">
                          {formatMonths(crop.harvestMonths)}
                        </span>
                      </div>
                    </div>

                    {crop.descriptionEn && crop.descriptionAr && (
                      <p className="text-muted-foreground text-xs mt-2">
                        {language === 'ar' ? crop.descriptionAr : crop.descriptionEn}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
