import { useForm } from "antd/es/form/Form";
import { AppModal } from "../../components/AppModal";
import { Button, DatePicker, Form, message, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { usePatientOption } from "../../hooks/usePatientOption";
import { useDoctorOption } from "../../hooks/useDoctorOption";
import type { Doctor } from "../../types/doctor.type";
import type { Patient } from "../../types/patient.type";
import TextArea from "antd/es/input/TextArea";
import { formatDate } from "../../utils/formatDate";
import dayjs from "dayjs";
import { useBookedSlot } from "../../hooks/useBookedSlot";
import { generateAvailableSlots } from "../../utils/appointment/generate-available-slots";
import { useAppointmentDetail } from "../../hooks/appointment/useAppointmentDetail";
import { useUpdateAppointment } from "../../hooks/appointment/useUpdateAppointment";
import type { AppointmentUpdate } from "../../types/appointment.type";
import { useMedicalServiceOption } from "../../hooks/medical-service/useMedicalServiceOption";
import { useRoomOption } from "../../hooks/room/useRoomOption";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
};

export const AppointmentModal = (props: Props) => {
  const { isOpen, onClose, appointmentId } = props;
  const [form] = useForm();

  // State quản lý chọn bệnh nhân
  const [searchPatient, setSearchPatient] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [debounceSearchPatient] = useDebounce(searchPatient, 500);

  // State quản lý chọn bác sĩ
  const [searchDoctor, setSearchDoctor] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [debounceSearchDoctor] = useDebounce(searchDoctor, 500);

  // State quản lý chọn phòng khám
  const [selectedRoom, setSelectedRoom] = useState("");

  // Gọi hook api lấy chi tiết appointment
  const { appointment, isLoading: isLoadingAppointment } =
    useAppointmentDetail(appointmentId);

  // State quản lý chọn ngày khám
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(() => {
    // Nếu có appointment ngay từ đầu, lấy luôn giá trị đó
    return appointment ? dayjs(appointment.start_time).format("HH:mm") : null;
  });

  // State quản lý chọn dịch vụ khám
  const [selectedMedicalService, setSelectedMedicalService] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (appointment) {
      form.setFieldsValue({
        patient: appointment.patients.id,
        doctor: appointment.doctor.id,
        date: dayjs(appointment.start_time),
        service: appointment.service_id,
        reason: appointment.reason,
      });
    }
  }, [appointment, form]);

  // Gọi hook api lấy thời gian trống của doctor
  const { bookedData } = useBookedSlot({
    doctorId: selectedDoctor?.id || appointment?.doctor?.id || null,
    date: selectedDate
      ? selectedDate
      : appointment?.start_time
        ? dayjs(appointment.start_time).format("YYYY-MM-DD")
        : "",
    roomId: "123"
  });

  const slots = useMemo(() => {
    const dateStr = selectedDate
      ? (selectedDate as string)
      : appointment?.start_time
        ? dayjs(appointment.start_time).format("YYYY-MM-DD")
        : "";

    // 1. Tạo danh sách slot trống từ hàm helper
    const availableSlots = generateAvailableSlots(bookedData, dateStr);

    // 2. Nếu đang ở chế độ Edit, thêm giờ hiện tại của appointment vào đầu danh sách
    if (appointment?.start_time) {
      const currentTime = dayjs(appointment.start_time).format("HH:mm");

      // Chỉ thêm nếu trong list chưa có (tránh trùng lặp)
      if (!availableSlots.includes(currentTime)) {
        availableSlots.unshift(currentTime);
      }
    }

    return availableSlots;
  }, [bookedData, selectedDate, appointment]);

  // Gọi hook api select patients
  const { data, isLoading } = usePatientOption({
    searchPatient: debounceSearchPatient,
  });

  // Gọi hook api select doctors
  const { doctors, isLoadingDoctor } = useDoctorOption({
    searchDoctor: debounceSearchDoctor,
  });

  // Gọi hook api lấy danh sách dịch vụ khám
  const { medicalServices } = useMedicalServiceOption();

  // Gọi hook api lấy danh sách phòng khám
  const { rooms } = useRoomOption();

  // mapping data trả về dạng label - value cho bệnh nhân
  const options = data.map((item) => ({
    label: `${item.full_name} - ${item.phone_number}`,
    value: item.id,
    patient: item, // lưu thông tin gốc của bệnh nhân để hiện thị sau khi chọn xong
  }));

  // mapping data trả về dạng label - value cho doctor
  const optionDoctors = doctors.map((item) => ({
    label: `${item.fullname} - ${item.doctor_details.specialty}`,
    value: item.id,
    doctor: item,
  }));

  // mapping data trả về dạng label - value cho dịch vụ khám
  const optionMedicalServices = medicalServices?.map((item) => ({
    label: item.service_name,
    value: item.service_id,
  }));

  const optionRooms = rooms?.map((item) => ({
    label: item.room_name,
    value: item.room_id,
  }));

  // Hook cập nhật lịch hẹn
  const updateAppointmentMutate = useUpdateAppointment();

  const onCloseAppointmentModal = () => {
    onClose();
    setSelectedSlot(null);
  };

  // Hàm cập nhật appointment
  const onUpdateAppointment = async () => {
    // Validate toàn bộ form trước khi submit, lấy giá trị
    const values = await form.validateFields();

    // Kiểm tra đã chọn slot thời gian khám chưa
    if (!selectedSlot) {
      message.error("Vui lòng chọn giờ khám!");
      return;
    }

    // Tạo start_time
    const start_time = dayjs(
      `${dayjs(values.date).format("YYYY-MM-DD")}T${selectedSlot}:00`,
    ).toISOString();

    const appointmentUpdate: AppointmentUpdate = {
      appointment_id: props.appointmentId,
      patient_id: values.patient,
      doctor_id: values.doctor,
      service_id: selectedMedicalService || values.service, // Nếu đã chọn dịch vụ mới thì lấy giá trị mới, ngược lại giữ nguyên
      start_time,
      reason: values.reason,
    };

    updateAppointmentMutate.mutate(appointmentUpdate, {
      onSuccess: () => {
        message.success("Cập nhật lịch hẹn thành công");
        onCloseAppointmentModal();
      },
      onError: () => {
        message.error("Lỗi khi cập nhật lịch hẹn. Vui lòng thử lại");
      },
    });
  };

  const content = (
    <div className="flex gap-6">
      {/* LEFT: Form */}
      <div className="w-1/2 flex flex-col gap-4">
        <Form form={form} layout="vertical" onFinish={onUpdateAppointment}>
          {/* Chọn bệnh nhân */}
          <Form.Item
            name="patient"
            label="Chọn bệnh nhân"
            rules={[{ required: true, message: "Vui lòng chọn bệnh nhân!" }]}
          >
            <Select
              showSearch
              placeholder="Tìm và chọn bệnh nhân..."
              className="h-[42px] w-full"
              filterOption={false}
              onFocus={() => setSearchPatient("")}
              onSearch={(value) => setSearchPatient(value)}
              options={options}
              onSelect={(option) => {
                setSelectedPatient(option.patient);
              }}
              notFoundContent={
                !searchPatient // Nếu chưa search (hoặc searchDoctor là chuỗi rỗng)
                  ? null // -> Không hiện gì cả (ẩn No Data)
                  : isLoading
                    ? "Đang tải..."
                    : "Không tìm thấy kết quả"
              }
            />
          </Form.Item>

          {/* Card thông tin bệnh nhân */}
          {selectedPatient && (
            <div className="bg-gray-50 border border-blue-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-[16px] font-semibold text-gray-800">
                    {selectedPatient.full_name}
                  </h2>
                  <p className="text-xs text-gray-500">
                    Mã BN: {selectedPatient.patient_code}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-lg">
                  Bệnh nhân
                </span>
              </div>

              <div className="border-t border-gray-200 mb-3"></div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                <div>
                  <p className="text-gray-500">SĐT</p>
                  <p className="font-medium">{selectedPatient.phone_number}</p>
                </div>
                <div>
                  <p className="text-gray-500">Giới tính</p>
                  <p className="font-medium">
                    {selectedPatient.gender === 1 ? "Nam" : "Nữ"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Ngày sinh</p>
                  <p className="font-medium">
                    {formatDate(selectedPatient.date_of_birth)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Địa chỉ</p>
                  <p className="font-medium">{selectedPatient.address}</p>
                </div>
              </div>
            </div>
          )}

          {!selectedPatient && (
            <div className="bg-gray-50 border border-blue-100 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-[16px] font-semibold text-gray-800">
                    {appointment?.patients.full_name}
                  </h2>
                  <p className="text-xs text-gray-500">
                    Mã BN: {appointment?.patients.patient_code}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-lg">
                  Bệnh nhân
                </span>
              </div>

              <div className="border-t border-gray-200 mb-3"></div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                <div>
                  <p className="text-gray-500">SĐT</p>
                  <p className="font-medium">
                    {appointment?.patients.phone_number}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Giới tính</p>
                  <p className="font-medium">
                    {appointment?.patients.gender === 1 ? "Nam" : "Nữ"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Ngày sinh</p>
                  <p className="font-medium">
                    {formatDate(appointment?.patients.date_of_birth)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Địa chỉ</p>
                  <p className="font-medium">{appointment?.patients.address}</p>
                </div>
              </div>
            </div>
          )}

          {/* Chọn bác sĩ */}
          <Form.Item
            name="doctor"
            label="Chọn bác sĩ"
            rules={[{ required: true, message: "Vui lòng chọn bác sĩ!" }]}
          >
            <Select
              className="h-[42px]"
              showSearch
              placeholder="Tìm và chọn bác sĩ"
              filterOption={false}
              onFocus={() => setSearchDoctor("")}
              onSearch={(value) => setSearchDoctor(value)}
              options={optionDoctors}
              onSelect={(option) => {
                setSelectedDoctor(option.doctor);
              }}
              notFoundContent={
                !searchDoctor // Nếu chưa search (hoặc searchDoctor là chuỗi rỗng)
                  ? null // -> Không hiện gì cả (ẩn No Data)
                  : isLoadingDoctor
                    ? "Đang tải..."
                    : "Không tìm thấy kết quả"
              }
            />
          </Form.Item>

          {/* Chọn phòng khám */}
          <Form.Item
            name="room"
            label="Chọn phòng khám"
            rules={[{ required: true, message: "Vui lòng chọn phòng khám!" }]}
          >
            <Select
              className="h-[42px]"
              showSearch
              placeholder="Tìm và chọn phòng khám"
              filterOption={false}
              options={optionRooms}
              onSelect={(value) => {
                setSelectedRoom(value);
              }}
            />
          </Form.Item>

          {/* Ngày khám */}
          <div className="flex gap-3">
            <Form.Item
              name="date"
              label="Ngày khám"
              rules={[{ required: true, message: "Vui lòng chọn ngày khám!" }]}
              className="w-full"
            >
              <DatePicker
                className="h-[42px] w-full"
                format="YYYY-MM-DD"
                disabledDate={(current) =>
                  current && current < dayjs().startOf("day")
                }
                onChange={(date) => {
                  setSelectedDate(date ? date.format("YYYY-MM-DD") : null);
                }}
              />
            </Form.Item>
          </div>

          {/* Chọn dịch vụ khám */}
          <Form.Item
            name="service"
            label="Chọn dịch vụ khám"
            rules={[{ required: true, message: "Vui lòng chọn dịch vụ khám!" }]}
          >
            <Select
              className="h-[42px]"
              placeholder="Tìm và chọn dịch vụ"
              options={optionMedicalServices}
              onChange={(value) => {
                setSelectedMedicalService(value);
              }}
            />
          </Form.Item>

          {/* Reason */}
          <Form.Item
            name="reason"
            label="Tình trạng bệnh"
            rules={[
              { required: true, message: "Vui lòng nhập tình trạng bệnh!" },
            ]}
          >
            <TextArea
              value={appointment?.reason}
              autoSize={{ minRows: 3 }}
              placeholder="Nhập thông tin tình trạng bệnh hiện tại"
            />
          </Form.Item>
        </Form>
      </div>

      {/* RIGHT: SLOT PICKER */}
      <div className="w-1/2 border-l border-gray-400 pl-4">
        <p className="text-sm font-semibold text-gray-600 mb-4">
          Chọn giờ khám
        </p>

        <div className="grid grid-cols-4 gap-3">
          {slots.map((time) => {
            const isSelected = selectedSlot === time;

            return (
              <button
                key={time}
                onClick={() => setSelectedSlot(time)} // 3. Set giá trị khi click
                className={`py-2 rounded-xl text-sm font-medium transition-all border ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100" // Style khi được chọn
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50" // Style mặc định
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const footer = [
    <Button key="back" onClick={onCloseAppointmentModal}>
      Hủy
    </Button>,
    <Button
      key="submit"
      type="primary"
      onClick={onUpdateAppointment}
      loading={updateAppointmentMutate.isPending}
    >
      Cập nhật lịch hẹn
    </Button>,
  ];

  console.log("Room ID: ", selectedRoom);

  return (
    <AppModal
      title="Cập nhật lịch hẹn"
      open={isOpen}
      onClose={onCloseAppointmentModal}
      okText="Cập nhật lịch hẹn"
      cancelText="Hủy"
      width={1000}
      isLoading={isLoadingAppointment}
      children={content}
      footer={footer}
    />
  );
};
