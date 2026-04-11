import { supabase } from "../lib/supabase";
import type { FileRecord } from "../types/medical-record.type";

export const getFilesByRecordId = async (recordId: string) => {
  const { data, error } = await supabase
    .from("files")
    .select(
      `
        file_id,
        file_url,
        file_type
        `,
    )
    .eq("record_id", recordId)
    .order("uploaded_at", { ascending: false });

  if (error) throw error;
  return { data: data as unknown as FileRecord[] };
};

export const uploadFileRecord = async ({
  recordId,
  fileObj,
  filePath,
}: {
  recordId: string;
  fileObj: File;
  filePath: string;
}) => {
  // Upload Storage
  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(filePath, fileObj);
  if (uploadError) throw uploadError;

  // Get URL & Insert DB
  const { data: urlData } = supabase.storage
    .from("images")
    .getPublicUrl(filePath);
  await supabase.from("files").insert([
    {
      record_id: recordId,
      file_url: urlData.publicUrl,
      file_type: fileObj.type,
    },
  ]);
};

export const deleteFileRecord = async (fileId: string, fileUrl: string) => {
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
    console.error("Xóa thất bại. Data trả về:", data, "Error:", error);
    throw new Error("File vật lý không tồn tại hoặc sai đường dẫn.");
  }

  // 4. Xóa DB
  await supabase.from("files").delete().eq("file_id", fileId);
};
