import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMedicineToPrescription } from "../../services/prescription.service";
import type { PrescriptionItemAdd } from "../../types/prescription.type";
import { message } from "antd";

export const useAddPrescriptionItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (item: PrescriptionItemAdd) => addMedicineToPrescription(item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescription"] });
      message.success("Đã thêm thuốc vào toa");
    },
    onError: () => {
      message.error("Lỗi khi thêm thuốc vào toa");
    },
  });
};
