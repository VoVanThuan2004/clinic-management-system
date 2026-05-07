import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAppointmentStatus } from "../services/appointment.service";

type Props = {
  appointmentId: string;
  status: string;
};

export const useAppointmentStatus = (type: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (props: Props) =>
      updateAppointmentStatus({
        appointmentId: props.appointmentId,
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
  });
};
