import { supabase } from "../lib/supabase";
import type {
  AddMedicineParams,
  UpdateMedicineParams,
} from "../types/medicine.type";

type Props = {
  search?: string;
  category_id: string;
  page: number;
  pageSize: number;
};

export const getMedicinesByCategory = async (props: Props) => {
  const { category_id, page, pageSize, search } = props;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  if (category_id === "all" || !category_id) {
    let query = supabase
      .from("medicines")
      .select(
        "medicine_id, medicine_name, unit, original_price, selling_price, stock_quantity, image, description, category_id, status",
        { count: "exact" }, // Đếm tổng số record
      )
      .range(from, to)
      .order("created_at", { ascending: false });

    if (search) {
      query = query.ilike("medicine_name", `%${search}%`);
    }

    return await query;
  }
  let query = supabase
    .from("medicines")
    .select(
      "medicine_id, medicine_name, unit, original_price, selling_price, stock_quantity, image, description, status",
      { count: "exact" }, // Đếm tổng số record
    )
    .eq("category_id", category_id)
    .range(from, to)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("medicine_name", `%${search}%`);
  }
  return await query;
};

// Api thêm thuốc
export const addMedicine = async (medicine: AddMedicineParams) => {
  const {
    category_id,
    medicine_name,
    original_price,
    selling_price,
    stock_quantity,
    description,
    unit,
    fileObj,
    filePath,
  } = medicine;

  const urlData = await uploadFile(fileObj, filePath);

  // Tạo medicine
  const { error: medicineError } = await supabase.from("medicines").insert({
    category_id,
    medicine_name,
    unit,
    original_price,
    selling_price,
    stock_quantity,
    image: urlData,
    description,
  });

  if (medicineError) {
    throw medicineError;
  }
};

export const uploadFile = async (fileObj: File, filePath: string) => {
  // Upload Storage
  const { error: uploadError } = await supabase.storage
    .from("images")
    .upload(filePath, fileObj);
  if (uploadError) throw uploadError;

  // Get URL & Insert DB
  const { data: urlData } = supabase.storage
    .from("images")
    .getPublicUrl(filePath);
  return urlData.publicUrl;
};

export const deleteFile = async (fileUrl: string) => {
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
    throw error;
  }
};

export const deleteMedicine = async ({
  medicineId,
  fileUrl,
}: {
  medicineId: string;
  fileUrl: string;
}) => {
  await deleteFile(fileUrl);

  const { error } = await supabase
    .from("medicines")
    .delete()
    .eq("medicine_id", medicineId);
  if (error) throw error;

  return true;
};

export const updateMedicine = async (medicine: UpdateMedicineParams) => {
  let newImage = medicine.image;
  if (medicine.fileObj) {
    if (medicine.image) {
      console.log("medicineOldImage: ", medicine.image);
      await deleteFile(medicine.image);
    }
    const filePath = `medicines/${Date.now()}_${medicine.fileObj.name}`;
    newImage = await uploadFile(medicine.fileObj, filePath);
  }

  const { error: updateMedicineError } = await supabase
    .from("medicines")
    .update({
      category_id: medicine.category_id,
      medicine_name: medicine.medicine_name,
      original_price: medicine.original_price,
      selling_price: medicine.selling_price,
      stock_quantity: medicine.stock_quantity,
      unit: medicine.unit,
      description: medicine.description,
      image: newImage,
    })
    .eq("medicine_id", medicine.medicine_id);

  if (updateMedicineError) {
    throw updateMedicineError;
  }

  return true;
};
