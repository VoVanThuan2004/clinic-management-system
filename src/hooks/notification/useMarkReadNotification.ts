import { useMutation, useQueryClient } from "@tanstack/react-query"
import { markAsReadNotificationApi } from "../../services/notification.service";
import { useNotificationStore } from "../../stores/useNotificationStore";

export const useMarkReadNotification = () => {
    const queryClient = useQueryClient();
    const decreaseTotalNotifications = useNotificationStore((state) => state.decreaseNotifications)

    return useMutation({
        mutationFn: (notificationId: string) => markAsReadNotificationApi(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            decreaseTotalNotifications();
        }
    })
}