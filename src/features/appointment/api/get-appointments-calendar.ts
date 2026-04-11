import { supabase } from "../../../lib/supabase";
import type { AppointmentCalendarProps } from "../types/appointment.type";


export const getAppointmentsCalendar = async (props: AppointmentCalendarProps) => {
  if (!props) return;


  const { doctor_id, start_time, end_time } = props;

  const query = supabase
    .from("appointments")
    .select(
      `
        appointment_id,
        start_time,
        end_time,
        reason,
        status,
        patients(id, full_name, phone_number)    
      `,
    )
    .eq("doctor_id", doctor_id)
    .gte("start_time", start_time)
    .lte("start_time", end_time)
    .neq("status", "cancelled");


  const res =  await query;

  return {
    data: res.data?.map((item) => ({
      ...item,
      patients: Array.isArray(item.patients) ? item.patients[0] : item.patients,
    })),
  }

};
