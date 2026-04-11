import { supabase } from "../lib/supabase";
import type {
  Prescription,
  PrescriptionItemAdd,
} from "../types/prescription.type";

// Lấy danh sách thuốc đã kê trong prescription thuộc medical record
export const getPrescriptionByRecordId = async (
  recordId: string,
): Promise<{
  data: Prescription | null;
  error: any;
}> => {
  return await supabase
    .from("prescriptions")
    .select(
      `
      prescription_id,
      record_id,
      created_at,
      prescription_items (*)
    `,
    )
    .eq("record_id", recordId)
    .order("created_at", {
      ascending: false,
      foreignTable: "prescription_items",
    })
    .maybeSingle();
};

// Tạo toa thuốc
export const createPrescription = async (recordId: string) => {
  return await supabase.from("prescriptions").insert({
    record_id: recordId,
  });
};

// Thêm thuốc vào toa
export const addMedicineToPrescription = async (item: PrescriptionItemAdd) => {
  // Kiểm tra thuốc này đã có trong toa thuốc chưa
  // => Nếu có cộng quantity
  // => Ngược lại thêm mới
  const { data: existingItem } = await checkMedicineInPrescription(
    item.prescription_id,
    item.medicine_id,
  );
  if (existingItem) {
    return await supabase
      .from("prescription_items")
      .update({
        quantity: existingItem.quantity + item.quantity,
      })
      .eq("item_id", existingItem.item_id)
      .select();
  }

  return await supabase.from("prescription_items").insert({
    prescription_id: item.prescription_id,
    medicine_id: item.medicine_id,
    medicine_name: item.medicine_name,
    price: item.price,
    quantity: item.quantity,
    dosage: item.dosage,
    image_url: item.image_url,
  });
};

// Kiểm tra thuốc có trong toa thuốc hiện tại không
export const checkMedicineInPrescription = async (
  prescriptionId: string,
  medicineId: string,
) => {
  return await supabase
    .from("prescription_items")
    .select("item_id, quantity")
    .eq("prescription_id", prescriptionId)
    .eq("medicine_id", medicineId)
    .maybeSingle();
};

// Xóa thuốc ra khỏi toa
export const deletePrescriptionItem = async (itemId: string) => {
  return await supabase
    .from("prescription_items")
    .delete()
    .eq("item_id", itemId);
};

// Cập nhật số lượng thuốc trong toa thuốc
export const updateQuantityItem = async (
  itemId: string,
  newQuantity: number,
) => {
  return await supabase
    .from("prescription_items")
    .update({
      quantity: newQuantity,
    })
    .eq("item_id", itemId);
};

// Cập nhật liều lượng trong prescription item
export const updateDosagePrescriptionItem = async (
  itemId: string,
  dosage: string,
) => {
  return await supabase
    .from("prescription_items")
    .update({
      dosage: dosage,
    })
    .eq("item_id", itemId);
};


