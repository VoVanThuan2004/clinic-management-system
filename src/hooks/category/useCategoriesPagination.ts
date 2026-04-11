import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../services/category.service";

type Props = {
  page: number;
  pageSize: number;
  search?: string;
};

export const useCategoriesPagination = (props: Props) => {
  return useQuery({
    queryFn: () => getCategories(props),
    queryKey: ["categories", props],
    placeholderData: (prevData) => prevData,
  });
};
