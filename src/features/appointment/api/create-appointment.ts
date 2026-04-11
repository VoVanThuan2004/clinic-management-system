import { supabase } from "../../../lib/supabase";
import type { CreateAppointmentData } from "../types/appointment.type";

export const createAppointmentApi = async (data: CreateAppointmentData) => {
  if (!data) return;
  return await supabase.from("appointments").insert([
    {
      patient_id: data.patient_id,
      doctor_id: data.doctor_id,
      start_time: data.start_time,
      end_time: data.end_time,
      reason: data.reason,
      status: data.status,
    },
  ]);
};
