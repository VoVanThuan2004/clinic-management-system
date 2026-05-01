import { axiosClient } from "../../../api/axios-client";
import { supabase } from "../../../lib/supabase";
import type { ApiResponse } from "../../../types/api.response";
import type { UserUpdate } from "../types/user.type";

export const updateProfileApi = async (data: UserUpdate) => {
  const formData = new FormData();

  formData.append(
    "data",
    new Blob([JSON.stringify({
      fullName: data.fullname,
      phoneNumber: data.phonenumber
    })], {
      type: "application/json",
    }),
  );

  // Nếu có upload ảnh
  if (data.avatar) {
    formData.append("file", data.avatar);
  }

  const res = await axiosClient.put<ApiResponse>(
    `/v1/users/${data.id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const deleteAvatar = async (fileUrl: string) => {
  // 1. Tách lấy Path từ URL
  const parts = fileUrl.split("/images/");
  let filePath = parts[parts.length - 1];

  // 2. GIẢI MÃ CHUỖI (Cực kỳ quan trọng)
  filePath = decodeURIComponent(filePath);

  // 3. Gọi lệnh xóa
  const { data, error } = await supabase.storage
    .from("images")
    .remove([filePath]);

  // Nếu data rỗng, nghĩa là filePath vẫn chưa khớp 100% với trên Dashboard
  if (error || !data || data.length === 0) {
    throw new Error("File ảnh không tồn tại hoặc sai đường dẫn.");
  }
};
