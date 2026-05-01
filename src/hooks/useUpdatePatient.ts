import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PatientUpdate } from "../types/patient.type";
import { updatePatientApi } from "../services/patient.service";

type Props = {
  patientId: string;
  patientUpdate: PatientUpdate;
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (props: Props) => updatePatientApi(props),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
};