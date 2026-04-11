import { useAuthStore } from "../../../stores/useAuthStore";
import { AppointmentCalendar } from "../components/AppointmentCalendar";

export const DoctorAppointment = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <AppointmentCalendar doctor_id={user?.userId} />
    </div>
  );
};
