import { zodResolver } from "@hookform/resolvers/zod";
import { message } from "antd";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod";
import {
  changePasswordApi,
} from "../../services/auth.service";
import { Eye, EyeOff } from "lucide-react";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z.string().min(8, "Mật khẩu mới phải có ít nhất 8 ký tự"),
    confirmNewPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu mới"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Mật khẩu mới không được trùng mật khẩu hiện tại",
    path: ["newPassword"],
  });

export const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const handleChangePassword = async (
    values: z.infer<typeof changePasswordSchema>,
  ) => {
    

    setIsLoading(true);
    try {
      const res = await changePasswordApi({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
      });

      if (res.status === "success") {
        reset();
        message.success(res.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-8 py-6 mt-5 shadow-sm rounded-xl bg-white">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-1 pb-4">
          <h1 className="text-2xl font-semibold text-blue-600">Đổi mật khẩu</h1>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5 md:px-12 px-4">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(handleChangePassword)}
          >
            {/* Current password */}
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">
                Mật khẩu hiện tại
              </label>

              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  placeholder="Nhập mật khẩu hiện tại"
                  className="w-full border border-gray-300 rounded-lg py-2 px-4 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                  {...register("currentPassword")}
                />

                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            {/* New password */}
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Mật khẩu mới</label>

              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Nhập mật khẩu mới"
                  className="w-full border border-gray-300 rounded-lg py-2 px-4 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                  {...register("newPassword")}
                />

                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">
                Nhập lại mật khẩu mới
              </label>

              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full border border-gray-300 rounded-lg py-2 px-4 pr-10 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                  {...register("confirmNewPassword")}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.confirmNewPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmNewPassword.message}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end mt-3 gap-3">
              <button
                type="button"
                className="px-6 py-2 bg-white text-blue-500 border border-blue-400 rounded-lg font-medium hover:bg-blue-100 active:scale-[0.98] transition cursor-pointer"
                onClick={() => navigate(-1)}
              >
                Trở về
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 active:scale-[0.98] transition disabled:opacity-50 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Đang cập nhật..." : "Đổi mật khẩu"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
