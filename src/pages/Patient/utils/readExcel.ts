import * as XLSX from "xlsx";
import type { PatientExcelRow } from "../../../types/patient.type";

export const readExcelFile = async (file: File): Promise<PatientExcelRow[]> => {
  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const data = XLSX.utils.sheet_to_json<PatientExcelRow>(worksheet);

  return data;
};
