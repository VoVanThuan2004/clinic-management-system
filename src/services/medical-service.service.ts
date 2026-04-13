import { supabase } from "../lib/supabase";
import type {
  AddServiceParams,
  UpdateServiceParams,
} from "../types/service.type";

// Hàm lấy danh sách dịch vụ khám
export const selectMedicalService = async () => {
  return await supabase.from("services").select(`
                service_id,
                service_name   
            `);
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
export const getAllServices = async ({
  page,
  pageSize,
  search,
}: {
  page: number;
  pageSize: number;
  search?: string;
}) => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  let query = supabase
    .from("services")
    .select("*")
    .range(from, to)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`service_name.ilike.%${search}%`);
  }

  return await query;
};

// Thêm dịch vụ khám
export const addService = async (data: AddServiceParams) => {
  const { error } = await supabase.from("services").insert({
    service_name: data.service_name,
    price: data.price,
    description: data.description,
  });

  if (error) throw error;
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
export const updateService = async (data: UpdateServiceParams) => {
  const { service_id, service_name, price, description } = data;
  const { error } = await supabase
    .from("services")
    .update({
      service_name,
      price,
      description,
    })
    .eq("service_id", service_id);

  if (error) throw error;
};
