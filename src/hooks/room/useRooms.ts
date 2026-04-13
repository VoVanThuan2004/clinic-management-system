import { useQuery } from "@tanstack/react-query";
import { getAllRooms } from "../../services/room.service";

type Props = {
  page: number;
  pageSize: number;
  search?: string;
};

export const useRooms = (props: Props) => {
  return useQuery({
    queryFn: () => getAllRooms(props),
    queryKey: ["rooms", props],
    placeholderData: (prevData) => prevData,
  });
};
