// components/common/PermissionGate.tsx
import React from "react";
import {auth} from "@/lib/utils/auth";
interface PermissionGateProps {
  permission?: string;
  children: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  children,
}) => {

  if (!permission) return <>{children}</>; // 🚀 shows if no permission required
  if (!auth.hasAccess(permission)) return null; // 🔒 hides if no permission
  return <>{children}</>;
};
