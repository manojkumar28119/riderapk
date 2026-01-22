import { apiClient } from "@services/api/axios.config";
import { endpoints } from "@/data/constants/endpoints";
import { useQuery ,  useMutation } from "@tanstack/react-query";
import { AxiosApiError } from "@/data/interfaces/api";

export const notificationsService = {
  GetNotifications: () => {
    return useQuery<any, AxiosApiError>({
      queryKey: ["notifications"],
      queryFn: async () => {
        const res = await apiClient.get(endpoints.notifications.getNotifications);
        return res.data;
      },
      refetchOnWindowFocus: false
    });
  },

  useMarkAsRead: () => {
    return useMutation<void, AxiosApiError, string[]>({
      mutationFn: async (notification_ids: string[]) => {
        await apiClient.patch(endpoints.notifications.markAsRead, {
          notification_ids
        });
      },
      onSuccess: () => {
        console.log('Marked as read');
      },
      onError: (error) => {
        console.error('Error marking as read:', error);
      }
    });
  }

};
