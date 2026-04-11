import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { deletePrescriptionItem } from "../../services/prescription.service";

export const useDeletePrescriptionItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => deletePrescriptionItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescription"] });
    },
    onError: () => {
      message.error("Lỗi khi xóa thuốc ra khỏi toa");
    },
  });
};
