import dayjs from "dayjs";

import type {
  PatientExcelRow,
  PatientInsert,
} from "../../../types/patient.type";

// map giới tính text → number
const mapGender = (gender: string) => {
  if (gender === "Nam") return 1;
  if (gender === "Nữ") return 0;
  return 2; // khác
};

// parse ngày về chuẩn DB
const parseDate = (value: string | number): string | null => {
  if (!value) return null;

  if (typeof value === "number") {
    // 1. Chuyển đổi số 38086 thành Date chuẩn
    const date = new Date(Math.round((value - 25569) * 864e5));
    
    // 2. Lấy Ngày, Tháng, Năm thô ra
    let day = date.getUTCDate();
    let month = date.getUTCMonth() + 1; 
    const year = date.getUTCFullYear();

    if (day <= 12) {
      const temp = day;
      day = month;
      month = temp;
    }

    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  // Trường hợp Excel đọc ra String "4/9/2004"
  const cleanStr = String(value).trim();
  const d = dayjs(cleanStr, ["DD/MM/YYYY", "D/M/YYYY", "YYYY-MM-DD"], true);
  return d.isValid() ? d.format("YYYY-MM-DD") : null;
};

export const transformPatientExcel = (
  rows: PatientExcelRow[],
): PatientInsert[] => {
  return rows
    .map((row): PatientInsert | null => {
      // validate tối thiểu
      if (!row["Họ tên"]) return null;

      return {
        fullName: row["Họ tên"].trim(),
        dateOfBirth: parseDate(row["Ngày sinh"]),
        gender: mapGender(row["Giới tính"]),
        phoneNumber: String(row["SĐT"] ?? "").trim(),
        address: row["Địa chỉ"].trim(),
      };
    })
    .filter((item): item is PatientInsert => item !== null);
};
