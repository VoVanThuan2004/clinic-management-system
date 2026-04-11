import { useQuery } from "@tanstack/react-query";
import { getAllDoctors } from "../../services/doctor.service";

type Props = {
  page: number;
  pageSize: number;
  search?: string;
};

export const useDoctors = (props: Props) => {
  return useQuery({
    queryFn: () => getAllDoctors(props),
    queryKey: ["doctors", props],
  });
};
