import { Calendar, ClipboardPlus, DoorOpen, LayoutDashboard, Pill, Stethoscope, Tags, Users } from "lucide-react";

export type SidebarItem = {
  key: string;
  label: string;
  to?: string;
  icon?: React.ReactNode;
  children?: SidebarItem[];
};

export const sidebarConfig: Record<string, SidebarItem[]> = {
  EMPLOYEE: [
    {
      key: "patients",
      to: "/employee/patients",
      icon: <Users size={20} />,
      label: "Quản lý bệnh nhân",
    },
    {
      key: "appointments",
      to: "/employee/appointments",
      icon: <Calendar size={20} />,
      label: "Quản lý lịch khám",
    },
    {
      key: "records",
      to: "/employee/medical-records",
      icon: <ClipboardPlus size={20} />,
      label: "Quản lý hồ sơ khám",
    },
  ],

  DOCTOR: [
    {
      key: "appointments",
      to: "/doctor/appointments",
      icon: <Calendar size={20} />,
      label: "Quản lý lịch khám",
    },
    {
      key: "records",
      to: "/doctor/medical-records",
      icon: <ClipboardPlus size={20} />,
      label: "Quản lý hồ sơ khám",
    },
  ],

  ADMIN: [
    {
      key: "users",
      label: "Quản lý người dùng",
      icon: <Users size={20} />,
      children: [
        {
          key: "patients",
          to: "/admin/users/patients",
          label: "Bệnh nhân",
        },
        {
          key: "doctors",
          to: "/admin/users/doctors",
          label: "Bác sĩ",
        },
        {
          key: "employees",
          to: "/admin/users/employees",
          label: "Nhân viên",
        },
      ],
    },

    {
      key: "rooms",
      to: "/admin/rooms",
      label: "Quản lý phòng",
      icon: <DoorOpen size={20} />,
    },

    {
      key: "services",
      to: "/admin/services",
      label: "Quản lý dịch vụ khám",
      icon: <Stethoscope size={20} />,
    },
    {
      key: "categories",
      to: "/admin/categories",
      label: "Quản lý danh mục",
      icon: <Tags size={20} />,
    },
    {
      key: "medicines",
      to: "/admin/medicines",
      label: "Quản lý thuốc",
      icon: <Pill size={20} />,
    },
      {
      key: "dashboard",
      to: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
  ],
};
