import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

export const PublicRoute = () => {
  // Kiểm tra trạng thái có đăng nhập hay không
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  console.log(isAuthenticated);
  console.log(user?.roleName);
  
  

  if (isAuthenticated && user?.roleName === "EMPLOYEE") {
    return <Navigate to={"/employee"} replace />;
  }

  if (isAuthenticated && user?.roleName === "DOCTOR") {
    return <Navigate to={"/doctor"} replace />;
  }

  if (isAuthenticated && user?.roleName === "ADMIN") {
    return <Navigate to={"/admin"} replace />;
  }

  return <Outlet />;
};
