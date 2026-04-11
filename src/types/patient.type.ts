import type { FileRecord } from "./medical-record.type";
import type { Prescription } from "./prescription.type";

// Data chuẩn để insert DB
export type PatientInsert = {
  patient_code: string;
  full_name: string;
  date_of_birth: string | null; // YYYY-MM-DD
  gender: number;
  phone_number: string;
  address: string;
}

// Raw data tiêu đề đọc từ Excel
export type PatientExcelRow = {
  "Họ tên": string;
  "Ngày sinh": string | number;
  "Giới tính": string;
  "SĐT": string;
  "Địa chỉ": string;
}

export type Patient = {
  id: string;
  patient_code: string;
  full_name: string;
  date_of_birth: string;
  gender: number;
  phone_number: string;
  address: string;
};

export type PatientUpdate = {
  full_name: string;
  date_of_birth: string;
  gender: number;
  phone_number: string;
  address: string;
};


// Type lịch sử bệnh nhân
export type PatientHistory = {
  record_id: string;
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
  symptoms: string;
  diagnosis: string;
  notes: string;
  consultant_fee: number;
  payment_status: boolean;
  created_at: string;
  updated_at?: string;
  appointment: AppointmentInfo;
  files: FileRecord[];
  payments: Payment[];
  prescriptions: Prescription;
}

export interface Payment {
  payment_id: string;
  service_fee: number;
  total_medicine: number;
  total_amount: number;
  payment_status: string;
  payment_method: string;
  paid_at: string | null;
  created_at: string;
}

export interface AppointmentInfo {
  patient_id: string;
  start_time: string;
  room: { room_name: string } | null; // Cập nhật dựa trên truy vấn có JOIN room
}
