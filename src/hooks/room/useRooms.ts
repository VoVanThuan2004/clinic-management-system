import { useQuery } from "@tanstack/react-query";
import { getAllRoomsApi } from "../../services/room.service";

type Props = {
  page: number;
  pageSize: number;
  search?: string;
};

export const useRooms = (props: Props) => {
  return useQuery({
    queryFn: () => getAllRoomsApi(props),
    queryKey: ["rooms", props],
    placeholderData: (prevData) => prevData,
  });
};
