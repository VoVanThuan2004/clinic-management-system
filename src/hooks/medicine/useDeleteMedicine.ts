import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMedicine } from "../../services/medicine.service";

export const useDeleteMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMedicine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });
};
