import { DatePicker, Input, message, Segmented, Select } from "antd";
import type { Dayjs } from "dayjs";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { SearchOutlined } from "@ant-design/icons";
import { AppointmentTable } from "./AppointmentTable";
import { useDoctorOption } from "../../hooks/useDoctorOption";
import { AppointmentCalendar } from "./AppointmentCalendar";
import { CreateModal } from "./CreateModal";
import { ExportExcelButton } from "../../components/ExportExcelButton";
import { getAppointments } from "../../services/appointment.service";
import { exportAppointmentsExcel } from "./export-appointments-excel";
import type { AppointmentTableResponse } from "../../types/appointment.type";

export const EmployeePage = () => {
  // State quản lý tìm kiếm bệnh nhân lịch hẹn
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchText] = useDebounce(searchValue, 500); // sử dụng debounce để delay khi nhập text tìm kiếm

  // State quản lý chọn ngày khám
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  // State quản lý trạng thái đóng mở modal tạo lịch hẹn
  const [isOpen, setIsOpen] = useState(false);

  // State quản lý tìm kiếm và chọn bác sĩ ở view calendar
  const [searchDoctor, setSearchDoctor] = useState("");
  const [doctorId, setDoctorId] = useState<string>("");
  const [debouncedSearchDoctor] = useDebounce(searchDoctor, 500);

  const [isExportLoading, setIsExportLoading] = useState(false);

  // Lấy option bác sĩ để hiển thị ở select khi viewMode là calendar
  const { doctors, isLoadingDoctor } = useDoctorOption({
    searchDoctor: debouncedSearchDoctor,
  });

  const mappedDoctors = doctors.map((doctor) => ({
    label: `${doctor.fullname} - ${doctor.doctor_details.specialty}`,
    value: doctor.id,
  }));

  // State quản lý toggle giữa 2 view list và calendar
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const onClose = () => {
    setIsOpen(false);
  };

  // Export file
  const handleExport = async () => {
    setIsExportLoading(true);
    try {
      const { data } = await getAppointments();

      const mappedData: AppointmentTableResponse[] =
        data?.map((item) => ({
          appointment_id: item.appointment_id,
          start_time: item.start_time,
          reason: item.reason,
          status: item.status,
          patients: {
            id: item.patients.id,
            full_name: item.patients.full_name,
            phone_number: item.patients.phone_number,
          },
          profiles: {
            fullname: item.profiles.fullname,
          },
        })) ?? [];

      exportAppointmentsExcel(mappedData);
    } catch (error) {
      message.error("Lỗi khi tải file!");
      console.log(error);
    } finally {
      setIsExportLoading(false);
    }
  };

  return (
    <div className="px-5 mt-4 flex flex-col gap-4">
      <div className="flex justify-end gap-3">
        {/* Button export file */}
        <ExportExcelButton
          isLoading={isExportLoading}
          handleExport={handleExport}
        />

        {/* Button tạo lịch hẹn */}
        <button
          className="flex items-center gap-1.5 bg-blue-500 py-3 px-4 rounded-xl cursor-pointer hover:bg-blue-600 transition-all duration-200 shadow-sm"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="text-white" size={17} />
          <span className="text-white font-medium">Tạo lịch hẹn</span>
        </button>
      </div>

      {/* Header actions */}
      <div
        className={`
    flex flex-wrap items-center gap-4
    ${viewMode === "calendar" ? "justify-between" : "justify-end"}
  `}
      >
        {/* LIST MODE */}
        {viewMode === "list" && (
          <>
            {/* Search */}
            <div className="w-full sm:min-w-[200px] sm:flex-1 lg:max-w-[500px]">
              <Input
                placeholder="Tìm theo tên bệnh nhân..."
                prefix={<SearchOutlined />}
                allowClear
                className="h-[42px] text-[15px] rounded-lg w-full"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            {/* Date */}
            <div className="w-full sm:w-[220px] lg:w-[260px]">
              <DatePicker
                value={selectedDate}
                placeholder="Chọn ngày khám"
                onChange={(date) => setSelectedDate(date)}
                className="h-[42px] text-[15px] rounded-lg w-full"
              />
            </div>
          </>
        )}

        {/* Doctor Select (dùng chung cho cả 2 mode) */}
        <div className="w-full sm:w-[240px] lg:w-[300px]">
          <Select
            className="h-[42px] w-full"
            showSearch
            allowClear
            placeholder="Tìm và chọn bác sĩ"
            filterOption={false}
            onSearch={(value) => setSearchDoctor(value)}
            options={mappedDoctors}
            onChange={(value) => setDoctorId(value)} 
            notFoundContent={
              !searchDoctor
                ? null
                : isLoadingDoctor
                  ? "Đang tải..."
                  : "Không tìm thấy kết quả"
            }
          />
        </div>

        {/* View toggle */}
        <div className="w-full sm:w-auto">
          <Segmented
            options={[
              { label: "List View", value: "list" },
              { label: "Calendar", value: "calendar" },
            ]}
            defaultValue="list"
            className="h-[42px] text-[15px] px-1 w-full sm:w-auto"
            onChange={(value) => setViewMode(value as "list" | "calendar")}
          />
        </div>
      </div>

      {/* Hiển thị table list */}
      {viewMode === "list" && (
        <AppointmentTable
          debounceSearch={debouncedSearchText}
          date={selectedDate}
          doctor_id={doctorId}
        />
      )}

      {/* Hiển thị calendar */}
      {viewMode === "calendar" && <AppointmentCalendar doctor_id={doctorId} />}

      {/* Modal tạo lịch khám */}
      <CreateModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};
