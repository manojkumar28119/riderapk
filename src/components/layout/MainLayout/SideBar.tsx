import { Link, useLocation } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CaretRight,
  SignOut,
  Gear,
  SquaresFour,
} from "@/data/constants/icons.constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface SubMenuItem {
  title: string;
  url: string;
}

interface MenuItem {
  title: string;
  url?: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: SubMenuItem[];
}

interface SideBarProps {
  defaultCollapsed?: boolean;
}

const SideBar = ({ defaultCollapsed = true }: SideBarProps) => {
  const { t } = useTranslation();

  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [canShowDropdowns, setCanShowDropdowns] = useState(!defaultCollapsed);
  const navigate = useNavigate();

  const menuItems: MenuItem[] = useMemo(() => {
    return [
      {
        title: t("sidebar.settings"),
        icon: Gear,
        url: "/settings",
      },
    ];
  }, [t]);

  // ✅ Auto-open menu for any matching or nested route (e.g., /staff/invite)
  useEffect(() => {
    if (!isCollapsed && canShowDropdowns) {
      const activeMenus = menuItems
        .filter(
          (item) =>
            item.subItems &&
            item.subItems.some((sub) => location.pathname.startsWith(sub.url)),
        )
        .map((item) => item.title);
      if (activeMenus.length > 0) {
        setOpenMenus(activeMenus);
      }
    }
  }, [location.pathname, isCollapsed, canShowDropdowns, menuItems]);

  // ✅ Updated to check startsWith instead of exact match
  const isActive = (url: string) => {
    return location.pathname === url || location.pathname.startsWith(url + "/");
  };

  const isMenuOpen = (title: string) => openMenus.includes(title);

  const isAnySubItemActive = (subItems?: SubMenuItem[]) =>
    subItems?.some((item) => isActive(item.url)) || false;

  const toggleMenu = (title: string) => {
    if (isCollapsed) return;
    setOpenMenus((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [title],
    );
  };

  const handleMouseEnter = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setCanShowDropdowns(true);
    }
  };

  const handleMouseLeave = () => {
    setCanShowDropdowns(false);
    setOpenMenus([]);
    setTimeout(() => {
      setIsCollapsed(true);
    }, 100);
  };

  const renderMenuItem = (item: MenuItem, key: string) => {
    const Icon = item.icon;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isOpen = isMenuOpen(item.title);
    const active = item.url ? isActive(item.url) : false;
    const parentActive = hasSubItems
      ? isAnySubItemActive(item.subItems)
      : false;

    if (hasSubItems) {
      return (
        <li key={key}>
          <button
            onClick={() => toggleMenu(item.title)}
            disabled={isCollapsed}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-normal transition-colors",
              parentActive && isCollapsed
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100",
              isCollapsed && "cursor-default",
            )}
          >
            <Icon className="w-5 h-5 text-brand-primary" />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis text-blue-800">
                  {item.title}
                </span>
                <CaretRight
                  className="w-4 h-4 transition-transform duration-200 text-brand-primary"
                  style={{
                    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                  }}
                />
              </>
            )}
          </button>
          <AnimatePresence initial={false}>
            {!isCollapsed && isOpen && canShowDropdowns && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  height: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="overflow-hidden"
              >
                <ul className="ml-[22px] pl-3 space-y-1 py-1 relative before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-blue-200">
                  {item.subItems?.map((subItem) => {
                    const subActive = isActive(subItem.url);
                    return (
                      <motion.li
                        key={subItem.url}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      >
                        <Link
                          to={subItem.url}
                          className={cn(
                            "block px-3 py-2 text-sm transition-colors whitespace-nowrap overflow-hidden text-ellipsis rounded-lg",
                            subActive
                              ? "bg-blue-100 text-blue-700 font-normal"
                              : "text-grey-400  font-normal hover:bg-gray-100 hover:text-brand-primary",
                          )}
                        >
                          {subItem.title}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </li>
      );
    }

    return (
      <li key={key}>
        <Link
          to={item.url!}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-normal transition-colors",
            active ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100",
          )}
          title={isCollapsed ? item.title : undefined}
        >
          <Icon
            className={cn(
              "w-5 h-5",
              active ? "text-blue-700" : "text-brand-primary",
            )}
          />
          {!isCollapsed && (
            <span
              className={cn(
                "whitespace-nowrap overflow-hidden text-ellipsis",
                active ? "" : "text-blue-800",
              )}
            >
              {item.title}
            </span>
          )}
        </Link>
      </li>
    );
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-white border-r border-blue-200 h-full flex flex-col relative"
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-blue-200 flex items-center justify-between h-[85px]">
        <div className="flex-1 overflow-hidden">
          <AnimatePresence initial={false}>
            {isCollapsed ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="overflow-hidden flex flex-col gap-3"
              >
                <Link to="/">
                  <ul
                    className={cn(
                      "space-y-1 flex justify-center align-center gap-2 px-3 cursor-pointer p-2 rounded-lg transition-colors",
                      isActive("/")
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-gray-100",
                    )}
                  >
                    <SquaresFour
                      size={20}
                      className={cn(
                        "mt-1",
                        isActive("/") ? "text-blue-700" : "text-brand-primary",
                      )}
                    />
                  </ul>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="overflow-hidden flex flex-col gap-3"
              >
                <span className="px-3 text-grey-300 font-medium text-xs">
                  GENERAL
                </span>
                <Link to="/" className="rounded-lg">
                  <ul
                    className={cn(
                      "space-y-1 flex align-center gap-2 px-3 cursor-pointer p-2 rounded-lg transition-colors",
                      isActive("/") ? "bg-blue-100" : "hover:bg-gray-100",
                    )}
                  >
                    <SquaresFour
                      size={20}
                      className={cn(
                        "mt-1",
                        isActive("/") ? "text-blue-700" : "text-brand-primary",
                      )}
                    />
                    <h1
                      className={cn(
                        "text-sm font-normal",
                        isActive("/") ? "text-blue-700" : "text-blue-800",
                      )}
                    >
                      {t("sidebar.dashboard")}
                    </h1>
                  </ul>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4">
        <div className="mb-6">
          <ul className="space-y-1 flex flex-col align-center gap-2 text-gray-500">
            {menuItems.map((item, index) =>
              renderMenuItem(item, `menu-${index}`),
            )}
          </ul>
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-blue-200 h-[68px] flex items-center">
        <AnimatePresence initial={false} mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="expanded-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-4 w-full"
            >
              <Button
                variant="ghost"
                className="flex justify-between items-center gap-3 w-full"
                onClick={() => {
                  navigate("/signin");
                }}
              >
                <div className="text-sm text-red font-normal">{t("sidebar.logout")}</div>
                <SignOut size={20} className="text-red font-medium" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-4 flex justify-center w-full"
            >
              <Button
                variant="ghost"
                onClick={() => {
                  navigate("/signin");
                }}
              >
                <SignOut size={20} className="text-red font-medium" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};

export default SideBar;
