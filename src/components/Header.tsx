import { useNavigate } from "react-router-dom";
import avatarTest from "../assets/react.svg";
import { useAuthStore } from "../stores/useAuthStore";
import { Dropdown, type MenuProps } from "antd";
import { Menu } from "lucide-react";

// function xác định navlink url tương ứng của từng role, hiển thị tiêu đề
const getHeaderTitleByRole = (roleName: string) => {
  const url = window.location.pathname;
  if (roleName === "employee") {
    if (url.includes("/employee/patients")) {
      return "Quản lý bệnh nhân";
    }
    if (url.includes("/employee/appointments")) {
      return "Quản lý lịch khám";
    }
    if (url.includes("/employee/medical-records")) {
      return "Quản lý hồ sơ khám";
    }
  } else if (roleName === "doctor") {
    if (url.includes("/doctor/appointments")) {
      return "Quản lý lịch khám";
    }
    if (url.includes("/employee/medical-records")) {
      return "Quản lý hồ sơ khám";
    }
  }
};

const getUrlProfileByRole = (roleName: string) => {
  if (roleName === "employee") {
    return "/employee/profile";
  } else if (roleName === "doctor") {
    return "/doctor/profile";
  } else if (roleName === "admin") {
    return "/admin/profile";
  }
};

const getUrlChangePasswordByRole = (roleName: string) => {
  if (roleName === "employee") {
    return "/employee/change-password";
  } else if (roleName === "doctor") {
    return "/doctor/change-password";
  } else if (roleName === "admin") {
    return "/admin/change-password";
  }
};

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Header = (props: Props) => {
  const { isOpen, setIsOpen } = props;
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const navigate = useNavigate();
  const urlProfile = getUrlProfileByRole(user?.roleName as string);
  const urlChangePassword = getUrlChangePasswordByRole(
    user?.roleName as string,
  );

  // Đăng xuất
  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: <p onClick={() => navigate(`${urlProfile}`)}>Thông tin cá nhân</p>,
    },
    {
      key: "change-password",
      label: (
        <p onClick={() => navigate(`${urlChangePassword}`)}>Đổi mật khẩu</p>
      ),
    },
    {
      type: "divider",
    },
    {
      // Gọi function logout khi click, có màu đỏ
      key: "logout",
      label: (
        <p onClick={handleLogout} className="text-red-500">
          Đăng xuất
        </p>
      ),
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-l border-gray-200 py-4 px-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Nút Menu ẩn hiển side bar */}
          <Menu
            size={25}
            className="md:hidden text-blue-600 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
          {/* Hiển thị tiêu đề dựa vào chức năng */}
          <h1 className="text-lg font-semibold text-gray-800 tracking-tight">
            {getHeaderTitleByRole(user?.roleName as string)}
          </h1>
        </div>

        {/* Thông tin info */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end leading-tight">
            <span className="text-sm font-medium text-gray-800">
              {user?.fullName}
            </span>
            <span className="text-xs text-gray-500">
              {user?.roleName === "employee" && "Nhân viên"}

              {user?.roleName === "doctor" && "Bác sĩ"}

              {user?.roleName === "admin" && "Quản trị viên"}
            </span>
          </div>

          <div className="relative">
            <Dropdown menu={{ items }} trigger={["click"]}>
              <img
                src={user?.avatarUrl || avatarTest}
                alt="avatar"
                className="w-9 h-9 rounded-full object-cover border border-gray-300 cursor-pointer hover:ring-1 hover:ring-blue-400 transition"
              />
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};
