import { Plus } from "lucide-react";
import { Input, DatePicker, Segmented, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Dayjs } from "dayjs";
import { AppointmentCalendar } from "../components/AppointmentCalendar";
import { AppointmentTable } from "../components/AppointmentTable";
import { useDebounce } from "use-debounce";
import { useState } from "react";
import { CreateAppointmentModal } from "../components/CreateAppointmentModal";
import { useDoctorOption } from "../hooks/useDoctorOption";

export const EmployeeAppointment = () => {
  // State quản lý tìm kiếm bệnh nhân lịch hẹn
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchText] = useDebounce(searchValue, 500); // sử dụng debounce để delay khi nhập text tìm kiếm

  // State quản lý chọn ngày khám
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  // State quản lý trạng thái đóng mở modal tạo lịch hẹn
  const [isOpen, setIsOpen] = useState(false);

  // State quản lý toggle giữa 2 view list và calendar
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  // State quản lý tìm kiếm và chọn bác sĩ ở view calendar
  const [searchDoctor, setSearchDoctor] = useState("");
  const [doctorId, setDoctorId] = useState<string>("");
  const [debouncedSearchDoctor] = useDebounce(searchDoctor, 500);

  // Lấy option bác sĩ để hiển thị ở select khi viewMode là calendar
  const { isLoadingDoctor, doctors } = useDoctorOption({
    searchDoctor: debouncedSearchDoctor,
  });

  const optionDoctors = doctors.map((doctor) => ({
    label: `${doctor.fullname} - ${doctor.doctor_details.specialty}`,
    value: doctor.id, // value là id của bác sĩ để sau này lấy doctor_id khi chọn
  }));

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="px-5 mt-4 flex flex-col gap-4">
      <div className="flex justify-end">
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
        className={`flex items-center gap-4 ${viewMode === "calendar" ? "justify-between" : "justify-end"}`}
      >
        {/* Search input - chỉ hiển thị khi viewMode là list */}
        {viewMode === "list" && (
          <>
            {/* Search */}
            <Input
              placeholder="Tìm theo tên bệnh nhân..."
              prefix={<SearchOutlined />}
              allowClear
              className="w-[200px] h-[42px] text-[15px] rounded-lg"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />

            {/* Date Picker */}
            <DatePicker
              value={selectedDate}
              placeholder="Chọn ngày khám"
              onChange={(date) => setSelectedDate(date)}
              className="w-[350px] h-[42px] text-[15px] rounded-lg"
            />
          </>
        )}

        {/* Select chọn bác sĩ - doctor_id khi có state calendar */}
        {viewMode === "calendar" && (
          <Select
            className="h-[42px]"
            style={{ width: 350 }} // set width của select
            showSearch
            placeholder="Tìm và chọn bác sĩ"
            filterOption={false}
            onSearch={(value) => setSearchDoctor(value)}
            options={optionDoctors}
            onSelect={(value) => {
              setDoctorId(value); // lưu doctor_id vào state
            }}
            notFoundContent={
              isLoadingDoctor ? "Đang tải..." : "Không tìm thấy kết quả"
            }
          />
        )}

        {/* View toggle */}
        <Segmented
          options={[
            { label: "List View", value: "list" },
            { label: "Calendar", value: "calendar" },
          ]}
          defaultValue="list"
          className="h-[42px] text-[15px] px-1"
          // style={{ width: 220 }}
          onChange={(value) => setViewMode(value as "list" | "calendar")}
        />
      </div>

      {/* Hiển thị table list */}
      {viewMode === "list" && (
        <AppointmentTable search={debouncedSearchText} date={selectedDate} />
      )}

      {/* Hiển thị calendar */}
      {viewMode === "calendar" && <AppointmentCalendar doctor_id={doctorId} />}

      {/* Modal tạo lịch khám */}
      <CreateAppointmentModal isOpen={isOpen} handleClose={handleClose} />
    </div>
  );
};
