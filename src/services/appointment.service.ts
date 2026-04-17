import dayjs, { Dayjs } from "dayjs";
import { supabase } from "../lib/supabase";
import type {
  AppointmentCalendarProps,
  AppointmentUpdate,
  BookedData,
  CreateAppointmentData,
} from "../types/appointment.type";

export const getAppointmentsCalendar = async (
  props: AppointmentCalendarProps,
) => {
  if (!props) return;

  const { doctor_id, start_time, end_time } = props;

  const query = supabase
    .from("appointments")
    .select(
      `
        appointment_id,
        start_time,
        reason,
        status,
        doctor_id,
        patients(id, full_name, phone_number),
        profiles!doctor_id (
          fullname
        ),
        rooms(room_name)
      `,
    )
    .eq("doctor_id", doctor_id)
    .gte("start_time", start_time)
    .lte("start_time", end_time)
    .neq("status", "cancelled");

  const res = await query;

  return {
    data: res.data?.map((item) => ({
      ...item,
      patients: Array.isArray(item.patients) ? item.patients[0] : item.patients,
      rooms: Array.isArray(item.rooms) ? item.rooms[0] : item.rooms,
      profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles,
    })),
  };
};

export const getAppointmentList = async (params: {
  page: number;
  pageSize: number;
  search?: string;
  date?: Dayjs | null;
  doctor_id?: string;
}) => {
  const { page, pageSize, search, date, doctor_id } = params;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("appointments")
    .select(
      `
      appointment_id,
      start_time,
      status,
      reason,
      patients!inner (
        full_name,
        phone_number
      ),
      profiles!doctor_id (
        fullname,
        avatarurl
      ),
      rooms (
        room_name
      ),
      services (
        service_name
      )
    `,
    )
    .range(from, to)
    .order("created_at", { ascending: false });

  // Nếu có query search
  if (search) {
    query = query.ilike("patients.full_name", `%${search}%`);
  }

  // Nếu có query chọn ngày
  if (date) {
    const startOfDay = dayjs(date).startOf("day").toISOString();
    const endOfDay = dayjs(date).endOf("day").toISOString();

    query = query.gte("start_time", startOfDay).lte("start_time", endOfDay);
  }

  // Nếu có select bác sĩ
  if (doctor_id) {
    query = query.eq("doctor_id", doctor_id);
  }

  const res = await query;

  return {
    data: res.data?.map((item) => ({
      ...item,
      patients: Array.isArray(item.patients) ? item.patients[0] : item.patients,
      profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles,
      rooms: Array.isArray(item.rooms) ? item.rooms[0] : item.rooms,
      services: Array.isArray(item.services) ? item.services[0] : item.services,
    })),
  };
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
  // 1. Validate chặt chẽ
  if (
    !doctorId ||
    !date ||
    doctorId === "null" ||
    !roomId ||
    roomId === "null"
  ) {
    return { data: [], error: null };
  }

  // 2. Format lại ngày cho an toàn (ISO format)
  // Đôi khi Postgres có thể khó tính với T00:00:00 nếu không có Timezone
  const startDate = `${date}T00:00:00.000Z`;
  const endDate = `${date}T23:59:59.999Z`;

  const { data, error } = await supabase
    .from("appointments")
    // LƯU Ý: Xóa khoảng trắng sau dấu phẩy trong chuỗi select
    .select<"start_time,duration_minutes", BookedData>(
      "start_time,duration_minutes",
    )
    .or(`doctor_id.eq.${doctorId},room_id.eq.${roomId}`)
    .gte("start_time", startDate)
    .lte("start_time", endDate)
    .neq("status", "cancelled");

  // 3. LOG RA LỖI CHI TIẾT NẾU BỊ 400
  if (error) {
    console.error("🔥 Lỗi chi tiết từ Supabase:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
  }

  return { data, error };
};

export const createAppointmentApi = async (data: CreateAppointmentData) => {
  if (!data) return;
  return await supabase.from("appointments").insert([
    {
      patient_id: data.patient_id,
      doctor_id: data.doctor_id,
      start_time: data.start_time,
      reason: data.reason,
      service_id: data.service_id,
      status: data.status,
      room_id: data.room_id,
      duration_minutes: data.duration_minutes,
      employee_id: data.employee_id,
    },
  ]);
};

// Cập nhật trạng thái lịch hẹn
export const updateAppointmentStatus = async ({
  appointment_id,
  status,
}: {
  appointment_id: string;
  status: string;
}) => {
  return await supabase
    .from("appointments")
    .update({ status })
    .eq("appointment_id", appointment_id);
};

// Lấy chi tiết lịch hẹn
export const getAppointmentDetail = async (appointmentId: string) => {
  const res = await supabase
    .from("appointments")
    .select(
      `
      appointment_id,
      start_time,
      duration_minutes,
      status,
      reason,
      service_id,
      room_id,
      patients!inner (*),
      doctor:profiles!doctor_id (*),
      employee:profiles!employee_id (fullname),
      rooms (
        room_name
      ),
      services (
        service_name
      )
    `,
    )
    .eq("appointment_id", appointmentId)
    .single();

  if (res.error) {
    console.error("Error fetching appointment:", res.error);
    return { data: null, error: res.error };
  }

  const data = res.data;

  return {
    data: {
      ...data,
      patients: Array.isArray(data.patients) ? data.patients[0] : data.patients,
      doctor: Array.isArray(data.doctor) ? data.doctor[0] : data.doctor,
      employee: Array.isArray(data.employee) ? data.employee[0] : data.employee,
      rooms: Array.isArray(data.rooms) ? data.rooms[0] : data.rooms,
      services: Array.isArray(data.services) ? data.services[0] : data.services,
    },
  };
};

export const updateAppointment = async (props: AppointmentUpdate) => {
  const {
    appointment_id,
    patient_id,
    doctor_id,
    start_time,
    reason,
    service_id,
    room_id,
    duration_minutes
  } = props;

  return await supabase
    .from("appointments")
    .update({
      patient_id,
      doctor_id,
      start_time,
      reason,
      service_id,
      room_id,
      duration_minutes
    })
    .eq("appointment_id", appointment_id);
};
