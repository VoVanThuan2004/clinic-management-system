import { useAuthStore } from "../../stores/useAuthStore";
import { DoctorPage } from "./DoctorPage";
import { EmployeePage } from "./EmployeePage";

export const MedicalRecordPage = () => {
  const rolenName = useAuthStore((state) => state.user?.roleName);

  if (rolenName === "EMPLOYEE") {
    return <EmployeePage />;
  }
  if (rolenName === "ADMIN") {
    return <EmployeePage />;
  }
  if (rolenName === "DOCTOR") {
    return <DoctorPage />;
  }
};