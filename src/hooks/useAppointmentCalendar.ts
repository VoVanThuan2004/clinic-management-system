import { useQuery } from "@tanstack/react-query";
import type { AppointmentCalendarProps } from "../types/appointment.type";
import { getAppointmentsCalendar } from "../services/appointment.service";

export const useAppointmentCalendar = (props?: AppointmentCalendarProps) => {
  return useQuery({
    queryKey: ["appointments-calendar", props],
    queryFn: () => getAppointmentsCalendar(props!),
    enabled: !!props?.doctor_id,
    placeholderData: (previousData) => previousData,
  });
};