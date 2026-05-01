import { UserPlus } from "lucide-react";
import { ImportExcelButton } from "../../components/ImportExcelButton";
import { ExportExcelButton } from "../../components/ExportExcelButton";
import { useState } from "react";
import { message } from "antd";
import { useAddPatients } from "../../hooks/useAddPatients";
import {  getAllPatientsExportApi } from "../../services/patient.service";
import { readExcelFile } from "./utils/readExcel";
import { validatePatientExcel } from "./utils/validatePatientExcel";
import { transformPatientExcel } from "./utils/transformPatientExcel";
import { exportPatientsToExcel } from "./utils/exportPatientsToExcel";

type Props = {
  onAdd: () => void;
  debounceSearch?: string;
};

export const PatientToolbar = ({ onAdd, debounceSearch }: Props) => {
  const [isExportLoading, setIsExportLoading] = useState(false);

  // Gọi hook api thêm danh sách bệnh nhận
  const useAddPatientsMutate = useAddPatients();

  const handleImport = async (file: File) => {
    try {
      // 1. Đọc file
      const jsonData = await readExcelFile(file);

      // 2. Validate header file excel
      if (!validatePatientExcel(jsonData)) {
        message.error("File không đúng định dạng");
        return;
      }

      // 3. Chuyển dữ liệu về dạng json
      const patients = transformPatientExcel(jsonData);
      if (!patients.length) {
        message.warning("Không có dữ liệu hợp lệ");
        return;
      }      
      
      // Gọi mutate thêm patients
      useAddPatientsMutate.mutate(patients);
    } catch (error) {
      console.log(error);
      message.error("Lỗi đọc file");
    }
  };

  // Export file
  const handleExport = async () => {
    setIsExportLoading(true);
    try {
      const res = await getAllPatientsExportApi(debounceSearch || "");

      exportPatientsToExcel(res.data || []);
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
        onClick={onAdd}
      >
        <UserPlus className="text-white" size={18} />
        <p className="text-white">Thêm bệnh nhân</p>
      </button>

      <ImportExcelButton
        isLoading={useAddPatientsMutate.isPending}
        handleImport={handleImport}
      />

      <ExportExcelButton
        isLoading={isExportLoading}
        handleExport={handleExport}
      />
    </div>
  );
};
