import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateAppointmentData } from "../types/appointment.type";
import { createAppointmentApi } from "../services/appointment.service";
import { message } from "antd";

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAppointmentData) => createAppointmentApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointment-list"] });
      message.success("Tạo lịch hẹn thành công");
    },
  });
};