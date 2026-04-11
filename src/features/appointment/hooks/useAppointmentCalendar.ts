import { useQuery } from "@tanstack/react-query";
import { getAppointmentsCalendar } from "../api/get-appointments-calendar";
import type { AppointmentCalendarProps } from "../types/appointment.type";

export const useAppointmentCalendar = (props: AppointmentCalendarProps) => {
  return useQuery({
    queryFn: () => getAppointmentsCalendar(props),
    queryKey: ["appointments-calendar", props],
    placeholderData: (previousData) => previousData,
  });
};
