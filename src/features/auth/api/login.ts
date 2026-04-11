import { supabase } from "../../../lib/supabase";

export const loginApi = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};
