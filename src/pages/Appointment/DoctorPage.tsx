import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { AppointmentCalendar } from "./AppointmentCalendar";

export const DoctorPage = () => {
  const user = useAuthStore((state) => state.user);

  const location = useLocation();
  const appointmentTime = (location.state as { appointmentTime?: string } | null)?.appointmentTime;

  return (
    <div>
      <AppointmentCalendar
        doctor_id={user?.userId}
        role={user?.roleName}
        initialDate={appointmentTime ? dayjs(appointmentTime) : undefined}
      />
    </div>
  );
};
