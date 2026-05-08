import { UserPlus } from "lucide-react";
import { ExportExcelButton } from "../../components/ExportExcelButton";
import { useState } from "react";
import type { DoctorResponse } from "../../types/doctor.type";
import { formatDate } from "../../utils/formatDate";
import { exportExcel } from "../../utils/excel/exportExcel";
import { message } from "antd";

type Props = {
  onOpenAdd: () => void;
  data: DoctorResponse[];
};

export const Toolbar = (props: Props) => {
  const { onOpenAdd } = props;
  const [isExportLoading, setIsExportLoading] = useState(false);

  // Export file
  const handleExport = async () => {
    setIsExportLoading(true);
    try {

      const mappingData = props.data.map((e) => ({
        "Email": e.email,
        "Họ tên": e.doctorName,
        "Giới tính": e.gender === 1 ? "Nam" : "Nữ",
        "Ngày sinh": formatDate(e.dateOfBirth),
        "SĐT": e.phoneNumber,
        "Chuyên khoa": e.doctorDetailResponse?.specialty,
        "Năm kinh nghiệm": e.doctorDetailResponse?.experienceYears,
        "Tiểu sử": e.doctorDetailResponse?.biography,
      }));

      exportExcel({
        data: mappingData,
        fileName: "doctors.xlsx",
        name: "Doctors"
      });
    } catch (error) {
      message.error("Lỗi khi tải file!");
      console.log(error);
    } finally {
      setIsExportLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2.5">
      <button
        className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 transition py-3.5 px-3 rounded-xl cursor-pointer"
        onClick={onOpenAdd}
      >
        <UserPlus className="text-white" size={18} />
        <p className="text-white">Thêm bác sĩ</p>
      </button>

      <ExportExcelButton
        isLoading={isExportLoading}
        handleExport={handleExport}
      />
    </div>
  );
};