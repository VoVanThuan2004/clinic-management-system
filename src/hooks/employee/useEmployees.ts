import { useQuery } from "@tanstack/react-query";
import { getAllEmployeesApi } from "../../services/employee.service";

type Props = {
  page: number;
  pageSize: number;
  search?: string;
};

export const useEmployees = (props: Props) => {
  return useQuery({
    queryFn: () =>
      getAllEmployeesApi({
        page: props.page,
        pageSize: props.pageSize,
        search: props.search,
      }),
    queryKey: ["employees", props],
  });
};
