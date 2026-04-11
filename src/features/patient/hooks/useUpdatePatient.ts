import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PatientUpdate } from "../types/patient";
import { updatePatientApi } from "../api/update-patient";
import { message } from "antd";

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
    onError: () => {
      message.error("Lỗi khi xóa bệnh nhân");
    },
  });
};
