import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

export const EmployeeRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const roleName = useAuthStore((state) => state.user?.roleName);

  if (!isAuthenticated || roleName !== "EMPLOYEE") {
    return <Navigate to={"/login"} replace />;
  }

  return <Outlet />;
};
