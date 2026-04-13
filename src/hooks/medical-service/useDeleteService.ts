import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteService } from "../../services/medical-service.service";

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};
