import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PatientInsert } from "../types/patient.type";
import { addPatientsApi } from "../services/patient.service";
import { message } from "antd";

export const useAddPatients = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patients: PatientInsert[]) => addPatientsApi(patients),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });

      message.success("Import file thành công");
    }
  });
};