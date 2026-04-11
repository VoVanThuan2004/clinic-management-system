import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateAppointmentData } from "../types/appointment.type";
import { createAppointmentApi } from "../api/create-appointment";
import { message } from "antd";

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAppointmentData) => createAppointmentApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointment-list"] });
    },
    onError: (error) => {
      console.error("Error creating appointment:", error);
      message.error("Đã có lỗi xảy ra khi tạo cuộc hẹn. Vui lòng thử lại.");
    },
  });
};
