import LogoImg from "@/assets/images/Logo.jpg";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { NotificationSheet } from "@/components/common/NotificationSheet";
import { useState } from "react";
import { LanguageSelector } from "@/components/common/languageSelector";

const NavBar = () => {
  const [openNotification, setOpenNotification] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-[60px] bg-brand-bgwhite border-b border-blue-200">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo - clickable with caching */}
          <Link to="/" className="flex-shrink-0">
            <img
              src={LogoImg}
              alt="Logo"
              className="w-[120px] h-[36px] object-contain cursor-pointer"
            />
          </Link>

          {/*Language Selector, Notification & Avatar */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <LanguageSelector />
            {/* Notification Bell with Badge */}
            <div className="relative flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="!rounded-full bg-blue-50 h-9 w-9 hover:bg-blue-100"
                onClick={() => setOpenNotification(!openNotification)}
              >
                <Bell className="h-5 w-5" />
              </Button>
              {/* Notification Badge */}

              <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 min-w-[20px] px-1.5 !rounded-full bg-red text-white text-xs font-semibold animate-badge-pop">
                1
              </span>
            </div>

            {/* Avatar */}
            <Avatar className="flex-shrink-0 bg-blue-50 h-9 w-9">
              <AvatarImage src={""} alt="User avatar" />
              <AvatarFallback className="text-sm font-medium">
                SN
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <NotificationSheet
        open={openNotification}
        onOpenChange={setOpenNotification}
      />
    </>
  );
};

export default NavBar;
