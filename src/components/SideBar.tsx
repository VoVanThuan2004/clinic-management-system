import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { sidebarConfig } from "../lib/sidebar.config";
import { SidebarItem } from "./SidebarItem";
import { SidebarGroup } from "./SidebarGroup";
import { LogOut } from "lucide-react";

export const SideBar = () => {
  const navigate = useNavigate();
  const clearSession = useAuthStore((state) => state.clearSession);
  const user = useAuthStore((state) => state.user);

  const menu = sidebarConfig[user?.roleName as string] || [];

  const handleLogout = () => {
    navigate("/login");
    clearSession();
  };

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
        onClick={handleLogout}
        className="mt-4 flex items-center justify-center gap-3 py-2"
      >
        <LogOut className="text-blue-600" size={20} />
        <span className="text-blue-600">Đăng xuất</span>
      </button>
    </div>
  );
};
