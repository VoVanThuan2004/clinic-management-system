import { supabase } from "../../../lib/supabase";
import type { PatientInsert } from "../types/patient";

export const addPatientApi = async (patient: PatientInsert) => {
  const { error } = await supabase.from("patients").insert(patient);

  if (error) {
    if (error.code === "23505") {
      throw new Error("PHONE_EXISTS");
    }

    throw error;
  }
};
