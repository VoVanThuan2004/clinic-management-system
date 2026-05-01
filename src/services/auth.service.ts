import { axiosClient } from "../api/axios-client";
import { supabase } from "../lib/supabase";
import type { ApiResponse } from "../types/api.response";
import type { ChangePasswordDTO, LoginSuccessData } from "../types/auth.type";

export const changePasswordWithVerify = async ({
  email,
  currentPassword,
  newPassword,
}: {
  email: string;
  currentPassword: string;
  newPassword: string;
}) => {
  // 1. verify password cũ
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });

  if (signInError) {
    throw new Error("INVALID_CURRENT_PASSWORD");
  }

  // 2. update password mới
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw error;
  }

  return data;
};

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

export const loginApiV2 = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const res = await axiosClient.post<ApiResponse<LoginSuccessData>>(
    "/v1/auth/login",
    {
      email,
      password,
    },
    {
      withCredentials: true, // Gửi kèm cookie
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return res.data;
};

export const logoutApi = async () => {
  const res = await axiosClient.post<ApiResponse>(
    "/v1/auth/v2/logout",
    {},
    {
      withCredentials: true, // Gửi kèm cookie
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return res.data;
};

export const getRoleByName = async (name: string) => {
  const { data, error } = await supabase
    .from("roles")
    .select(
      `
    id,
    name
    `,
    )
    .eq("name", name)
    .single();

  // custom error message
  if (error) {
    throw new Error("ROLE_NOT_FOUND");
  }

  return data;
};

// Kiểm tra email đã tồn tại hay chưa
export const checkEmailExists = async (email: string) => {
  const { error } = await supabase
    .from("profiles")
    .select("email")
    .eq("email", email)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Không tìm thấy email, trả về true để cho phép tạo mới
      return true;
    }
    // Lỗi khác
    throw error;
  }

  return false;
};

// Reset mật khẩu
export const resetPasswordForEmail = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw error;
};

// Thay đổi mật khẩu
export const changePassword = async (password: string) => {
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) throw error;
};

export const changePasswordApi = async (changePasswordDTO: ChangePasswordDTO) => {
  const res = await axiosClient.post<ApiResponse>("/v1/auth/change-password", changePasswordDTO);
  return res.data;
}
