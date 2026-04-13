import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addRoom } from "../../services/room.service";

export const useAddRoom = () => {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: (room_name: string) => addRoom(room_name),
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
};
