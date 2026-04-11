import { supabase } from "../../../lib/supabase";

export const getPatientsApi = async (params: {
  page: number;
  pageSize: number;
  search?: string;
}) => {
  const { page, pageSize, search } = params;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("patients")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });
  
  // Nếu có nội dung tìm kiếm
  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,phone_number.ilike.%${search}%`
    )
  }

  return await query;
};
