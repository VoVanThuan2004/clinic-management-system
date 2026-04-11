import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPatientsApi } from "../api/add-patients";
import type {PatientInsert } from "../types/patient";

export const useAddPatients = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patients: PatientInsert[]) => addPatientsApi(patients),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
};
