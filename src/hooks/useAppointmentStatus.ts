import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAppointmentStatus } from "../services/appointment.service";
import { message } from "antd";

type Props = {
  appointment_id: string;
  status: string;
};

export const useAppointmentStatus = (type: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (props: Props) =>
      updateAppointmentStatus({
        appointment_id: props.appointment_id,
        status: props.status,
      }),
    onSuccess: () => {
      if (type === "calendar") {
        queryClient.invalidateQueries({ queryKey: ["appointments-calendar"] });
      }
      if (type === "list") {
        queryClient.invalidateQueries({ queryKey: ["appointment-list"] });
      }
    },
    onError: (error) => {
        console.log(error);
        message.error("Cập nhật trạng thái lịch hẹn thất bại");
    }
  });
};
