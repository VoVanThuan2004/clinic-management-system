import { Input, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useMedicalRecords } from "../../hooks/medical-record/useMedicalRecords";
import { getMedicalRecordPDF } from "../../services/medical-record.service";
import { MedicalPDF } from "./MedicalPDF";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import { MedicalRecordTable } from "./MedicalRecordTable";
import { useAuthStore } from "../../stores/useAuthStore";

export const DoctorPage = () => {
  const userId = useAuthStore((state) => state.user?.userId);

  // State quản lý tìm kiếm bệnh nhân lịch hẹn
  const [searchPatient, setSearchPatient] = useState("");
  const [debouncedSearchPatient] = useDebounce(searchPatient, 500);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [loadingPdfId, setLoadingPdfId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Gọi hook api lấy danh sách medical records
  const { data, isLoading } = useMedicalRecords({
    page: pagination.current,
    pageSize: pagination.pageSize,
    search: debouncedSearchPatient,
    doctorId: userId
  });
  const mappedData = (data ?? []).map((item) => ({
    record_id: item.record_id,
    full_name: item.patients.full_name,
    doctor_name: item.profiles.fullname,
    symptoms: item.symptoms,
    diagnosis: item.diagnosis,
    notes: item.notes,
    payment_status: item.payment_status,
  }));

  // Hàm xem chi tiết medical record
  const onViewMedicalRecordDetail = (recordId: string) => {
    if (!recordId) return;

    navigate(`/doctor/medical-records/${recordId}`);
  };

  const onDownloadMedicalRecordPDF = async (recordId: string) => {
    if (!recordId) return;

    try {
      setLoadingPdfId(recordId);

      const { data } = await getMedicalRecordPDF(recordId);

      if (!data) throw new Error("No data");

      // tạo file PDF
      const blob = await pdf(<MedicalPDF data={data} />).toBlob();

      // download luôn
      saveAs(blob, `medical-record.pdf`);
    } catch (error) {
      console.log(error);
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
      </div>

      {/* Hiển thị table list */}
      <MedicalRecordTable
        isLoading={isLoading}
        data={mappedData}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: mappedData.length,
          onChange: (page: number, pageSize: number) => {
            setPagination({ current: page, pageSize });
          },
        }}
        onView={onViewMedicalRecordDetail}
        onDownload={onDownloadMedicalRecordPDF}
        loadingPdfId={loadingPdfId}
      />
    </div>
  );
};
