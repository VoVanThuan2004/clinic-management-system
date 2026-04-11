import { supabase } from "../lib/supabase";
import type {
  CreateDoctorParams,
  Doctor,
  DoctorResponse,
  UpdateDoctorParams,
} from "../types/doctor.type";
import { getRoleByName } from "./auth.service";

type Props = {
  searchDoctor?: string;
};

export const selectDoctor = async (props: Props) => {
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

// Lấy danh sách bác sĩ
export const getAllDoctors = async ({
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
    roles!inner(name),
    doctor_details!inner(
      specialty,
      experience_years,
      biography
    )
  `,
    )
    .eq("roles.name", "doctor")
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

  return await query.returns<DoctorResponse[]>();
};

// Tạo tài khoản bác sĩ
export const createDoctor = async (params: CreateDoctorParams) => {
  const {
    email,
    password,
    fullname,
    date_of_birth,
    gender,
    phonenumber,
    address,
    specialty,
    experience_years,
    biography,
  } = params;

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
  const roleData = await getRoleByName("doctor");

  const roleId = roleData.id;

  // 4. create profile
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      roleid: roleId,
      email,
      fullname,
      phonenumber,
      gender,
      date_of_birth,
      address,
    })
    .select(`id`)
    .single();

  if (profileError) {
    // Nếu tạo profile thất bại, xóa auth user đã tạo ở bước 2
    throw new Error("CREATE_PROFILE_FAILED");
  }

  // 5. Tạo doctor details
  const { error: doctorDetailsError } = await supabase
    .from("doctor_details")
    .insert({
      id: profileData.id,
      specialty,
      experience_years,
      biography,
    });

  if (doctorDetailsError) {
    // Nếu tạo doctor details thất bại, xóa profile
    await supabase.from("profiles").delete().eq("id", profileData.id);
    throw new Error("CREATE_DOCTOR_DETAILS_FAILED");
  }
};

// Cập nhật bác sĩ
export const updateDoctor = async (params: UpdateDoctorParams) => {
  const {
    id,
    fullname,
    gender,
    phonenumber,
    address,
    date_of_birth,
    specialty,
    experience_years,
    biography,
  } = params;

  const { data, error } = await supabase
    .from("profiles")
    .update({
      fullname,
      phonenumber,
      gender,
      date_of_birth,
      address,
    })
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    throw new Error("UPDATE_DOCTOR_FAILED");
  }

  // Cập nhật vào doctor details
  const { error: doctorDetailError } = await supabase
    .from("doctor_details")
    .update({
      specialty,
      experience_years,
      biography
    })
    .eq("id", data.id);

  if (doctorDetailError) {
    await supabase.from("profiles").delete().eq("id", id);
    throw new Error("UPDATE_DOCTOR_DETAILS_FAILED");
  }
};
