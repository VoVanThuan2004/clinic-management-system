import z from "zod";
import { useAuthStore } from "../../../stores/useAuthStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useProfile } from "../hooks/useProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import type { ProfileType } from "../../../types/user.type";
import { message } from "antd";

const profileSchema = z.object({
  fullname: z.string().min(1, "Họ tên không được để trống"),
  phonenumber: z
    .string("Số điện thoại là bắt buộc")
    .min(10, "Số điện thoại phải có ít nhất 10 chữ số"),
});

export const Profile = () => {
  const user = useAuthStore((state) => state.user);
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate();

  // State quản lý upload ảnh
  const [previewImage, setPreviewImage] = useState("");
  const [fileError, setFileError] = useState("");
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  // Gọi hook api lấy ra profile
  const { data } = useProfile({ userId: user?.userId as string });
  const profile = data?.data as unknown as ProfileType;

  // Gọi hook api cập nhật profile
  const useUpdateProfileMutate = useUpdateProfile();

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(profileSchema) });

  useEffect(() => {
    if (profile) {
      reset({
        fullname: profile.fullname || "",
        phonenumber: profile.phonenumber || "",
      });
    }
  }, [profile, reset]);

  const handleUpdateProfile = (data: z.infer<typeof profileSchema>) => {
    if (!data) return;

    // Nếu có upload ảnh mới
    if (previewImage) {
      useUpdateProfileMutate.mutate(
        {
          id: profile?.id,
          fullname: data.fullname,
          phonenumber: data.phonenumber,
          avatar: previewFile as File,
          prevAvatar: profile?.avatarurl as string,
        },
        {
          onSuccess: () => {
            message.success("Cập nhật thông tin thành công");

            // Cập nhật lại state
            setSession({
              userId: profile?.id,
              roleName: profile.roles?.name as string,
              fullName: data.fullname,
              avatarUrl: previewImage,
            });
          },
          onError: () => {
            message.error("Cập nhật thông tin thất bại. Vui lòng thử lại.");
          },
        },
      );
    } else {
      useUpdateProfileMutate.mutate(
        {
          id: profile?.id,
          fullname: data.fullname,
          phonenumber: data.phonenumber,
        },
        {
          onSuccess: () => {
            message.success("Cập nhật thông tin thành công");

            // Cập nhật lại state
            setSession({
              userId: profile?.id,
              roleName: profile.roles?.name as string,
              fullName: data.fullname,
              avatarUrl: profile?.avatarurl,
            });
          },
          onError: () => {
            message.error("Cập nhật thông tin thất bại. Vui lòng thử lại.");
          },
        },
      );
    }
  };

  // Hàm xử lý upload ảnh
  const handleUploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // reset lỗi
    setFileError("");

    if (!file) return;

    // Chỉ upload 1 file
    if ((e.target.files?.length as number) > 1) {
      setFileError("Chỉ được upload 1 ảnh");
      return;
    }

    // Kiểm tra định dạng file
    if (!file.type.startsWith("image/")) {
      setFileError("File ảnh định dạng không hợp lệ");
      return;
    }

    // Kiểm tra kích thước file
    if (file.size > 5 * 1024 * 1024) {
      setFileError("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    setPreviewImage(URL.createObjectURL(file));
    setPreviewFile(file);
  };

  return (
    <div className="mx-8 py-5 mt-5 shadow-sm rounded-lg bg-white">
      <div className="flex flex-col gap-3">
        {/* Ảnh avatar + upload ant design */}
        <div className="flex flex-col items-center gap-4">
          {/* Avatar */}
          <img
            src={previewImage || profile?.avatarurl}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover shadow-md border border-blue-200"
          />

          {/* Upload */}
          <div>
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleUploadAvatar(e)}
            />
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer inline-block px-4 py-2 text-blue-500 border border-blue-500 rounded-lg bg-white hover:bg-blue-50 hover:border-blue-600 hover:text-blue-600 transition"
            >
              Upload ảnh mới
            </label>

            {fileError && <p className="text-red-500 text-sm">{fileError}</p>}
          </div>
        </div>

        {/* Form thông tin user, thông tin email, rolename không thay đổi */}
        <div className="flex flex-col gap-5 md:px-12 px-4">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(handleUpdateProfile)}
          >
            <div className="flex justify-between gap-5">
              {/* Email (readonly) */}
              <div className="flex flex-col gap-1 flex-1">
                <label className="font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={profile?.email || ""}
                  readOnly
                  className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg py-2 px-4 cursor-not-allowed"
                />
              </div>

              {/* Họ tên */}
              <div className="flex flex-col gap-1 flex-1">
                <label className="font-medium text-gray-700">Họ tên</label>
                <input
                  type="text"
                  placeholder="Họ tên"
                  className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                  {...register("fullname")}
                />

                {errors.fullname && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullname.message}
                  </p>
                )}
              </div>
            </div>

            {/* Số điện thoại */}
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Số điện thoại</label>
              <input
                type="tel"
                placeholder="Số điện thoại"
                className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                {...register("phonenumber")}
              />

              {errors.phonenumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phonenumber.message}
                </p>
              )}
            </div>

            {/* Vai trò (readonly) */}
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Vai trò</label>
              <input
                type="text"
                value={
                  user?.roleName === "employee"
                    ? "Nhân viên"
                    : user?.roleName === "doctor"
                      ? "Bác sĩ"
                      : "Quản trị viên"
                }
                readOnly
                className="border border-gray-200 bg-gray-100 text-gray-500 rounded-lg py-2 px-4 cursor-not-allowed"
              />
            </div>

            <div className="flex justify-end mt-2 gap-3">
              <button
                type="button"
                className="px-6 py-2 bg-white text-blue-500 border border-blue-400 rounded-lg font-medium hover:bg-blue-100 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                onClick={() => navigate(-1)}
              >
                Trở về
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                disabled={useUpdateProfileMutate.isPending}
              >
                {useUpdateProfileMutate.isPending
                  ? "Đang cập nhật..."
                  : "Cập nhật"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
