import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAppointment } from "../../services/appointment.service";

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointment-list"] });
    },
  });
};
