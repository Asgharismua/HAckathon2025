import { Wheat, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocation } from "wouter";

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  const goHome = () => {
    setLocation("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between gap-4">
          {/* Logo and Title */}
          <button 
            onClick={goHome} 
            className="flex items-center gap-3 hover-elevate active-elevate-2 rounded-lg p-2 -ml-2"
            data-testid="button-home"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground">
              <Wheat className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                {t("appName")}
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                {t("subtitle")}
              </p>
            </div>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <Button
              variant="outline"
              size="default"
              onClick={toggleLanguage}
              className="min-w-[80px] font-semibold"
              data-testid="button-language-toggle"
            >
              {t("languageToggle")}
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
