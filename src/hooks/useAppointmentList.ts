import { useQuery } from "@tanstack/react-query";
import type { Dayjs } from "dayjs";
import { getAppointmentList } from "../services/appointment.service";

export const useAppointmentList = (params: {
  page: number;
  pageSize: number;
  search?: string;
  date?: Dayjs | null;
  doctor_id?: string;
}) => {
  return useQuery({
    queryFn: () => getAppointmentList(params),
    queryKey: ["appointment-list", params],
    placeholderData: (previousData) => previousData,
  });
};
