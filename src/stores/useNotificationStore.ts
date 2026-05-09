import { create } from "zustand";
import { getTotalNotificationsApi } from "../services/notification.service";
import { tokenStorage } from "../utils/tokenStorage";

type NotificationState = {
  totalNotifications: number;
  increaseNotifications: () => void;
  decreaseNotifications: () => void;
  setTotalNotifications: (total: number) => void;
  reset: () => void;
  init: () => Promise<void>;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  totalNotifications: 0,
  increaseNotifications: () => {
    set((state) => ({
      totalNotifications: state.totalNotifications + 1,
    }));
  },
  decreaseNotifications: () => {
    set((state) => ({
      totalNotifications: Math.max(0, state.totalNotifications - 1),
    }));
  },
  setTotalNotifications: (total: number) => {
    set({ totalNotifications: total });
  },
  reset: () => {
    set({ totalNotifications: 0 });
  },
  init: async () => {
    const token = tokenStorage.getAccessToken();

    if (!token) {
      return;
    }
    try {
      const res = await getTotalNotificationsApi();
      if (res.status === "success") {
        set({ totalNotifications: res.data });
      }
    } catch (error) {
      console.log(error);
    }
  },
}));
