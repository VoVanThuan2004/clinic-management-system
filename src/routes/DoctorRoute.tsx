import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

export const DoctorRoute = () => {
  const roleName = useAuthStore((state) => state.user?.roleName);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated || roleName !== "doctor") {
    return <Navigate to={"/login"} replace />;
  }
  return <Outlet />;
};
