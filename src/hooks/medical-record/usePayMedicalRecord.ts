import { useMutation, useQueryClient } from "@tanstack/react-query";
import { payMedicalRecordApi } from "../../services/medical-record.service";

type Props = {
  medicalRecordId: string;
  serviceFee: number;
  totalMedicine: number;
  totalAmount: number;
  paymentMethod: "CASH" | "BANKING";
};

export const usePayMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (props: Props) => payMedicalRecordApi(props),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-records"] });
    }
  });
};
