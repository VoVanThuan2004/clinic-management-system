import { supabase } from "../../../lib/supabase";
import type { PatientInsert } from "../types/patient";

export const addPatientsApi = async (patients: PatientInsert[]) => {
  const { error } = await supabase.from("patients").insert(patients);
  if (error) throw error;
};
