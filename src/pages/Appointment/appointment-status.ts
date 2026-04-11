export const AppointmentStatus = {
  SCHEDULED: "scheduled", // đã tạo lịch
  CHECKED_IN: "checked_in", // bệnh nhân đã đến
  EXAMINING: "examining", // đang khám
  COMPLETED: "completed", // đã khám xong
  CANCELLED: "cancelled", // đã hủy
} as const;

export type AppointmentStatus =
  (typeof AppointmentStatus)[keyof typeof AppointmentStatus];

export const APPOINTMENT_STATUS_UI = {
  scheduled: {
    label: "Đã đặt lịch",
    className: "bg-yellow-100 text-yellow-700",
  },
  checked_in: {
    label: "Đã đến",
    className: "bg-blue-100 text-blue-700",
  },
  examining: {
    label: "Đang khám",
    className: "bg-purple-100 text-purple-700",
  },
  completed: {
    label: "Hoàn thành",
    className: "bg-gray-100 text-gray-700",
  },
  cancelled: {
    label: "Đã hủy",
    className: "bg-red-100 text-red-700",
  },
} as const;
