import { supabase } from "../../../lib/supabase";

export const getProfileApi = async (userId: string) => {
  return await supabase
    .from("profiles")
    .select(
      `
      id,
      email,
      fullname,
      avatarurl,
      phonenumber,
      roles (
        name
      )
    `,
    )
    .eq("id", userId)
    .single(); // Vì mỗi user chỉ có 1 profile
  
};
