import { useMutation, useQueryClient } from "@tanstack/react-query";
import { payMedicalRecord } from "../../services/medical-record.service";
import { message } from "antd";

type Props = {
  recordId: string;
  serviceFee: number;
  totalMedicine: number;
  totalAmount: number;
};

export const usePayMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (props: Props) => payMedicalRecord(props),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medical-records"] });
    },
    onError: (error) => {
      message.error("Lỗi khi xác nhận thanh toán. Vui lòng thử lại");
      console.log(error);
      
    },
  });
};
