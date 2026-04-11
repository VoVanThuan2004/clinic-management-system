import { useQuery } from "@tanstack/react-query";
import { getPatientsApi } from "../services/patient.service";

type Props = {
  page: number;
  pageSize: number;
  search?: string;
};

export const usePatients = (props: Props) => {
  return useQuery({
    queryFn: () => getPatientsApi(props),
    queryKey: ["patients", props],
    placeholderData: (previousData) => previousData,
  });
};
