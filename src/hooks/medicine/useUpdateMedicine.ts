import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMedicine } from "../../services/medicine.service";

export const useUpdateMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMedicine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
  });
};
