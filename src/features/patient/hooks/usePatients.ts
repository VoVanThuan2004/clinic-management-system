import { useQuery } from "@tanstack/react-query";
import { getPatientsApi } from "../api/get-patients";
export const usePatients = (params: {
  page: number;
  pageSize: number;
  search?: string;
}) => {
  return useQuery({
    queryFn: () => getPatientsApi(params),
    queryKey: ["patients", params],
    placeholderData: (previousData) => previousData,
  });
};
