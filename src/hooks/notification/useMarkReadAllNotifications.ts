import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAsReadAllNotificationsApi } from "../../services/notification.service";
import { useNotificationStore } from "../../stores/useNotificationStore";

export const useMarkReadAllNotifications = () => {
  const queryClient = useQueryClient();
  const setTotalNotifications = useNotificationStore((state) => state.setTotalNotifications)

  return useMutation({
    mutationFn: () => markAsReadAllNotificationsApi(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setTotalNotifications(0);
    },
  });
};
