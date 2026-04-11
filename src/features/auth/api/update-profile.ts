import { supabase } from "../../../lib/supabase";
import type { UserUpdate } from "../types/user.type";

export const updateProfileApi = async (data: UserUpdate) => {
  // Nếu có upload avatar, gọi storage supabase để upload ảnh trước
  let avatarUrl = "";
  if (data.avatar) {
    if (data.prevAvatar) {
      // Xóa ảnh cũ
      await deleteAvatar(data.prevAvatar as string);
    }

    // ảnh lưu trong bucket images -> thư mục avatars -> lưu file vào thư mục avatars
    const { data: storageData, error } = await supabase.storage
      .from("images")
      .upload(`avatars/${data.avatar.name}-${Date.now()}`, data.avatar);

    if (error) {
      console.log(error);
      throw new Error("Failed to upload avatar");
    }

    // Lấy url của ảnh sau khi upload thành công
    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(storageData.path);

    avatarUrl = publicUrlData.publicUrl;
  }

  // Gọi api supabase cập nhật profile
  if (data.avatar) {
    return await supabase
      .from("profiles")
      .update({
        fullname: data.fullname,
        phonenumber: data.phonenumber,
        avatarurl: avatarUrl,
      })
      .eq("id", data.id);
  }

  return await supabase
    .from("profiles")
    .update({
      fullname: data.fullname,
      phonenumber: data.phonenumber,
    })
    .eq("id", data.id);
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
