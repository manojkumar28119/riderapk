import { useEffect } from "react";
import { useAuthStore } from "../data/store/useAuthStore";
import { auth } from "@/lib/utils/auth";

/**
 * Hook to track user activity and update last activity timestamp
 * Used for session management and timeout handling
 */
const useSession = () => {
  const setLastActivityTime = useAuthStore((state) => state.setLastActivityTime);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    // Update last activity time with debouncing to avoid excessive state updates
    const updateActivity = () => {
      if(!auth.getUser()){
        auth.logout();
      }
      // Clear previous timeout to reset debounce
      clearTimeout(timeoutId);
      // Update the last activity timestamp immediately
      setLastActivityTime(Date.now());

      // Debounce: wait 1 second before allowing next update
      timeoutId = setTimeout(() => {
        // Prevents rapid consecutive updates within 1s window
      }, 1000);
    };

    // Listen for various user interaction events
    const events = ["mousemove", "keydown", "click", "touchstart", "wheel"];

    // Attach event listeners for all user interaction events
    events.forEach((event) => {
      window.addEventListener(event, updateActivity);
    });

    // Cleanup: remove all event listeners and clear timeout on unmount
    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, [setLastActivityTime]);
};

export default useSession;