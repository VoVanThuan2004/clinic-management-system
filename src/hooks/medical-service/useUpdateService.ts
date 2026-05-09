import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateServiceApi } from "../../services/medical-service.service";

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateServiceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};
