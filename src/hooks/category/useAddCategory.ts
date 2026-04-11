import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCategory } from "../../services/category.service";

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
