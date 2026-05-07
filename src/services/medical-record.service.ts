import { axiosClient } from "../api/axios-client";
import { supabase } from "../lib/supabase";
import type { ApiResponse, PageResponse } from "../types/api.response";
import type {
  MedicalRecordDetail,
  MedicalRecordPDF,
} from "../types/medical-record.type";

// API kiểm tra medical record của bệnh nhân theo lịch hẹn có tồn tại chưa
export const checkMedicalRecord = async (appointment_id: string) => {
  const res = await axiosClient.get<ApiResponse>(
    `/v1/medical-records/check?appointmentId=${appointment_id}`
  );
  return res.data;
};

// API tạo mới medical record
export const createMedicalRecordApi = async (appointmentId: string) => {
  const res = await axiosClient.post<ApiResponse>(
    "/v1/medical-records",
    {
      appointmentId
    }
  );
  return res.data;
};

// Api lấy chi tiết medical record
export const getMedicalRecordDetails = async (recordId: string) => {
  const res = await axiosClient.get<ApiResponse<MedicalRecordDetail>>(
    `/v1/medical-records/${recordId}`
  );
  return res.data;
};

// Api lưu thông tin khám
export const saveMedicalInfoApi = async (
  recordId: string,
  symptoms: string,
  diagnosis: string,
  notes: string,
) => {
  const res = await axiosClient.put<ApiResponse>(
    `/v1/medical-records/${recordId}`,
    {
      symptoms,
      diagnosis,
      notes
    }
  );
  return res.data;
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

  const queryParams: Record<string, any> = {
    page,
    size: pageSize,
  };
  
  if (search) queryParams.search = search;
  if (doctorId) queryParams.doctorId = doctorId;
  if (paymentStatus !== undefined && paymentStatus !== null) queryParams.paymentStatus = paymentStatus;

  const res = await axiosClient.get<ApiResponse<PageResponse<MedicalRecordDetail>>>(
    "/v1/medical-records",
    {
      params: queryParams,
    }
  );

  return res.data;
};

// Api xác nhận thanh toán medical record
export const payMedicalRecord = async (params: {
  recordId: string;
  serviceFee: number;
  totalMedicine: number;
  totalAmount: number;
}) => {
  // // insert dữ liệu vào payments
  // const { data, error } = await supabase
  //   .from("payments")
  //   .insert({
  //     record_id: recordId,
  //     service_fee: serviceFee,
  //     total_medicine: totalMedicine,
  //     total_amount: totalAmount,
  //     payment_status: true,
  //     payment_method: "cash"
  //   })
  //   .select("payment_id")
  //   .single();

  // if (error) throw error;

  // // Cập nhật trạng thái medical records
  // if (data) {
  //   const { data: appointment, error: medicalRecordError } = await supabase
  //     .from("medical_records")
  //     .update({
  //       payment_status: true,
  //     })
  //     .eq("record_id", recordId)
  //     .select("appointment_id")
  //     .single();

  //   if (medicalRecordError) throw error;

  //   // Cập nhật trạng thái appointment
  //   if (appointment) {
  //     const { error: appointmentError } = await supabase
  //       .from("appointments")
  //       .update({
  //         status: "completed",
  //       })
  //       .eq("appointment_id", appointment.appointment_id);

  //     if (appointmentError) throw error;
  //   }
  // }

  const { error } = await supabase.rpc("pay_medical_record_fn", {
    p_record_id: params.recordId,
    p_service_fee: params.serviceFee,
    p_total_medicine: params.totalMedicine,
    p_total_amount: params.totalAmount,
  });

  if (error) throw error;
};

// Api lấy chi tiết hồ sơ khám - xuất ra pdf
export const getMedicalRecordPDF = async (recordId: string) => {
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
    `,
    )
    .eq("record_id", recordId)
    .single();

  if (error) throw error;

  const appointmentData: any = data?.appointments;

  // Nếu appointments là mảng, lấy phần tử 0. Nếu là object, lấy chính nó.
  const appointment = Array.isArray(appointmentData)
    ? appointmentData[0]
    : appointmentData;

  // Tương tự cho services nằm bên trong appointment
  const serviceData = appointment?.services;
  const serviceInfo = Array.isArray(serviceData) ? serviceData[0] : serviceData;

  const formattedData = {
    ...data,
    services: serviceInfo || null,
  };

  return { data: formattedData as unknown as MedicalRecordPDF };
};

// Lấy tổng hồ sơ khám - có trạng thái payment status = true
export const getTotalMedicalRecord = async () => {
  const { count, error } = await supabase
    .from("medical_records")
    .select("record_id", { count: "exact", head: true })
    .eq("payment_status", true);

  if (error) throw error;

  return count || 0;
};
