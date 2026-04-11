import { useAuthStore } from "../../stores/useAuthStore";
import { DoctorPage } from "./DoctorPage";
import { EmployeePage } from "./EmployeePage";

export const MedicalRecordPage = () => {
  const rolenName = useAuthStore((state) => state.user?.roleName);

  if (rolenName === "employee") {
    return <EmployeePage />;
  }
  if (rolenName === "admin") {
    return <EmployeePage />;
  }
  if (rolenName === "doctor") {
    return <DoctorPage />;
  }
};
