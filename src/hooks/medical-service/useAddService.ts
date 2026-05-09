import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addServiceApi } from "../../services/medical-service.service";

export const useAddService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addServiceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};
