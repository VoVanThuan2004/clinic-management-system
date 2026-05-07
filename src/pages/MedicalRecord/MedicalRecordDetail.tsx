import { useNavigate, useParams } from "react-router-dom";
import { FileUploadSection } from "./FileUploadSection";
import { MedicalInfoForm } from "./MedicalInfoForm";
import { PrescriptionTable } from "./PrescriptionSection/PrescriptionTable";
import { useMedicalRecordDetails } from "../../hooks/medical-record/useMedicalRecordDetails";
import { useState } from "react";
import { saveMedicalInfoApi } from "../../services/medical-record.service";
import { ChevronLeft } from "lucide-react";

export const MedicalRecordDetail = () => {
  const { record_id } = useParams<{ record_id: string }>();
  const [saveLoading, setSaveLoading] = useState(false);
  const navigate = useNavigate();

  // Gọi effect lấy thông tin chi tiết medical
  const { medicalRecord, isLoading, error } = useMedicalRecordDetails(
    record_id as string,
  );
  

  if (error) {
    navigate("/doctor");
    return;
  }

  // Hàm lưu thông tin khám (triệu chứng, ...)
  const onSaveMedicalInfo = async (
    symptoms: string,
    diagnosis: string,
    notes: string,
  ) => {
    if (!record_id) return;

    setSaveLoading(true);
    try {
      await saveMedicalInfoApi(record_id as string, symptoms, diagnosis, notes)      
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="px-5 py-4">

      {/* Nút trở về */}
      <button className="flex items-center cursor-pointer gap-1.5"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={19} className="text-blue-500"/>
        <p className="text-blue-500 text-[17px]">Quay lại</p>
      </button>

      <div className="flex justify-between items-start mb-4 mt-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hồ sơ khám</h1>

          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <span>
              Bệnh nhân:
              <span className="ml-1 font-medium text-gray-700">
                {medicalRecord?.patientName}
              </span>
            </span>

             <span>
              Giới tính:
              <span className="ml-1 font-medium text-gray-700">
                {medicalRecord?.gender === 1 ? "Nam" : medicalRecord?.gender === 0 ? "Nữ" : "Khác"}
              </span>
            </span>
            <span>
              SĐT:
              <span className="ml-1 font-medium text-gray-700">
                {medicalRecord?.phoneNumber}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6">
        {/* Cột trái: Thông tin khám (Chiếm 8 phần) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <MedicalInfoForm
            symptoms={medicalRecord?.symptoms || null}
            diagnosis={medicalRecord?.diagnosis || null}
            notes={medicalRecord?.notes || null}
            payment_status={medicalRecord?.paymentStatus || false}
            isLoading={isLoading || saveLoading}
            onSaveMedicalInfo={onSaveMedicalInfo}
          />
          <PrescriptionTable 
            recordId={record_id as string} 
            payment_status={medicalRecord?.paymentStatus}
          />
        </div>

        {/* Cột phải: Hình ảnh & Tài liệu (Chiếm 4 phần) */}
        <div className="col-span-12 lg:col-span-4">
          <FileUploadSection 
            recordId={record_id as string} 
            payment_status={medicalRecord?.paymentStatus || false}
          />
        </div>
      </div>
    </div>
  );
};
