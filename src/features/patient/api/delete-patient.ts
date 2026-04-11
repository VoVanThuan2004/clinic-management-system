import { supabase } from "../../../lib/supabase";

export const deletePatientApi = async (id: string) => {
  return await supabase.from("patients").delete().eq("id", id);
};
