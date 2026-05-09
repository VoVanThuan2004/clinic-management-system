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
export const payMedicalRecordApi = async (params: {
  medicalRecordId: string;
  serviceFee: number;
  totalMedicine: number;
  totalAmount: number;
  paymentMethod: "CASH" | "BANKING";
}) => {
  const res = await axiosClient.post<ApiResponse>(
    "/v1/order-payments",
    params
  );
  return res.data;
};

// Api lấy chi tiết hồ sơ khám - xuất ra pdf
export const getMedicalRecordPDF = async (recordId: string) => {
  const res = await axiosClient.get<ApiResponse<MedicalRecordPDF>>(
    `/v1/medical-records/${recordId}/pdf`
  );
  return res.data;
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
