import { AppointmentStatus } from "./appointment-status";

export const getAppointmentStatus = (status: string) => {
  if (status === AppointmentStatus.SCHEDULED) {
    return "Đã lên lịch";
  }

  if (status === AppointmentStatus.CHECKED_IN) {
    return "Đã đến";
  }
  if (status === AppointmentStatus.COMPLETED) {
    return "Đã hoàn thành";
  }
  if (status === AppointmentStatus.CANCELLED) {
    return "Đã hủy";
  }
};
