import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNotificationStore } from "../stores/useNotificationStore";

const AppProviders = ({ children }: { children: React.ReactNode }) => {

  const [queryClient] = useState(() => new QueryClient());

  // Khi reload lại page
  const authInit = useAuthStore((state) => state.authInit);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const notificationInit = useNotificationStore((state) => state.init);

  useEffect(() => {
    const initializeApp = async () => {
      await authInit();
      await notificationInit();
    };
    initializeApp();
  }, []);

  if (!isInitialized) return null;

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default AppProviders;
