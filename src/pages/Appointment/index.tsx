import { useAuthStore } from "../../stores/useAuthStore"
import { DoctorPage } from "./DoctorPage";
import { EmployeePage } from "./EmployeePage";

export const AppointmentPage = () => {
    const rolenName = useAuthStore((state) => state.user?.roleName);

    if (rolenName === "doctor") {
        return <DoctorPage />
    }

    if (rolenName === "employee" || rolenName === "admin") {
        return <EmployeePage />
    }
}