import { axiosClient } from "../api/axios-client";
import { supabase } from "../lib/supabase";
import type { ApiResponse, PageResponse } from "../types/api.response";
import type {
  Patient,
  PatientHistory,
  PatientInsert,
  PatientUpdate,
} from "../types/patient.type";

// Thêm bệnh nhân
export const addPatientApi = async (patient: PatientInsert) => {
  const res = await axiosClient.post<ApiResponse>("/v1/patients", patient);

  return res.data;
};

// Thêm danh sách bệnh nhân - import file excel
export const addPatientsApi = async (patients: PatientInsert[]) => {
  const res = await axiosClient.post<ApiResponse>(
    "/v1/patients/import",
    patients,
  );
  return res.data;
};

export const getPatientsApi = async (params: {
  page: number;
  pageSize: number;
  search?: string;
}) => {
  const { page, pageSize, search } = params;

  const res = await axiosClient<ApiResponse<PageResponse>>(
    `/v1/patients?page=${page}&size=${pageSize}&search=${search}`,
  );

  return res.data;
};

export const getAllPatientsExportApi = async (search: string) => {
  const res = await axiosClient.get<ApiResponse<Patient[]>>(
    `/v1/patients/export?search=${search}`,
  );
  return res.data;
};

export const deletePatientApi = async (id: string) => {
  const res = await axiosClient.delete(`/v1/patients/${id}`);
  return res.data;
};

export const updatePatientApi = async ({
  patientId,
  patientUpdate,
}: {
  patientId: string;
  patientUpdate: PatientUpdate;
}) => {
  return await supabase
    .from("patients")
    .update({
      full_name: patientUpdate.full_name,
      gender: patientUpdate.gender,
      phone_number: patientUpdate.phone_number,
      address: patientUpdate.address,
      date_of_birth: patientUpdate.date_of_birth,
    })
    .eq("id", patientId);
};

// API xóa nhiều bệnh nhân
export const deletePatientsApi = async (patientIds: string[]) => {
  const res = await axiosClient.delete("/v1/patients", {
    data: patientIds,
  });

  return res.data;
};

export const selectPatientApi = async (params: { search?: string }) => {
  const { search } = params;
  let query = supabase
    .from("patients")
    .select(
      `
        id,
        patient_code,
        full_name,
        gender,
        phone_number,
        date_of_birth,
        address
     `,
    )
    .limit(10); // Giới hạn 10 patients

  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,phone_number.ilike.%${search}%`,
    );
  }

  return await query;
};

// Api lấy danh sách medical record của bệnh nhân
export const getPatientMedicalHistory = async (patientId: string) => {
  const { data, error } = await supabase
    .from("medical_records")
    .select(
      `
    *,
    appointment:appointments!inner(
      patient_id,
      start_time,
      room:rooms(room_name) 
    ),
    files:files(*),
    payments:payments(
      *,
      service:services(
        service_name
      )
    ),
    prescriptions:prescriptions(
      *,
      prescription_items:prescription_items(*)
    )
  `,
    )
    .eq("appointment.patient_id", patientId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Lỗi khi lấy hồ sơ:", error);
    return null;
  }

  return data as unknown as PatientHistory[];
};

// Lấy tổng số bệnh nhân hôm nay
