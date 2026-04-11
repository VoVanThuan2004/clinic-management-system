import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

export const PublicRoute = () => {
  // Kiểm tra trạng thái có đăng nhập hay không
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (isAuthenticated && user?.roleName === "employee") {
    return <Navigate to={"/employee"} replace />;
  }

  if (isAuthenticated && user?.roleName === "doctor") {
    return <Navigate to={"/doctor"} replace />;
  }

  if (isAuthenticated && user?.roleName === "admin") {
    return <Navigate to={"/admin"} replace />;
  }

  return <Outlet />;
};
