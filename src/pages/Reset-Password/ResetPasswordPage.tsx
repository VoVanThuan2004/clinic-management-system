import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { message } from "antd";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../stores/useAuthStore";
import { changePassword } from "../../services/auth.service";

const resetSchema = z.object({
  password: z.string().min(8, "Mật khẩu phải có ít nhất tối thiểu 8 ký tự"),
});

type ResetPasswordFormValues = {
  password: string;
};

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", ""));

    const error = params.get("error");

    // link lỗi hoặc hết hạn
    if (error) {
      message.error("Link không hợp lệ hoặc đã hết hạn");
      supabase.auth.signOut();
      clearSession();
      navigate("/login");
      return;
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetSchema) });

  const onResetPassword = async (values: ResetPasswordFormValues) => {
    setIsLoading(true);
    try {
      await changePassword(values.password);
      message.success("Đổi mật khẩu thành công");

      await supabase.auth.signOut();
      clearSession();
      navigate("/login");
    } catch (error) {
      console.log(error);
      message.error("Có lỗi xảy ra");
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="flex flex-col max-w-md w-full mx-auto shadow-2xl rounded-xl bg-white py-8 px-8 relative">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-sm text-gray-500 hover:text-black cursor-pointer"
        >
          ← Quay lại
        </button>

        {/* Title */}
        <div className="flex flex-col items-center gap-1 mb-6 mt-3">
          <p className="text-3xl font-bold">Khôi phục mật khẩu</p>
          <p className="text-sm text-gray-500">
            Nhập mật khẩu mới để hoàn tất khôi phục
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onResetPassword)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1 mb-4">
            <label className="font-medium">Mật khẩu mới</label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu mới"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-blue-400 focus:ring-1"
                {...register("password")}
              />

              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="gray" />
                ) : (
                  <Eye size={20} color="gray" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-[14px]">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 w-full px-3 py-4 rounded-xl text-white text-xl font-medium shadow-md mb-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            )}

            {isLoading ? "Đang khôi phục..." : "Khôi phục mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
};
