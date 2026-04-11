import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { sidebarConfig } from "../lib/sidebar.config";
import { SidebarItem } from "./SidebarItem";
import { SidebarGroup } from "./SidebarGroup";
import { LogOut } from "lucide-react";

// function xác định navlink tương ứng của từng role
// const getNavlinkByRole = (roleName: string) => {
//   if (roleName === "employee") {
//     return [
//       {
//         key: "1",
//         to: "/employee/patients",
//         icon: <Users size={20} />,
//         label: "Quản lý bệnh nhân",
//       },
//       {
//         key: "2",
//         to: "/employee/appointments",
//         icon: <Calendar size={20} />,
//         label: "Quản lý lịch khám",
//       },
//       {
//         key: "3",
//         to: "/employee/medical-records",
//         icon: <ClipboardPlus size={20} />,
//         label: "Quản lý hồ sơ khám",
//       },
//     ];
//   } else if (roleName === "doctor") {
//     return [
//       {
//         key: "1",
//         to: "/doctor/appointments",
//         icon: <Calendar size={20} />,
//         label: "Quản lý lịch khám",
//       },
//       {
//         key: "2",
//         to: "/doctor/medical-records",
//         icon: <ClipboardPlus size={20} />,
//         label: "Quản lý hồ sơ khám",
//       },
//     ];
//   }
// };

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
      <div className="flex flex-col gap-4 mt-6">
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
        className="mt-auto flex items-center justify-center gap-3 py-2"
      >
        <LogOut className="text-blue-600" size={20} />
        <span className="text-blue-600">Đăng xuất</span>
      </button>
    </div>
  );
};
