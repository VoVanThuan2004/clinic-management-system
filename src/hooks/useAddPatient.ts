import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PatientInsert } from "../types/patient.type";
import { addPatientApi } from "../services/patient.service";

export const useAddPatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patient: PatientInsert) => addPatientApi(patient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    
  });
};
