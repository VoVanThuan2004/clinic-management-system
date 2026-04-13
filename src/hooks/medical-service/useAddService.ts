import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addService } from "../../services/medical-service.service";

export const useAddService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};
