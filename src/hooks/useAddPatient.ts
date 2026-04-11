import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import type { PatientInsert } from "../types/patient.type";
import { addPatientApi } from "../services/patient.service";

export const useAddPatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patient: PatientInsert) => addPatientApi(patient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        if (error.message === "PHONE_EXISTS") {
          message.error("Người dùng đã tồn tại với số điện thoại này");
          return;
        }
      }

      message.error("Lỗi hệ thống");
    },
  });
};
