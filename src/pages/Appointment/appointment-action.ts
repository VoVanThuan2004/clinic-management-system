import { APPOINTMENT_STATUS_UI } from "./appointment-status";

export function getPrimaryActionLabel(status: string) {
  switch (status) {
    case "scheduled":
      return "Check-in"; // bệnh nhân tới → xác nhận đã đến

    case "checked_in":
      return "Bắt đầu khám";

    case "examining":
      return "Xem hồ sơ";

    case "completed":
      return "Xem hồ sơ";

    default:
      return null;
  }
}


export const getAppointmentStatusUI = (status: string) => {
  return (
    APPOINTMENT_STATUS_UI[
      status as keyof typeof APPOINTMENT_STATUS_UI
    ] || {
      label: status,
      className: "bg-gray-100 text-gray-500",
    }
  );
};
