import { supabase } from "../../../lib/supabase";

export const selectPatientApi = async (params: {
  search?: string;
}) => {
  const { search } = params;
  let query = supabase
    .from("patients")
    .select(
      `
        id,
        patient_code,
        full_name,
        gender,
        phone_number,
        date_of_birth,
        address
     `,
    )
    .limit(10); // Giới hạn 10 patients

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,phone_number.ilike.%${search}%`);
  }

  return await query;
};
