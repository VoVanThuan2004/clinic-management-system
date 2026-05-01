import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

export const AdminRoute = () => {
  const roleName = useAuthStore((state) => state.user?.roleName);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated || roleName !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
