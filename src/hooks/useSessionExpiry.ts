import { useCallback, useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/data/store/useAuthStore";
import { auth } from "@lib/utils/auth";
import { shouldRefreshToken } from "@/lib/utils/jwt";
import { useNavigate } from "react-router-dom";

// Session expiry warning threshold - warn 7 minutes before expiry
const EXPIRY_WARNING_MINUTES = 5;
// Recent activity threshold - if user was active within 20 minute, auto-extend session
const RECENT_ACTIVITY_THRESHOLD_MINUTES = 20;
// Token refresh threshold - refresh token if it expires in less than 10 minutes
const TOKEN_REFRESH_THRESHOLD_MINUTES = 10;
// Check session expiry every 5
//  seconds
const CHECK_INTERVAL_MS = 5000;

/**
 * Hook to monitor session expiry and handle automatic extension or logout
 * Returns warning state and remaining seconds until session expires
 */
export const useSessionExpiry = () => {
  const { sessionExpiry, tokenExpiry, lastActivityTime } = useAuthStore();
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  // Ref to track last activity time without triggering re-renders
  const lastActivityRef = useRef(lastActivityTime);

  // Ref to prevent duplicate token refresh calls
  const hasRefreshedTokenRef = useRef(false);

  // Ref to track whether the session has been extended automatically
  const hasExtendedSessionRef = useRef(false);

  const navigate = useNavigate();

  // Keep ref in sync with auth store's lastActivityTime
  useEffect(() => {
    lastActivityRef.current = lastActivityTime;
  }, [lastActivityTime]);

  // Reset token refresh flag when token changes
  useEffect(() => {
    hasRefreshedTokenRef.current = false;
  }, [tokenExpiry]);

  // Check if token needs refresh or session is expired/approaching expiry
  const checkExpiry = useCallback(async () => {
    if (!sessionExpiry) return;

    // 1️⃣ Token refresh (independent of session UX)
    if (
      tokenExpiry &&
      !hasRefreshedTokenRef.current &&
      shouldRefreshToken(tokenExpiry, TOKEN_REFRESH_THRESHOLD_MINUTES)
    ) {
      try {
        hasRefreshedTokenRef.current = true;
        await auth.refreshToken();
      } catch (error) {
        console.error("Automatic token refresh failed:", error);
        hasRefreshedTokenRef.current = false;
      }
    }

    const expiryTime = new Date(sessionExpiry).getTime();
    const now = Date.now();
    const diffMs = expiryTime - now;
    const diffMinutes = diffMs / (1000 * 60);
    const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));

    // console.log(`Session expiry: ${diffMinutes.toFixed(2)} minutes (${diffSeconds} seconds)`);

    setRemainingSeconds(diffSeconds);

    // 2️⃣ Hard expiry
    if (diffMinutes <= 0) {
      await auth.logout(navigate);
      setShowWarning(false);
      return;
    }

    // 3️⃣ Entering warning window
    if (diffMinutes <= EXPIRY_WARNING_MINUTES && !showWarning) {
      const timeSinceLastActivity = now - lastActivityRef.current;
      if (!hasExtendedSessionRef.current && timeSinceLastActivity < RECENT_ACTIVITY_THRESHOLD_MINUTES * 60 * 1000) {
        try {
          await auth.extendSession();
          hasExtendedSessionRef.current = true;
          return; // silent extension, no popup
        } catch (error) {
          console.error("Failed to extend session:", error);
          // fall through to warning
        }
      }

      if (!showWarning) {
        setShowWarning(true);
      }
    }
  }, [sessionExpiry, tokenExpiry, showWarning, navigate]);

  // Set up interval to periodically check session expiry
  useEffect(() => {
    if (!sessionExpiry) return;

    // Initial check
    checkExpiry();
    // Check every 30 seconds
    const interval = setInterval(checkExpiry, CHECK_INTERVAL_MS);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [checkExpiry, sessionExpiry]);

  return { showWarning, remainingSeconds, setShowWarning };
};
