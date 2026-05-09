import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import { useQueryClient } from "@tanstack/react-query";
import SockJS from "sockjs-client";
import { useNotificationStore } from "../stores/useNotificationStore";

export const useWebSocket = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  const stompClient = useRef<Client | null>(null);
  const backendUrl = import.meta.env.VITE_API_BASE_URL;
  const increaseTotalNotifications = useNotificationStore(
    (state) => state.increaseNotifications,
  );

  useEffect(() => {
    if (!userId) return;

    const socket = new SockJS(`${backendUrl}/ws`);
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("WebSocket connected");

        // Subscribe vào queue của user
        stompClient.current?.subscribe(`/topic/notifications/${userId}`, (message) => {
          const newNotification = JSON.parse(message.body);
          increaseTotalNotifications();

          // Cập nhật cache trực tiếp
          queryClient.setQueryData(["notifications"], (oldData: any) => {
            if (!oldData) return oldData;

            // Thêm notification mới vào đầu pages
            return {
              ...oldData,
              pages: [
                {
                  ...oldData.pages[0],
                  data: {
                    ...oldData.pages[0].data,
                    content: [
                      newNotification,
                      ...(oldData.pages[0].data?.content || []),
                    ],
                    totalElements:
                      (oldData.pages[0].data?.totalElements || 0) + 1,
                  },
                },
                ...oldData.pages.slice(1),
              ],
            };
          });
        });
      },
      onDisconnect: () => {
        console.log("WebSocket disconnected");
      },
    });

    stompClient.current.activate();

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [userId, queryClient]);
};
