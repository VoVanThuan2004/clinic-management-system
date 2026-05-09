import { useQuery } from "@tanstack/react-query";
import { getAllServicesApi } from "../../services/medical-service.service";

type Props = {
  page: number;
  pageSize: number;
  search?: string;
};

export const useServices = (props: Props) => {
  return useQuery({
    queryFn: () => getAllServicesApi(props),
    queryKey: ["services", props],
    placeholderData: (prevData) => prevData,
  });
};
