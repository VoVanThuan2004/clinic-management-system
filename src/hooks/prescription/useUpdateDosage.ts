import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDosagePrescriptionItem } from "../../services/prescription.service";
import { message } from "antd";

type Props = {
  itemId: string;
  dosage: string;
};

export const useUpdateDosage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (props: Props) =>
      updateDosagePrescriptionItem(props.itemId, props.dosage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescription"] });
    },
    onError: () => {
      message.error("Lỗi khi cập nhật liều lượng");
    },
  });
};
