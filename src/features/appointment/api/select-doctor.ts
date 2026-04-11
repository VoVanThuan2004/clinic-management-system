import { supabase } from "../../../lib/supabase";
import type { Doctor } from "../types/doctor.typ";

type Props = {
  searchDoctor?: string;
};

export const selectDoctorApi = async (props: Props) => {
  const { searchDoctor } = props;

  let query = supabase
    .from("profiles")
    .select(
      `
        id,
        fullname,
        doctor_details!inner (
          specialty
        ),
        roles!inner(id, name)
    `,
    )
    .eq("roles.name", "doctor")
    .limit(10);

  if (searchDoctor) {
    // Query tìm kiếm theo fullname hoặc sđt
    query = query.or(
      `fullname.ilike.%${searchDoctor}%,phonenumber.ilike.%${searchDoctor}%`,
    );
  }

  return await query.returns<Doctor[]>();
};
