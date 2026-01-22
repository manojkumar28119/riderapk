import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguageStore } from "@/data/store/useLanguageStore";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector = ({ className = "" }: LanguageSelectorProps) => {
  const { language, setLanguage } = useLanguageStore();
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang: 'en' | 'te') => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`!rounded-full bg-blue-50 h-9 w-9 hover:bg-blue-100 ${className}`}
        >
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => handleLanguageChange('en')}
          className={language === 'en' ? 'bg-blue-50' : ''}
        >
          <span className="font-medium">English</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange('te')}
          className={language === 'te' ? 'bg-blue-50' : ''}
        >
          <span className="font-medium">తెలుగు</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
