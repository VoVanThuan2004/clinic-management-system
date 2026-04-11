import { useNavigate, useParams } from "react-router-dom";

import { usePatientMedicalHistory } from "../../hooks/patient/usePatientMedicalHistory";
import { PatientHistoryList } from "./PatientHistoryList";
import { Empty, Spin } from "antd";
import { ChevronLeft } from "lucide-react";

export const PatientHistory = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  const { data: patientMedicalHistories, isLoading } = usePatientMedicalHistory(
    patientId as string,
  );

  const histories = patientMedicalHistories || [];

  return (
    <div className="px-5 mt-5">
      {/* Nút trở về */}
      <button
        className="flex items-center cursor-pointer gap-1.5 mb-3"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={19} className="text-blue-500" />
        <p className="text-blue-500 text-[17px]">Quay lại</p>
      </button>

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Spin size="large" />
        </div>
      ) : histories.length === 0 ? (
        <Empty description="Không có lịch sử khám" />
      ) : (
        histories.map((item) => (
          <PatientHistoryList key={item.record_id} patientHistory={item} />
        ))
      )}
    </div>
  );
};
