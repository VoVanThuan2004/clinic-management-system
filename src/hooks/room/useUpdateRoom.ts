import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoom } from "../../services/room.service";

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });
};
