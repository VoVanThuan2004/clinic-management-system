import { message, Upload } from "antd";
import { FileUp } from "lucide-react";
import { useState } from "react";
import { readExcelFile } from "../../../pages/Patient/utils/utils/readExcel";
import { validatePatientExcel } from "../../../pages/Patient/utils/utils/validatePatientExcel";
import { transformPatientExcel } from "../../../pages/Patient/utils/utils/transformPatientExcel";
import { useAddPatients } from "../hooks/useAddPatients";

export const ImportPatientsButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { mutate } = useAddPatients();

  const handleImport = async (file: File) => {
    setIsLoading(true);
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
      mutate(patients, {
        onSuccess: () => {
          message.success("Import file thành công");
        },
        onError: () => {
          message.error("Import thất bại");
        },
      });
    } catch (error) {
      console.log(error);
      message.error("Lỗi đọc file");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Upload
      accept=".xlsx, .xls"
      showUploadList={false}
      disabled={isLoading}
      beforeUpload={(file) => {
        handleImport(file);
        return false;
      }}
    >
      <button className="flex items-center gap-1.5 px-3 py-3.5 border border-blue-200 rounded-xl bg-white cursor-pointer">
        <FileUp size={18} className="text-green-600" />
        <p className="text-[16px] font-serif">Import Excel</p>
      </button>
    </Upload>
  );
};
