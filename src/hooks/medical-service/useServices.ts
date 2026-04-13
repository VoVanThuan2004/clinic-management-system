import { useQuery } from "@tanstack/react-query";
import { getAllServices } from "../../services/medical-service.service";

type Props = {
  page: number;
  pageSize: number;
  search?: string;
};

export const useServices = (props: Props) => {
  return useQuery({
    queryFn: () => getAllServices(props),
    queryKey: ["services", props],
    placeholderData: (prevData) => prevData,
  });
};
