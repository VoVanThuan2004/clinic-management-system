import { Input, message, notification, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useMedicalRecords } from "../../hooks/medical-record/useMedicalRecords";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useDoctorOption } from "../../hooks/useDoctorOption";
import { PaymentModal } from "./PaymentModal";
import { usePayMedicalRecord } from "../../hooks/medical-record/usePayMedicalRecord";
import { useNavigate } from "react-router-dom";
import { getMedicalRecordPDF } from "../../services/medical-record.service";
import { pdf } from "@react-pdf/renderer";
import { MedicalPDF } from "./MedicalPDF";
import { saveAs } from "file-saver";
import { MedicalRecordTable } from "./MedicalRecordTable";

export const EmployeePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [recordId, setRecordId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [doctorName, setDoctorName] = useState("");

  const [pagination, setPagination] = useState({
    current: 0,
    pageSize: 10,
  });

  // State select trạng thái thanh toán
  const [paymentStatus, setPaymentStatus] = useState(null);

  // State quản lý tìm kiếm bệnh nhân lịch hẹn
  const [searchPatient, setSearchPatient] = useState("");
  const [debouncedSearchPatient] = useDebounce(searchPatient, 500); // sử dụng debounce để delay khi nhập text tìm kiếm

  // State quản lý tìm kiếm và chọn bác sĩ ở view calendar
  const [searchDoctor, setSearchDoctor] = useState("");
  const [doctorId, setDoctorId] = useState<string>("");
  const [debouncedSearchDoctor] = useDebounce(searchDoctor, 500);

  const [loadingPdfId, setLoadingPdfId] = useState<string | null>(null);

  const navigate = useNavigate();

  // Lấy option bác sĩ để hiển thị ở select khi viewMode là calendar
  const { doctors, isLoadingDoctor } = useDoctorOption({
    searchDoctor: debouncedSearchDoctor,
  });

  const mappedDoctors = doctors.map((doctor) => ({
    label: `${doctor.doctorName} - ${doctor.specialty}`,
    value: doctor.doctorId,
  }));

  // ===================== //

  // Gọi hook api lấy danh sách medical records
  const { data, isLoading } = useMedicalRecords({
    page: pagination.current,
    pageSize: pagination.pageSize,
    search: debouncedSearchPatient,
    doctorId,
    paymentStatus,
  });
  const mappedData = (data?.data?.content ?? []).map((item) => ({
    medicalRecordId: item.medicalRecordId,
    patientName: item.patientName,
    gender: item.gender,
    dateOfBirth: item.dateOfBirth,
    address: item.address,
    phoneNumber: item.phoneNumber,
    doctorName: item.doctorName,
    symptoms: item.symptoms,
    diagnosis: item.diagnosis,
    notes: item.notes,
    paymentStatus: item.paymentStatus,
  }));

  // Gọi hook api xác nhận thanh toán
  const payMedicalRecordMutation = usePayMedicalRecord();

  const openPaymentModal = (
    recordId: string,
    patientName: string,
    doctorName: string,
  ) => {
    setIsOpen(true);
    setRecordId(recordId);
    setPatientName(patientName);
    setDoctorName(doctorName);
  };

  const closePaymentModal = () => {
    setIsOpen(false);
  };

  // Hàm xác nhận thanh toán
  const onPayMedicalRecord = (
    serviceFee: number,
    totalMedicine: number,
    totalAmount: number,
    paymentMethod: "CASH" | "BANKING",
  ) => {
    if (!recordId) return;
    payMedicalRecordMutation.mutate(
      {
        medicalRecordId: recordId,
        serviceFee,
        totalMedicine,
        totalAmount,
        paymentMethod,
      },
      {
        onSuccess: () => {
          closePaymentModal();
          if (paymentMethod === "CASH") {
            notification.success({
              message: "Thanh toán thành công",
              description: `Đã thanh toán ${totalAmount} VNĐ bằng tiền mặt`,
            });
          }
        },
      },
    );
  };

  // Hàm xem chi tiết medical record
  const onViewMedicalRecordDetail = (recordId: string) => {
    if (!recordId) return;

    navigate(`/employee/medical-records/${recordId}`);
  };

  const onDownloadMedicalRecordPDF = async (recordId: string) => {
    if (!recordId) return;

    try {
      setLoadingPdfId(recordId);

      const res = await getMedicalRecordPDF(recordId);

      if (res.status === "success" && res.data) {
        // tạo file PDF
        const blob = await pdf(<MedicalPDF data={res.data} />).toBlob();

        // download luôn
        saveAs(blob, `medical-record.pdf`);
      }
    } catch {
      message.error("Lỗi khi tải file pdf. Vui lòng thử lại");
    } finally {
      setLoadingPdfId(null);
    }
  };

  return (
    <div className="px-5 mt-5">
      <div className="flex items-center gap-3">
        {/* Search */}
        <Input
          placeholder="Tìm theo tên bệnh nhân..."
          prefix={<SearchOutlined />}
          allowClear
          className="h-[42px] text-[15px] rounded-lg"
          style={{ width: 450 }}
          value={searchPatient}
          onChange={(e) => setSearchPatient(e.target.value)}
        />

        <Select
          className="h-[42px]"
          style={{ width: 350 }}
          showSearch
          allowClear
          placeholder="Tìm và chọn bác sĩ"
          filterOption={false}
          onSearch={(value) => setSearchDoctor(value)}
          options={mappedDoctors}
          onChange={(value) => {
            setDoctorId(value); // lưu doctor_id vào state
          }}
          notFoundContent={
            !searchDoctor // Nếu chưa search (hoặc searchDoctor là chuỗi rỗng)
              ? null // -> Không hiện gì cả (ẩn No Data)
              : isLoadingDoctor
                ? "Đang tải..."
                : "Không tìm thấy kết quả"
          }
        />

        <Select
          className="h-[42px]"
          style={{ width: 350 }}
          showSearch
          allowClear
          placeholder="Trạng thái thanh toán"
          filterOption={false}
          options={[
            {
              label: "Đã thanh toán",
              value: true,
            },
            {
              label: "Chưa thanh toán",
              value: false,
            },
          ]}
          onChange={(value) => {
            setPaymentStatus(value);
          }}
        />
      </div>

      {/* Hiển thị table list */}
      <MedicalRecordTable
        isLoading={isLoading}
        data={mappedData}
        pagination={{
          current: pagination.current + 1,
          pageSize: pagination.pageSize,
          total: mappedData.length,
          onChange: (page: number, pageSize: number) => {
            setPagination({ current: page - 1, pageSize });
          },
        }}
        onView={onViewMedicalRecordDetail}
        onDownload={onDownloadMedicalRecordPDF}
        openPayment={openPaymentModal}
        loadingPdfId={loadingPdfId}
      />

      {/* Modal thanh toán */}
      <PaymentModal
        key={recordId}
        isOpen={isOpen}
        onClose={closePaymentModal}
        recordId={recordId}
        patientName={patientName}
        doctorName={doctorName}
        onPayMedicalRecord={onPayMedicalRecord}
        isLoading={payMedicalRecordMutation.isPending}
      />
    </div>
  );
};
