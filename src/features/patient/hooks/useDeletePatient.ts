import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePatientApi } from "../api/delete-patient";
import { message } from "antd";

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
