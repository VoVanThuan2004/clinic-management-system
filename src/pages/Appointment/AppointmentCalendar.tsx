import { Badge, Calendar, Popover, Spin } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useAppointmentCalendar } from "../../hooks/useAppointmentCalendar";
import type { AppointmentCalendarResponse } from "../../types/appointment.type";
import {
  getAppointmentStatusUI,
  getPrimaryActionLabel,
} from "./appointment-action";
import { useAppointmentStatus } from "../../hooks/useAppointmentStatus";
import { AppointmentStatus } from "./appointment-status";
import {
  checkMedicalRecord,
  createMedicalRecord,
} from "../../services/medical-record.service";
import { useNavigate } from "react-router-dom";


// component để hiển thị danh sách lịch hẹn của 1 bác sĩ dạng calendar, sử dụng ant design calendar
export const AppointmentCalendar = ({
  doctor_id,
  role,
}: {
  doctor_id?: string;
  role?: string;
}) => {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());

  const startOfMonth = currentMonth.startOf("month").toISOString();
  const endOfMonth = currentMonth.endOf("month").toISOString();

  const navigate = useNavigate();

  const { data, isLoading, error } = useAppointmentCalendar({
    doctor_id,
    start_time: startOfMonth,
    end_time: endOfMonth,
  });

  const appointments = data?.data || [];
  const updateAppointmentStatus = useAppointmentStatus("calendar");

  const handlePrimaryAction = async (event: AppointmentCalendarResponse) => {
    const { appointment_id, doctor_id, patients, status } = event;

    // 1. COMPLETED → chỉ xem hồ sơ
    if (status === AppointmentStatus.COMPLETED) {
      const { data: existingRecord } = await checkMedicalRecord(appointment_id);
      if (existingRecord) {
        navigate(`/doctor/medical-records/${existingRecord.record_id}`);
      }
      return;
    }

    // 2. EXAMINING → hoàn thành khám
    if (status === AppointmentStatus.EXAMINING) {
      const { data: existingRecord } = await checkMedicalRecord(appointment_id);
      if (existingRecord) {
        navigate(`/doctor/medical-records/${existingRecord.record_id}`);
      }
      return;
    }

    // 3. CHECKED_IN → bắt đầu khám (tạo hồ sơ)
    if (status === AppointmentStatus.CHECKED_IN) {
      // check đã có record chưa (tránh tạo trùng)
      const { data: existingRecord } = await checkMedicalRecord(appointment_id);

      if (existingRecord) {
        navigate(`/doctor/medical-records/${existingRecord.record_id}`);
        return;
      }

      // tạo mới
      const { data: newRecord } = await createMedicalRecord({
        appointment_id,
        doctor_id,
        patient_id: patients.id,
      });

      if (newRecord) {
        updateAppointmentStatus.mutate({
          appointment_id,
          status: AppointmentStatus.EXAMINING,
        });

        navigate(`/doctor/medical-records/${newRecord.record_id}`);
      }

      return;
    }

    // 4. SCHEDULED → check-in
    if (status === AppointmentStatus.SCHEDULED) {
      updateAppointmentStatus.mutate({
        appointment_id,
        status: AppointmentStatus.CHECKED_IN,
      });
      return;
    }
  };

  const handleCancel = async (event: AppointmentCalendarResponse) => {
    updateAppointmentStatus.mutate({
      appointment_id: event.appointment_id,
      status: AppointmentStatus.CANCELLED,
    });
  };

  const getEventsForDay = (date: Dayjs) => {
    return appointments.filter((item) =>
      dayjs(item.start_time).isSame(date, "day"),
    );
  };

  const renderPopoverContent = (event: AppointmentCalendarResponse) => {
    const statusUI = getAppointmentStatusUI(event.status);

    return (
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-blue-600 text-[16px]">
            {dayjs(event.start_time).format("HH:mm")}
          </span>

          <span
            className={`text-[10px] px-2 py-1 rounded-full font-semibold ${statusUI.className}`}
          >
            {statusUI.label}
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

          <div className="flex">
            <span className="text-gray-400 w-[90px]">Phòng khám:</span>
            <span className="italic text-gray-600">
              {event.rooms?.room_name || "Không có"}
            </span>
          </div>
        </div>

        {/* Actions (Doctor only) */}
        {role === "doctor" && (
          <div className="flex gap-2 mt-4">
            {getPrimaryActionLabel(event.status) && (
              <button
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-[12px] py-2 rounded-md font-medium cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                onClick={() => handlePrimaryAction(event)}
                disabled={updateAppointmentStatus.isPending}
              >
                {updateAppointmentStatus.isPending && (
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {updateAppointmentStatus.isPending
                  ? "Đang xử lý..."
                  : getPrimaryActionLabel(event.status)}
              </button>
            )}

            {/* Hủy chỉ cho phép khi chưa khám */}
            {(event.status === "scheduled" ||
              event.status === "checked_in") && (
              <button
                disabled={updateAppointmentStatus.isPending}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-[12px] py-2 rounded-md font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={() => handleCancel(event)}
              >
                {updateAppointmentStatus.isPending && (
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {updateAppointmentStatus.isPending ? "Đang hủy..." : "Hủy"}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

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
                    event.status === "scheduled"
                      ? "warning"
                      : event.status === "checked_in"
                        ? "processing"
                        : event.status === "examining"
                          ? "processing"
                          : event.status === "completed"
                            ? "default"
                            : event.status === "cancelled"
                              ? "error"
                              : "default"
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
    <div>
      <Calendar
        dateCellRender={dateCellRender}
        value={currentMonth}
        onPanelChange={(date) => {
          setCurrentMonth(date);
        }}
      />
    </div>
  );
};
