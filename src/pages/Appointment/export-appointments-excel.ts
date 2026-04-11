import dayjs from "dayjs";
import type { AppointmentTableResponse } from "../../types/appointment.type";
import * as XLSX from "xlsx";

const formatStatus = (status: string) => {
  switch (status) {
    case "pending":
      return "Đang chờ";
    case "confirmed":
      return "Đã đặt";
    case "checked_in":
      return "Đã đến";
    case "examining":
      return "Đang khám";
    case "completed":
      return "Hoàn thành";
    case "cancelled":
      return "Đã hủy";
  }
};

export const exportAppointmentsExcel = (
  appointments: AppointmentTableResponse[],
) => {
  if (!appointments || appointments.length === 0) return;

  const data = appointments.map((a) => ({
    "Bệnh nhân": a.patients.full_name,
    "Số điện thoại": a.patients.phone_number,
    "Bác sĩ": a.profiles.fullname,
    "Thời gian": dayjs(a.start_time).format("HH:mm DD/MM/YYYY"),
    "Tình trạng bệnh": a.reason,
    "Trạng thái": formatStatus(a.status),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Appointments");

  XLSX.writeFile(workbook, "appointments.xlsx");
};
