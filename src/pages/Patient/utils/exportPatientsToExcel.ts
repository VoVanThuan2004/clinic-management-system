
import * as XLSX from "xlsx";
import type { Patient } from "../../../types/patient.type";
import { formatDate } from "../../../utils/formatDate";

export const exportPatientsToExcel = (patients: Patient[]) => {
  if (!patients || patients.length === 0) return;

  const data = patients.map((p) => ({
    "Mã BN": p.patient_code,
    "Họ tên": p.full_name,
    "Ngày sinh": formatDate(p.date_of_birth),
    "Giới tính": p.gender === 1 ? "Nam" : "Nữ",
    "SĐT": p.phone_number,
    "Địa chỉ": p.address,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");

  XLSX.writeFile(workbook, "patients.xlsx");
};
