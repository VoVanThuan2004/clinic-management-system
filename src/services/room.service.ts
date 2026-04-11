import { supabase } from "../lib/supabase";

// Lấy danh sách phòng trống
export const getAllRoomsAvailable = async () => {
  return await supabase
    .from("rooms")
    .select(
      `
            room_id,
            room_name    
        `,
    )
    .eq("is_active", true);
};
