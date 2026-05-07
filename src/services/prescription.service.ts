import { axiosClient } from "../api/axios-client";
import { supabase } from "../lib/supabase";
import type { ApiResponse } from "../types/api.response";
import type {
  Prescription,
  PrescriptionItemAdd,
} from "../types/prescription.type";

// Lấy danh sách thuốc đã kê trong prescription thuộc medical record
export const getPrescriptionByRecordId = async (recordId: string) => {
  const res = await axiosClient.get<ApiResponse<Prescription>>(
    `/v1/prescriptions/${recordId}`,
  );
  return res.data;
};

// Tạo toa thuốc
export const createPrescription = async (recordId: string) => {
 const res = await axiosClient.post<ApiResponse>(
    "/v1/prescriptions",
    {
      medicalRecordId: recordId,
    }
  );
  return res.data;
};

// Thêm thuốc vào toa
export const addMedicineToPrescription = async (item: PrescriptionItemAdd) => {
  const res = await axiosClient.post<ApiResponse>("/v1/items", item);
  return res.data;
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
  const res = await axiosClient.delete<ApiResponse>(`/v1/items/${itemId}`);
  return res.data;
};

// Cập nhật số lượng thuốc trong toa thuốc
export const updateQuantityItem = async (
  itemId: string,
  newQuantity: number,
) => {
  const res = await axiosClient.put<ApiResponse>(
    `/v1/items/${itemId}/quantity?newQuantity=${newQuantity}`
  );
  return res.data;
};

// Cập nhật liều lượng trong prescription item
export const updateDosagePrescriptionItem = async (
  itemId: string,
  dosage: string,
) => {
  const res = await axiosClient.put<ApiResponse>(
    `/v1/items/${itemId}/dosage?dosage=${encodeURIComponent(dosage)}`
  );
  return res.data;
};