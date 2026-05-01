import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePatientApi } from "../services/patient.service";

export const useDeletePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePatientApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    
  });
};