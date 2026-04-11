import { useQuery } from "@tanstack/react-query";
import { getMedicinesByCategory } from "../../services/medicine.service";

type Props = {
  search?: string;
  category_id: string;
  page: number;
  pageSize: number;
};

export const useMedicines = (props: Props) => {
  return useQuery({
    queryFn: () =>
      getMedicinesByCategory({
        category_id: props.category_id,
        search: props.search,
        page: props.page,
        pageSize: props.pageSize,
      }),
    queryKey: ["medicines", props],
    placeholderData: (prevData) => prevData,
  });
};
