import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePatientsApi } from "../services/patient.service";
import { message } from "antd";

export const useDeletePatients = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patientIds: string[]) => deletePatientsApi(patientIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      message.success("Xóa bệnh nhân thành công");
    },
    onError: () => {
      message.error("Lỗi khi xóa bệnh nhân");
    },
  });
};
