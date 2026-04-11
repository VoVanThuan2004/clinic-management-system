import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPrescription } from "../../services/prescription.service";
import { message } from "antd";

export const useCreatePrescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recordId: string) => createPrescription(recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescription"] });
      message.success("Tạo toa thuốc thành công");
    },
    onError: (error) => {
      console.log(error);
      message.error("Có lỗi xảy ra khi tạo toa thuốc");
    },
  });
};
