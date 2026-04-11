import { useQuery } from "@tanstack/react-query";
import { getAppointmentListApi } from "../api/get-appointments";
import type { Dayjs } from "dayjs";

export const useAppointmentList = (params: {
  page: number;
  pageSize: number;
  search?: string;
  date?: Dayjs | null;
}) => {
  return useQuery({
    queryFn: () => getAppointmentListApi(params),
    queryKey: ["appointment-list", params],
    placeholderData: (previousData) => previousData
  });
};
