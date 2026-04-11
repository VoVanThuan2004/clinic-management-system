import { supabase } from "../../../lib/supabase";

export const getAllPatientsApi = async () => {
  return await supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false });
};
