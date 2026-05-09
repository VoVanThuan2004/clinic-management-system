import type { Prescription } from "./prescription.type";

export interface MedicalRecordDetail {
  medicalRecordId: string;
  symptoms: string | null;
  diagnosis: string | null;
  notes: string | null;
  paymentStatus: boolean;
  doctorName: string;
  patientName: string;
  phoneNumber: string;
  gender: number;
  dateOfBirth: string;
  address: string;
}

export interface MedicalRecord {
  record_id: string;
  symptoms: string;
  diagnosis: string;
  notes: string;
  payment_status: boolean;
  patients: {
    full_name: string;
    phone_number: string;
  };
  profiles: {
    fullname: string;
    doctor_details: {
      specialty: string;
    };
  };
}

export interface FileRecord {
  fileId: string;
  fileUrl: string;
  fileType: string;
}

export interface MedicalRecordPDF {
  // Thông tin bệnh nhân
  patientName: string;
  phoneNumber: string;
  gender: number;
  dateOfBirth: string;
  address: string;

  // Thông tin bác sĩ
  doctorName: string;
  specialty: string;

  // Thông tin hồ sơ khám
  symptoms: string;
  diagnosis: string;
  notes: string;

  // Thông tin toa thuốc
  prescriptions: Prescription;

  // Thông tin file upload
  recordFiles: FileRecord[];

  paymentMethod: string;
}
