import { useQuery } from "@tanstack/react-query";
import type { AppointmentCalendarProps } from "../types/appointment.type";
import { getAppointmentsCalendar } from "../services/appointment.service";

export const useAppointmentCalendar = (props: AppointmentCalendarProps) => {
  return useQuery({
    queryFn: () => getAppointmentsCalendar(props),
    queryKey: ["appointments-calendar", props],
    placeholderData: (previousData) => previousData,
  });
};