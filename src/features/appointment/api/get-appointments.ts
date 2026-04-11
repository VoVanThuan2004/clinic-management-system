import dayjs, { Dayjs } from "dayjs";
import { supabase } from "../../../lib/supabase";

export const getAppointmentListApi = async (params: {
  page: number;
  pageSize: number;
  search?: string;
  date?: Dayjs | null;
}) => {
  const { page, pageSize, search, date } = params;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("appointments")
    .select(
      `
      appointment_id,
      start_time,
      end_time,
      status,
      reason,
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

  const res = await query;

  return {
    ...res,
    data: res.data?.map((item) => ({
      ...item,
      patients: Array.isArray(item.patients) ? item.patients[0] : item.patients,
      profiles: Array.isArray(item.profiles) ? item.profiles[0] : item.profiles,
    })),
  };
};
