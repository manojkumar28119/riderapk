import { ReactNode, useState } from "react";
import { useSessionExpiry } from "@/hooks/useSessionExpiry";
import useSession from "@/hooks/useSession";
import { useAuthStore } from "@/data/store/useAuthStore";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/utils/auth";

interface SessionExpiryProviderProps {
  children: ReactNode;
}

/**
 * Provider component that manages session expiry logic and UI
 * 
 * PROBLEM SOLVED:
 * Before: MainLayout called useSessionExpiry() directly → re-rendered on every user activity
 * After: SessionExpiryProvider isolates all session logic → MainLayout is completely independent
 * 
 * HOW IT WORKS:
 * 1. useSession() tracks user activity (mousemove, keydown, click) and updates auth store
 * 2. useSessionExpiry() monitors session expiry every 5 seconds
 * 3. When showWarning changes, provider re-renders and updates ConfirmationDialog
 * 4. ConfirmationDialog handles session continuation/logout actions
 * 5. MainLayout has ZERO dependency on session state - never affected by expiry logic
 * 
 * KEY BENEFIT:
 * MainLayout only cares about layout structure, not session management
 * Session management is completely isolated in this provider
 */
export const SessionExpiryProvider = ({ children }: SessionExpiryProviderProps) => {
  useSession();
  const { showWarning, setShowWarning } = useSessionExpiry();
  const navigate = useNavigate();
  const setLastActivityTime = useAuthStore((state) => state.setLastActivityTime);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleSessionContinue = async () => {
    setDialogLoading(true);
    setLastActivityTime(Date.now());
    await auth.extendSession();
    setShowWarning(false);
    setDialogLoading(false);
  };

  const handleSessionCancel = async () => {
    setLogoutLoading(true);
    setShowWarning(false);
    await auth.logout(navigate);
    setLogoutLoading(false);
  };

  return (
    <>
      <ConfirmationDialog
        open={showWarning}
        onOpenChange={() => {}}
        title="You're about to be logged out"
        description={`You've been inactive for a while. For security reasons, your session will expire in 5mins.`}
        onConfirm={handleSessionContinue}
        onCancel={handleSessionCancel}
        confirmText="Continue Session"
        cancelText="Log out"
        isLoading={dialogLoading}
        cancelLoading={logoutLoading}
      />
      {children}
    </>
  );
};

