import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginApiV2 } from "../../services/auth.service";
import { tokenStorage } from "../../utils/tokenStorage";
import { useAuthStore } from "../../stores/useAuthStore";
import { message } from "antd";

const loginSchema = z.object({
  email: z.string().email("Email không đúng định dạng"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất tối thiểu 8 ký tự"),
});

// interface ProfileWithRole {
//   fullname: string;
//   email: string;
//   avatarurl: string | null;
//   roles: {
//     name: string;
//   } | null; // Có thể null nếu join thất bại
// }

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const setSession = useAuthStore((state) => state.setSession);

  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  // const onLogin = async (loginRequest: { email: string; password: string }) => {
  //   setIsLoading(true);
  //   try {
  //     const { data: authData, error: authError } = await loginApi(loginRequest);

  //     if (authError) throw authError;

  //     // 2. Query thông tin Profile và Join với bảng Roles
  //     // Cú pháp '*, roles(name)' có nghĩa là: lấy hết cột ở profiles và chỉ lấy cột name ở roles
  //     const { data: profileData, error: profileError } = await supabase
  //       .from("profiles")
  //       .select(
  //         `
  //     email,
  //     fullname,
  //     avatarurl,
  //     roles (
  //       name
  //     )
  //   `,
  //       )
  //       .eq("id", authData.user.id)
  //       .single(); // Vì mỗi user chỉ có 1 profile

  //     if (profileError) throw profileError;

  //     // 3. Cập nhật thông tin global user
  //     const profile = profileData as unknown as ProfileWithRole;
  //     if (profile) {
  //       setSession({
  //         userId: authData.session.user.id,
  //         fullName: profile.fullname,
  //         roleName: profile.roles?.name as string,
  //         avatarUrl: profile.avatarurl || null,
  //       });
  //     }

  //     // 4. Kiểm tra role
  //     if (profile.roles?.name === "employee") {
  //       message.success("Đăng nhập thành công");

  //       setTimeout(() => {
  //         navigate("/employee");
  //       }, 0);
  //     }

  //     if (profile.roles?.name === "doctor") {
  //       message.success("Đăng nhập thành công");

  //       setTimeout(() => {
  //         navigate("/doctor");
  //       }, 0);
  //     }

  //     if (profile.roles?.name === "admin") {
  //       message.success("Đăng nhập thành công");

  //       setTimeout(() => {
  //         navigate("/admin");
  //       }, 0);
  //     }
  //   } catch (error) {
  //     message.error("Email hoặc mật khẩu không hợp lệ");

  //     console.log(error);

  //     localStorage.clear();
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const onLoginV2 = async (loginRequest: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await loginApiV2(loginRequest);

      if (res.status === "success") {
        tokenStorage.setAccessToken(res.data?.accessToken as string);

        setSession({
          userId: res.data?.userId as string,
          fullName: res.data?.fullName as string,
          roleName: res.data?.role as string,
          avatarUrl: res.data?.avatarUrl as string,
        });

        // Điều hướng theo role
        const role = res.data?.role;        
        if (role === "EMPLOYEE") {
          navigate("/employee");
        } else if (role === "DOCTOR") {
          navigate("/doctor");
        } else if (role === "ADMIN") {
          navigate("/admin");
        }

        message.success("Đăng nhập thành công");
      }
    } catch {
      // console.log(error);
    
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col max-w-md w-full mx-auto shadow-2xl rounded-xl bg-white py-8 px-8 relative">
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 text-sm text-gray-500 hover:text-black cursor-pointer"
      >
        ← Quay lại
      </button>

      {/* Title */}
      <div className="flex flex-col items-center gap-1 mb-6">
        <p className="text-3xl font-bold">Đăng nhập</p>
      </div>

      <form onSubmit={handleSubmit(onLoginV2)}>
        {/* Email */}
        <div className="flex flex-col gap-1 mb-4">
          <label className="font-medium">Email</label>
          <input
            type="email"
            placeholder="name@email.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-blue-400 focus:ring-1"
            {...register("email", {
              required: "Vui lòng nhập email",
            })}
          />

          {errors.email && (
            <p className="text-red-500 text-[14px]">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1 mb-4">
          <label className="font-medium">Mật khẩu</label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-blue-400 focus:ring-1"
              {...register("password", {
                required: "Vui lòng nhập mật khẩu",
              })}
            />

            <button
              type="button"
              className="absolute inset-y-0 right-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff color="gray" /> : <Eye color="gray" />}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-500 text-[14px]">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Reset password */}
        {/* <div className="flex justify-end">
          <p className="text-sm font-mono text-blue-500" onClick={() => navigate}>Quên mật khẩu?</p>
        </div> */}

        {/* Sign in */}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 w-full px-3 py-4 rounded-xl text-white text-xl font-medium shadow-md mb-2 mt-3 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}

          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
};
