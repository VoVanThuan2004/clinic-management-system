import { Download } from "lucide-react";
import { exportPatientsToExcel } from "../../../pages/Patient/utils/utils/exportPatientsToExcel";
import type { Patient } from "../types/patient";
import { getAllPatientsApi } from "../api/get-all-patients";

export const ExportPatientsButton = () => {
  // Export file
  const handleExport = async () => {
    try {
      const { data } = await getAllPatientsApi();

      exportPatientsToExcel(data as Patient[]);
    } catch (error) {
      alert("Lỗi khi tải file!");
      console.log(error);
    }
  };

  return (
    <button
      className="flex items-center gap-1.5 px-3 py-3.5 border border-blue-200 rounded-xl bg-white cursor-pointer"
      onClick={() => handleExport()}
    >
      <Download size={18} className="text-blue-600" />
      <p className="text-[16px] font-serif">Export Excel</p>
    </button>
  );
};
