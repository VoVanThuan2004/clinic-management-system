import { supabase } from "../../../lib/supabase";

type Props = {
  doctorId: string | null;
  date: string | null;
};

export const getBookedSlotsApi = async (props: Props) => {
  const { doctorId, date } = props;  

  if (!doctorId || doctorId === "null" || !date || date === "null") {
    return { data: [], error: null };
  }

  return await supabase
    .from("appointments")
    .select(
      `
        start_time,
        end_time
      `,
    )
    .eq("doctor_id", doctorId)
    .gte("start_time", `${date}T00:00:00`)
    .lte("start_time", `${date}T23:59:59`)
    .neq("status", "cancelled");
};
