import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNotificationStore } from "../../stores/useNotificationStore";
import { deleteNotificationApi } from "../../services/notification.service";

export const useDeleteNotification = () => {
    const queryClient = useQueryClient();
    const decreaseTotalNotifications = useNotificationStore((state) => state.decreaseNotifications);

    return useMutation({
        mutationFn: (notificationId: string) => deleteNotificationApi(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            decreaseTotalNotifications();
        }
    })
}