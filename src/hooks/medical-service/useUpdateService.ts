import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateService } from "../../services/medical-service.service";

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};
