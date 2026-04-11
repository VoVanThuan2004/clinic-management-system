import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateQuantityItem } from "../../services/prescription.service";
import { message } from "antd";

type Props = {
  itemId: string;
  newQuantity: number;
};

export const useUpdateQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (props: Props) =>
      updateQuantityItem(props.itemId, props.newQuantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescription"] });
    },
    onError: () => {
      message.error("Lỗi khi thay đổi số lượng thuốc");
    },
  });
};
