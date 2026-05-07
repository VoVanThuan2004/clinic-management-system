import { Dayjs } from "dayjs";
import { supabase } from "../lib/supabase";
import type {
  AppointmentCalendarProps,
  AppointmentData,
  AppointmentDetail,
  AppointmentDetailPDF,
  AppointmentResponse,
  AppointmentUpdate,
  BookedData,
} from "../types/appointment.type";
import { axiosClient } from "../api/axios-client";
import type { ApiResponse, PageResponse } from "../types/api.response";

export const getAppointmentsCalendar = async (
  props: AppointmentCalendarProps,
) => {
  const res = await axiosClient.get<ApiResponse<AppointmentResponse[]>>(
    `/v1/appointments/doctor?doctorId=${props.doctor_id}&startTime=${props.start_time}&endTime=${props.end_time}`,
  );
  return res.data;
};

export const getAppointmentList = async (params: {
  page: number;
  pageSize: number;
  search?: string;
  date?: Dayjs | null;
  doctorId?: string;
}) => {
  const { page, pageSize, search, date, doctorId } = params;

  const queryParams: Record<string, any> = {
    page,
    size: pageSize,
  };

  if (search) queryParams.search = search;
  if (doctorId) queryParams.doctorId = doctorId;
  if (date) queryParams.date = date.format("YYYY-MM-DD");

  const res = await axiosClient.get<ApiResponse<PageResponse>>(
    "/v1/appointments",
    {
      params: queryParams,
    },
  );

  return res.data;
};

export const getAppointments = async () => {
  const res = await supabase
    .from("appointments")
    .select(
      `
      appointment_id,
      start_time,
      status,
      reason,
      patients!inner (
        id,
        full_name,
        phone_number
      ),
      profiles!doctor_id (
        fullname
      )
    `,
    )
    .order("created_at", { ascending: false });

  return {
    data: res.data?.map((item) => ({
      ...item,
      patients: Array.isArray(item.patients) ? item.patients[0] : item.patients,
      profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles,
    })),
  };
};

export const getBookedSlotsApi = async ({
  doctorId,
  date,
  roomId,
}: {
  doctorId: string | null;
  date: string | null;
  roomId: string | null;
}) => {
  const queryParam: Record<string, any> = {};

  if (doctorId && doctorId !== "") {
    queryParam.doctorId = doctorId;
  }
  if (roomId && roomId !== "") {
    queryParam.roomId = roomId;
  }
  if (date) {
    queryParam.date = date;
  }

  const res = await axiosClient.get<ApiResponse<BookedData[]>>(
    "/v1/appointments/booked-slots",
    {
      params: queryParam,
    },
  );
  return res.data;
};

export const createAppointmentApi = async (data: AppointmentData) => {
  const res = await axiosClient.post<ApiResponse>(
    "/v1/appointments",
    data,
  );
  return res.data;
};

// Cập nhật trạng thái lịch hẹn
export const updateAppointmentStatus = async ({
  appointmentId,
  status,
}: {
  appointmentId: string;
  status: string;
}) => {
  const res = await axiosClient.put<ApiResponse>(
    `/v1/appointments/${appointmentId}/status?status=${status}`
  );
  return res.data;
};

// Lấy chi tiết lịch hẹn tải file pdf
export const getAppointmentDetailPDF = async (appointmentId: string) => {
  const res = await axiosClient.get<ApiResponse<AppointmentDetailPDF>>(
    `/v1/appointments/${appointmentId}/pdf`,
  );
  return res.data;
};

// Lấy chi tiết lịch hẹn
export const getAppointmentDetail = async (appointmentId: string) => {
  const res = await axiosClient.get<ApiResponse<AppointmentDetail>>(
    `/v1/appointments/${appointmentId}`,
  );
  return res.data;
};

// Cập nhật lịch hẹn
export const updateAppointment = async (props: AppointmentUpdate) => {
  const res = await axiosClient.put<ApiResponse>(
    `/v1/appointments/${props.appointmentId}`,
    props
  );
  return res.data;
};
