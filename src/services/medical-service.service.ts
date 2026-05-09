import { axiosClient } from "../api/axios-client";
import { supabase } from "../lib/supabase";
import type { ApiResponse, PageResponse } from "../types/api.response";
import type {
  MedicalServiceOption,
  MedicalServiceRequest,
  MedicalServiceResponse,
  UpdateMedicalServiceRequest,
} from "../types/medical-service.type";

// Hàm lấy danh sách dịch vụ khám
export const selectMedicalService = async () => {
  const res = await axiosClient.get<ApiResponse<MedicalServiceOption[]>>(
    "/v1/services/options",
  );

  return res.data;
};

// Hàm trả về chi phí dịch vụ khám theo record_id
export const getServiceFee = async (recordId: string) => {
  const { data, error } = await supabase
    .from("medical_records")
    .select(
      `
            record_id,
            appointment_id,
            appointments:appointment_id (
                service_id,
                services:service_id (
                    service_id,
                    service_name,
                    price
                )
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

  return {
    record_id: data.record_id,
    appointment_id: data.appointment_id,
    services: serviceInfo || null,
  };
};

// Lấy danh sách dịch vụ cho admin
export const getAllServicesApi = async ({
  page,
  pageSize,
  search,
}: {
  page: number;
  pageSize: number;
  search?: string;
}) => {
  const queryParams: Record<string, any> = {
    page,
    size: pageSize,
  };
  if (search) queryParams.search = search;

  const res = await axiosClient.get<
    ApiResponse<PageResponse<MedicalServiceResponse>>
  >("/v1/services", { params: queryParams });
  return res.data;
};

// Thêm dịch vụ khám
export const addServiceApi = async (data: MedicalServiceRequest) => {
  const res = await axiosClient.post<ApiResponse>("/v1/services", data);

  return res.data;
};

// Xóa dịch vụ khám
export const deleteService = async (serviceId: string) => {
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("service_id", serviceId);

  if (error) throw error;
};

// Cập nhật dịch vụ khám
export const updateServiceApi = async (data: UpdateMedicalServiceRequest) => {
  const { serviceId, serviceName, price, description } = data;

  const res = await axiosClient.put<ApiResponse>(`/v1/services/${serviceId}`, {
    serviceName,
    price,
    description,
  });

  return res.data;
};
