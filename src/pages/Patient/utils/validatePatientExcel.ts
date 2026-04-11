import type { PatientExcelRow } from "../../../types/patient.type";

// Các cột bắt buộc phải có để import
const REQUIRED_FIELDS = ["Họ tên", "Ngày sinh", "Giới tính", "SĐT", "Địa chỉ"];

export const validatePatientExcel = (data: PatientExcelRow[]) => {
  if (!data || data.length === 0) return false;

  const keys = Object.keys(data[0]); 

  return REQUIRED_FIELDS.every((field) => keys.includes(field)); 
};
