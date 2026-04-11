import { useQuery } from "@tanstack/react-query";
import { getAllEmployees } from "../../services/employee.service";

type Props = {
  page: number;
  pageSize: number;
  search?: string;
};

export const useEmployees = (props: Props) => {
  return useQuery({
    queryFn: () =>
      getAllEmployees({
        page: props.page,
        pageSize: props.pageSize,
        search: props.search,
      }),
    queryKey: ["employees", props],
  });
};
