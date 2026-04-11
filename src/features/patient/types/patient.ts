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


export type PatientDTO = {
  full_name: string;
  date_of_birth: string;
  gender: number;
  phone_number: string;
  address: string;
};

// Raw data tiêu đề đọc từ Excel
export type PatientExcelRow = {
  "Họ tên": string;
  "Ngày sinh": string | number;
  "Giới tính": string;
  "SĐT": string;
  "Địa chỉ": string;
}

// Data chuẩn để insert DB
export type PatientInsert = {
  patient_code: string;
  full_name: string;
  date_of_birth: string | null; // YYYY-MM-DD
  gender: number;
  phone_number: string;
  address: string;
}
