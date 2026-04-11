import { getProfileApi } from "../features/auth/api/get-profile";
import { supabase } from "../lib/supabase";
import { create } from "zustand";
import type { ProfileType } from "../types/user.type";

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
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      // Lấy thông tin userId
      const userId = data.session.user.id;

      // Gọi api get profile
      const { data: profileData, error: profileError } =
        await getProfileApi(userId);

      if (profileError) {
        set({ isAuthenticated: false, user: null, isInitialized: false });
        return;
      }

      const profile = profileData as unknown as ProfileType;
      if (profile) {
        set({
          isAuthenticated: true,
          isInitialized: true,
          user: {
            userId: userId,
            fullName: profile.fullname,
            roleName: profile.roles?.name as string,
            avatarUrl: profile.avatarurl,
          },
        });

        return;
      }

      set({ isAuthenticated: false, user: null, isInitialized: false });
    } else {
      set({ isAuthenticated: false, user: null, isInitialized: true });
    }
  },
}));
