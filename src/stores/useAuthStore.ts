import { create } from "zustand";
import { getProfileApi } from "../services/user.service";
import { tokenStorage } from "../utils/tokenStorage";

type User = {
  userId: string;
  fullName: string;
  roleName: string;
  avatarUrl: string | null;
};

type AuthState = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: User | null;
  setSession: (user: User) => void;
  clearSession: () => void;
  authInit: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isInitialized: false,

  user: null,

  setSession: (user: User) => {
    set({ isAuthenticated: true, user });
  },

  clearSession: () => {
    set({ isAuthenticated: false, user: null, isInitialized: true });
    localStorage.clear();
  },

  authInit: async () => {
    // Gọi api get profile của user
    try {
      if (tokenStorage.getAccessToken === null || !tokenStorage.getAccessToken()) {
        set({ isAuthenticated: false, user: null, isInitialized: true });
        return;
      }
      const res = await getProfileApi();

      if (res.status === "success") {
        const userInfo = res.data;
        set({
          isAuthenticated: true,
          isInitialized: true,
          user: {
            userId: userInfo?.userId as string,
            fullName: userInfo?.fullName as string,
            roleName: userInfo?.role as string,
            avatarUrl: userInfo?.avatarUrl as string,
          },
        });
      }
    } catch (error) {
      set({ isAuthenticated: false, user: null, isInitialized: true });
      console.log(error);
    }
  },
}));
