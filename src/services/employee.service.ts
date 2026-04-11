import { supabase } from "../lib/supabase";
import type { UpdateEmployeeParams } from "../types/employee";
import { getRoleByName } from "./auth.service";

// Lấy danh sách nhân viên
export const getAllEmployees = async ({
  page,
  pageSize,
  search,
}: {
  page?: number;
  pageSize?: number;
  search?: string;
}) => {
  let query = supabase
    .from("profiles")
    .select(
      `
    id,
    fullname,
    email,
    phonenumber,
    gender,
    avatarurl,
    date_of_birth,
    address,
    roles!inner(name)
  `,
    )
    .eq("roles.name", "employee")
    .order("created_at", { ascending: false });

  if (page !== undefined && pageSize !== undefined) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;
    query = query.range(start, end);
  }

  // Tìm kiếm theo email hoặc fullname
  if (search) {
    query = query.or(`fullname.ilike.%${search}%,email.ilike.%${search}%`);
  }

  return await query;
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
