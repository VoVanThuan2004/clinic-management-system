import { supabase } from "../lib/supabase";
import type { MedicalRecordDetail, MedicalRecordPDF } from "../types/medical-record.type";

// API kiểm tra medical record của bệnh nhân theo lịch hẹn có tồn tại chưa
export const checkMedicalRecord = async (appointment_id: string) => {
  return await supabase
    .from("medical_records")
    .select("record_id")
    .eq("appointment_id", appointment_id)
    .single();
};

// API tạo mới medical record
export const createMedicalRecord = async ({
  appointment_id,
  doctor_id,
  patient_id,
}: {
  appointment_id: string;
  doctor_id: string;
  patient_id: string;
}) => {
  return await supabase
    .from("medical_records")
    .insert({ appointment_id, doctor_id, patient_id })
    .select("record_id")
    .single();
};

// Api lấy chi tiết medical record
export const getMedicalRecordDetails = async (recordId: string) => {
  const { data, error } = await supabase
    .from("medical_records")
    .select(
      `
      record_id,
      appointment_id,
      symptoms,
      diagnosis,
      notes,
      payment_status,
      created_at,
      profiles:doctor_id (id, fullname), 
      patients:patient_id (id, full_name, phone_number, gender, date_of_birth),
      files (file_id, file_url, file_type)
    `,
    )
    .eq("record_id", recordId)
    .single();

  if (error) throw error;

  // Ép kiểu data về MedicalRecordDetail để xóa bỏ định dạng mảng giả
  return { data: data as unknown as MedicalRecordDetail };
};

// Api lưu thông tin khám
export const saveMedicalInfo = async (
  recordId: string,
  symptoms: string,
  diagnosis: string,
  notes: string,
) => {
  return await supabase
    .from("medical_records")
    .update({
      symptoms,
      diagnosis,
      notes,
    })
    .eq("record_id", recordId);
};

// Api lấy danh sách medical records
export const getMedicalRecords = async (params: {
  page: number;
  pageSize: number;
  search?: string;
  doctorId?: string;
  paymentStatus?: boolean | null;
}) => {
  const { search, page, pageSize, doctorId, paymentStatus } = params;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("medical_records")
    .select(
      `
          record_id,
          symptoms,
          diagnosis,
          notes,
          payment_status,
          patients!inner (
            full_name,
            phone_number
          ),
          profiles (
            fullname,
            avatarurl
          )
        `,
    )
    .range(from, to)
    .order("created_at", { ascending: false });

  if (doctorId) {
    query = query.eq("doctor_id", doctorId);
  }

  if (search) {
    query = query.ilike("patients.full_name", `%${search}%`);
  }

  if (paymentStatus === true) {
    query = query.eq("payment_status", paymentStatus)
  }

  if (paymentStatus === false) {
    query = query.eq("payment_status", paymentStatus)
  }

  const res = await query;

  return res.data?.map((item) => ({
    ...item,
    patients: Array.isArray(item.patients) ? item.patients[0] : item.patients,
    profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles,
  }));
};

// Api xác nhận thanh toán medical record
export const payMedicalRecord = async (params: {
  recordId: string;
  serviceFee: number;
  totalMedicine: number;
  totalAmount: number;
}) => {
  const { recordId, serviceFee, totalMedicine, totalAmount } = params;

  // insert dữ liệu vào payments
  const { data, error } = await supabase
    .from("payments")
    .insert({
      record_id: recordId,
      service_fee: serviceFee,
      total_medicine: totalMedicine,
      total_amount: totalAmount,
      payment_status: true,
      payment_method: "cash"
    })
    .select("payment_id")
    .single();

  if (error) throw error;

  // Cập nhật trạng thái medical records
  if (data) {
    const { data: appointment, error: medicalRecordError } = await supabase
      .from("medical_records")
      .update({
        payment_status: true,
      })
      .eq("record_id", recordId)
      .select("appointment_id")
      .single();

    if (medicalRecordError) throw error;

    // Cập nhật trạng thái appointment
    if (appointment) {
      const { error: appointmentError } = await supabase
        .from("appointments")
        .update({
          status: "completed",
        })
        .eq("appointment_id", appointment.appointment_id);

      if (appointmentError) throw error;
    }
  }
};


// Api lấy chi tiết hồ sơ khám - xuất ra pdf
export const getMedicalRecordPDF = async (recordId: string) => {
  const { data, error } = await supabase
    .from("medical_records")
    .select(`
      record_id,
      appointment_id,
      symptoms,
      diagnosis,
      notes,
      payment_status,
      created_at,

      appointments:appointment_id (
        services:service_id (
          service_id,
          service_name,
          price
        )
      ),

      profiles:doctor_id (
        fullname,
        doctor_details (
          specialty
        )
      ), 

      patients:patient_id (
        full_name,
        phone_number,
        gender,
        date_of_birth
      ),

      files (
        file_id,
        file_url,
        file_type
      ),

      prescriptions (
        created_at,
        prescription_items (
          medicine_name,
          price,
          quantity,
          dosage
        )
      ),

      payments (
        service_fee,
        total_medicine,
        total_amount,
        payment_method
      )
    `)
    .eq("record_id", recordId)
    .single();

  if (error) throw error;

  const appointmentData: any = data?.appointments;
    
    // Nếu appointments là mảng, lấy phần tử 0. Nếu là object, lấy chính nó.
    const appointment = Array.isArray(appointmentData) ? appointmentData[0] : appointmentData;
    
    // Tương tự cho services nằm bên trong appointment
    const serviceData = appointment?.services;
    const serviceInfo = Array.isArray(serviceData) ? serviceData[0] : serviceData;
  
  const formattedData = {
    ...data,
    services: serviceInfo || null,
  };

  return { data: formattedData as unknown as MedicalRecordPDF };
};
