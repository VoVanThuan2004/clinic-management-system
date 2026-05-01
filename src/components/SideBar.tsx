import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { sidebarConfig } from "../lib/sidebar.config";
import { SidebarItem } from "./SidebarItem";
import { SidebarGroup } from "./SidebarGroup";
import { LogOut } from "lucide-react";
import { logoutApi } from "../services/auth.service";

export const SideBar = () => {
  const navigate = useNavigate();
  const clearSession = useAuthStore((state) => state.clearSession);
  const user = useAuthStore((state) => state.user);

  const menu = sidebarConfig[user?.roleName as string] || [];

  // const handleLogout = () => {
  //   navigate("/login");
  //   clearSession();
  // };

  const handleLogoutV2 = async () => {
    try {
      const res = await logoutApi();
      
      if (res.status === "success") {
        navigate("/login");
        clearSession();
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <div className="w-60 h-screen bg-white shadow-sm flex flex-col p-4">
      {/* Title */}
      <h2 className="text-blue-600 font-semibold text-lg">Clinic System</h2>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto mt-6 space-y-4 pr-1">
        {menu.map((item) =>
          item.children ? (
            <SidebarGroup key={item.key} item={item} />
          ) : (
            <SidebarItem key={item.key} item={item} />
          ),
        )}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogoutV2}
        className="mt-4 flex items-center justify-center gap-3 py-2 cursor-pointer"
      >
        <LogOut className="text-blue-600" size={20} />
        <span className="text-blue-600">Đăng xuất</span>
      </button>
    </div>
  );
};
