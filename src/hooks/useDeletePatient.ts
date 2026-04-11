import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { deletePatientApi } from "../services/patient.service";

export const useDeletePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePatientApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: () => {
      message.error("Lỗi khi xóa bệnh nhân");
    },
  });
};