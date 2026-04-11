import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDoctor } from "../../services/doctor.service";

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};
