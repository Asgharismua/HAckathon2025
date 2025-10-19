import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LoadingStep {
  key: string;
  labelEn: string;
  labelAr: string;
}

const LOADING_STEPS: LoadingStep[] = [
  { key: "weather", labelEn: "Analyzing weather data", labelAr: "تحليل بيانات الطقس" },
  { key: "ph", labelEn: "Collecting soil pH levels", labelAr: "جمع مستويات حموضة التربة" },
  { key: "salinity", labelEn: "Understanding soil salinity", labelAr: "فهم ملوحة التربة" },
  { key: "insights", labelEn: "Generating key insights", labelAr: "إنشاء رؤى رئيسية" },
];

interface ProgressiveLoaderProps {
  onComplete: () => void;
}

export function ProgressiveLoader({ onComplete }: ProgressiveLoaderProps) {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < LOADING_STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      const finalTimer = setTimeout(() => {
        onComplete();
      }, 400);
      return () => clearTimeout(finalTimer);
    }
  }, [currentStep, onComplete]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-md p-8">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {language === "ar" ? "جاري التحضير" : "Preparing Your Dashboard"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {language === "ar" 
                ? "يرجى الانتظار بينما نقوم بتحليل بيانات موقعك" 
                : "Please wait while we analyze your location data"}
            </p>
          </div>

          <div className="space-y-4">
            {LOADING_STEPS.map((step, index) => {
              const isCompleted = index < currentStep;
              const isActive = index === currentStep;

              return (
                <div
                  key={step.key}
                  className="flex items-center gap-3 transition-all duration-300"
                  data-testid={`loader-step-${step.key}`}
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 
                        className="w-5 h-5 text-primary" 
                        data-testid={`icon-complete-${step.key}`}
                      />
                    ) : isActive ? (
                      <Loader2 
                        className="w-5 h-5 text-primary animate-spin" 
                        data-testid={`icon-loading-${step.key}`}
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-muted" />
                    )}
                  </div>
                  <span
                    className={`text-sm transition-colors duration-300 ${
                      isCompleted || isActive
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {language === "ar" ? step.labelAr : step.labelEn}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-500 ease-out"
                style={{
                  width: `${(currentStep / LOADING_STEPS.length) * 100}%`,
                }}
                data-testid="progress-bar"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
