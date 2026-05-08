import { axiosClient } from "../api/axios-client";
import { supabase } from "../lib/supabase";
import type { ApiResponse, PageResponse } from "../types/api.response";
import type { UpdateEmployeeParams } from "../types/employee";
import type { Employee } from "../types/user.type";
import { getRoleByName } from "./auth.service";

// Lấy danh sách nhân viên
export const getAllEmployeesApi = async ({
  page,
  pageSize,
  search,
}: {
  page?: number;
  pageSize?: number;
  search?: string;
}) => {
  const queryParams: Record<string, any> = {
    page,
    size: pageSize,
  };

  if (search) queryParams.search = search;

  const res = await axiosClient.get<ApiResponse<PageResponse<Employee>>>(
    "/v1/users/employees",
    {
      params: queryParams,
    }
  );
  return res.data;
};

// Tạo tài khoản nhân viên
type CreateEmployeeParams = {
  email: string;
  password: string;
  fullname: string;
  date_of_birth: string;
  gender: number;
  phonenumber: string;
  address: string;
};
export const createEmployee = async (params: CreateEmployeeParams) => {
  const {
    email,
    password,
    fullname,
    date_of_birth,
    gender,
    phonenumber,
    address,
  } = params;

  // 1. Kiểm tra email có tồn tại chưa
  // const isEmailExists = await checkEmailExists(email);
  // if (isEmailExists) {
  //   throw new Error("EMAIL_ALREADY_EXISTS");
  // }

  // 2. create auth user
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    if (error.message.includes("already registered")) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }
    throw error;
  }

  const userId = data.user?.id;

  // 3. Kiểm tra role
  const roleData = await getRoleByName("employee");

  const roleId = roleData.id;

  // 4. create profile
  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    roleid: roleId,
    email,
    fullname,
    phonenumber,
    gender,
    date_of_birth,
    address,
  });

  if (profileError) {
    throw new Error("CREATE_USER_FAILED");
  }
};

// Cập nhật thông tin nhân viên
export const updateEmployee = async (
  params: UpdateEmployeeParams,
) => {
  const { id, fullname, date_of_birth, gender, phonenumber, address } = params;

  const { error } = await supabase.from("profiles")
  .update({
    fullname,
    phonenumber,
    gender,
    date_of_birth,
    address
  })
  .eq("id", id);

  if (error) {
    throw new Error("UPDATE_EMPLOYEE_FAILED");
  }
};
