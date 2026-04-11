import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPatientApi } from "../api/add-patient";
import type { PatientInsert } from "../types/patient";
import { message } from "antd";

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
