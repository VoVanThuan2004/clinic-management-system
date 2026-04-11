import { UserPlus } from "lucide-react";
import { ExportExcelButton } from "../../components/ExportExcelButton";
import { useState } from "react";
import type { Employee } from "../../types/employee";
import { getAllEmployees } from "../../services/employee.service";
import { formatDate } from "../../utils/formatDate";
import { exportExcel } from "../../utils/excel/exportExcel";
import { message } from "antd";

type Props = {
  onOpenAdd: () => void;
};

export const Toolbar = (props: Props) => {
  const { onOpenAdd } = props;
  const [isExportLoading, setIsExportLoading] = useState(false);

  // Export file
  const handleExport = async () => {
    setIsExportLoading(true);
    try {
      const { data } = await getAllEmployees({});

      const mappingData = (data as Employee[]).map((e) => ({
        "Email": e.email,
        "Họ tên": e.fullname,
        "Giới tính": e.gender === 1 ? "Nam" : "Nữ",
        "Ngày sinh": formatDate(e.date_of_birth),
        "SĐT": e.phonenumber,
        "Địa chỉ": e.address,
      }));

      exportExcel({
        data: mappingData,
        fileName: "employees.xlsx",
        name: "Employees"
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
        <p className="text-white">Thêm nhân viên</p>
      </button>

      <ExportExcelButton
        isLoading={isExportLoading}
        handleExport={handleExport}
      />
    </div>
  );
};
