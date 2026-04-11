import { useAuthStore } from "../../stores/useAuthStore";
import { AppointmentCalendar } from "./AppointmentCalendar";

export const DoctorPage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <AppointmentCalendar doctor_id={user?.userId} role={user?.roleName}/>
    </div>
  );
};
