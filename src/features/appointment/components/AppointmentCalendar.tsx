import { Calendar, Badge, Spin, Popover } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { useState } from "react";
import { useAppointmentCalendar } from "../hooks/useAppointmentCalendar";
import type { AppointmentCalendarResponse } from "../types/appointment.type";

// component để hiển thị danh sách lịch hẹn của 1 bác sĩ dạng calendar, sử dụng ant design calendar
export const AppointmentCalendar = ({ doctor_id }: { doctor_id?: string }) => {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());

  const startOfMonth = currentMonth.startOf("month").toISOString();
  const endOfMonth = currentMonth.endOf("month").toISOString();

  const { data, isLoading, error } = useAppointmentCalendar({
    doctor_id,
    start_time: startOfMonth,
    end_time: endOfMonth,
  });

  const appointments = data?.data || [];

  const getEventsForDay = (date: Dayjs) => {
    return appointments.filter((item) =>
      dayjs(item.start_time).isSame(date, "day"),
    );
  };

  const renderPopoverContent = (event: AppointmentCalendarResponse) => (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <span className="font-semibold text-blue-600 text-[15px]">
          {dayjs(event.start_time).format("HH:mm")} -{" "}
          {dayjs(event.end_time).format("HH:mm")}
        </span>

        <span
          className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
            event.status === "confirmed"
              ? "bg-green-100 text-green-600"
              : event.status === "pending"
                ? "bg-yellow-100 text-yellow-600"
                : event.status === "checked_in"
                  ? "bg-blue-100 text-blue-600"
                  : event.status === "completed"
                    ? "bg-gray-100 text-gray-600"
                    : "bg-red-100 text-red-600"
          }`}
        >
          {event.status}
        </span>
      </div>

      <div className="border-t border-gray-100 my-2"></div>

      {/* Content */}
      <div className="space-y-2 text-[13px]">
        <div className="flex">
          <span className="text-gray-400 w-[90px]">Bệnh nhân:</span>
          <span className="font-medium text-gray-800">
            {event.patients?.full_name}
          </span>
        </div>

        <div className="flex">
          <span className="text-gray-400 w-[90px]">SĐT:</span>
          <span className="text-gray-700">
            {event.patients?.phone_number || "N/A"}
          </span>
        </div>

        <div className="flex">
          <span className="text-gray-400 w-[90px]">Tình trạng:</span>
          <span className="italic text-gray-600">
            {event.reason || "Không có"}
          </span>
        </div>
      </div>
    </div>
  );

  const dateCellRender = (value: Dayjs) => {
    const events = getEventsForDay(value);

    if (!events.length) {
      return null;
    }

    return (
      <ul className="m-0 p-0 list-none space-y-1">
        {events.map((event) => (
          <li key={event.appointment_id}>
            <Popover
              content={() => renderPopoverContent(event)}
              title={
                <span className="text-gray-800 font-semibold">
                  Chi tiết lịch hẹn
                </span>
              }
              trigger="hover"
              placement="rightTop"
              getPopupContainer={() => document.body}
              overlayStyle={{ zIndex: 9999 }}
            >
              <div className="px-2 py-1 rounded-lg hover:bg-blue-50 transition-all cursor-pointer">
                <Badge
                  status={
                    event.status === "pending"
                      ? "warning"
                      : event.status === "confirmed"
                        ? "success"
                        : event.status === "checked_in"
                          ? "processing"
                          : event.status === "completed"
                            ? "default"
                            : "error"
                  }
                  text={
                    <span className="text-[13px] text-gray-700">
                      {dayjs(event.start_time).format("HH:mm")} -{" "}
                      <span className="font-medium">
                        {event.patients.full_name ?? ""}
                      </span>
                    </span>
                  }
                />
              </div>
            </Popover>
          </li>
        ))}
      </ul>
    );
  };

  if (error) {
    return (
      <div className="text-red-500">Lỗi tải dữ liệu lịch: {String(error)}</div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Spin tip="Đang tải lịch hẹn..." />
      </div>
    );
  }

  return (
    <Calendar
      dateCellRender={dateCellRender}
      value={currentMonth}
      onPanelChange={(date) => {
        setCurrentMonth(date);
      }}
    />
  );
};
