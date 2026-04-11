import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
import { useAuthStore } from "./stores/useAuthStore";

export const Test = () => {
  const navigate = useNavigate();

  const clearSession = useAuthStore((state) => state.clearSession);
  const user = useAuthStore((state) => state.user);

  const onLogout = async () => {
    try {
      await supabase.auth.signOut();

      clearSession();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <p>Nhân viên</p>

      <p>Hello, {user?.fullName}</p>
      <p>Role: {user?.roleName}</p>

      <button
        className="bg-blue-500 px-2 py-3 cursor-pointer"
        onClick={() => onLogout()}
      >
        Đăng xuất
      </button>
    </div>
  );
};
