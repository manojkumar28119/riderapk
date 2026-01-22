import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PencilSimple } from "@/data/constants/icons.constants";
import { PermissionGate } from "./PermissionGate";
import { useTranslation } from "react-i18next";

interface FormHeaderLayoutProps {
  title: string;
  isBackNaviation?: boolean;
  backNavigationPath?: string;
  editNavigationPath?: string;
  showEditButton?: boolean;
  onBackClick?: () => void;
  onEditClick?: () => void;
  customActions?: ReactNode;
  customHeaderContent?: ReactNode;
  permission?: string;
}

export default function FormHeaderLayout({
  title,
  editNavigationPath,
  isBackNaviation = false,
  backNavigationPath,
  showEditButton = false,
  onBackClick,
  onEditClick,
  customActions,
  permission,
  customHeaderContent,
}: FormHeaderLayoutProps) {
    const { t } = useTranslation();

  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else if (backNavigationPath) {
      navigate(backNavigationPath);
    } else {
      navigate(-1);
    }
  };

  const handleEditClick = () => {
    if (onEditClick) {
      onEditClick();
    } else if (editNavigationPath) {
      navigate(editNavigationPath);
    }
  };

  return (
    <div className="flex justify-between items-center py-2.5 pr-3 px-5 border-b">
      <div className="flex">
        {isBackNaviation && (
          <Button
            variant="ghost"
            className="[&_svg]:!size-6 pr-2 pl-0"
            onClick={handleBackClick}
          >
            <ArrowLeft size={24} />
          </Button>
        )}
        <div className="flex flex-row items-center gap-[18px]">
          <h1 className="text-xl font-medium">{title}</h1>
          <div>{customHeaderContent}</div>
        </div>
      </div>
      {showEditButton && (
        <PermissionGate permission={permission}>
          <Button
            variant="outline"
            onClick={handleEditClick}
            className="text-sm h-9 font-normal text-brand-primary border-brand-primary"
          >
            <PencilSimple size={24} />
            {t("common.edit")}{" "}
          </Button>
        </PermissionGate>
      )}
      {customActions && <div>{customActions}</div>}
    </div>
  );
}
