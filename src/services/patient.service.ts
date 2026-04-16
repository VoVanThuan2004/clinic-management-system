import { supabase } from "../lib/supabase";
import type { PatientHistory, PatientInsert, PatientUpdate } from "../types/patient.type";

// Thêm bệnh nhân
export const addPatientApi = async (patient: PatientInsert) => {
  const { error } = await supabase.from("patients").insert(patient);

  if (error) {
    if (error.code === "23505") {
      throw new Error("PHONE_EXISTS");
    }

    throw error;
  }
};

// Thêm danh sách bệnh nhân - import file excel
export const addPatientsApi = async (patients: PatientInsert[]) => {
  const { error } = await supabase.from("patients").insert(patients);
  if (error) throw error;
};

export const getPatientsApi = async (params: {
  page: number;
  pageSize: number;
  search?: string;
}) => {
  const { page, pageSize, search } = params;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("patients")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  // Nếu có nội dung tìm kiếm
  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,phone_number.ilike.%${search}%`,
    );
  }

  return await query;
};

export const getAllPatientsApi = async () => {
  return await supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false });
};

export const deletePatientApi = async (id: string) => {
  return await supabase.from("patients").delete().eq("id", id);
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
  return await supabase.from("patients").delete().in("id", patientIds);
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
