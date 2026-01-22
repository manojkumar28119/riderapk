import { useEffect } from "react";
import { useNotificationStore } from "@/data/store/useNotificationStore";
import { notificationsService } from "@/services/notifications.service";
import { auth } from "@/lib/utils/auth";
import notificationSound from "@/assets/sounds/notification.wav";
import { wsService } from "@/services/api/websocket.service";

interface WebSocketMessage {
  payload: Record<string, any>;
}


export const NotificationsProvider = () => {
  const setNotifications = useNotificationStore((s) => s.setNotifications);
  const addNotification = useNotificationStore((s) => s.addNotification);

  const { data } = notificationsService.GetNotifications();

  const playNotification = () => {
    try {
      const audio = new Audio(notificationSound);
      audio.play().catch((error) => console.error("Audio play error:", error));
    } catch (error) {
      console.error("Failed to play notification sound:", error);
    }
  };

  useEffect(() => {
    // 1️⃣ Load history

    if (data) {
      setNotifications(data.data);


      // 2️⃣ Open socket
      wsService.connect(`${import.meta.env.VITE_WEB_SOCKET_URL as string}?userId=${auth.getUserId()}`);

      // 3️⃣ Live updates
      const unsubscribe = wsService.onMessage((data: unknown) => {
        const message = data as WebSocketMessage;
        if (message.payload) {
          console.log("Received WS notification");
          playNotification();
          addNotification(message.payload);
        }
      });

      return () => {
        unsubscribe();
        wsService.disconnect();
      };
    }
  }, [data]);

  return null;
};
