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
    // const { data } = await supabase.auth.getSession();
    // if (data.session) {
    //   // Lấy thông tin userId
    //   const userId = data.session.user.id;

    //   // Gọi api get profile
    //   const { data: profileData, error: profileError } =
    //     await getProfileApi(userId);

    //   if (profileError) {
    //     set({ isAuthenticated: false, user: null, isInitialized: false });
    //     return;
    //   }

    //   const profile = profileData as unknown as ProfileType;
    //   if (profile) {
    //     set({
    //       isAuthenticated: true,
    //       isInitialized: true,
    //       user: {
    //         userId: userId,
    //         fullName: profile.fullname,
    //         roleName: profile.roles?.name as string,
    //         avatarUrl: profile.avatarurl,
    //       },
    //     });

    //     return;
    //   }

    //   set({ isAuthenticated: false, user: null, isInitialized: false });
    // } else {
    //   set({ isAuthenticated: false, user: null, isInitialized: true });
    // }

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
