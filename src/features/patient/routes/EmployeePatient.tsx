import { UserPlus } from "lucide-react";
import { PatientTable } from "../components/PatientTable";
import { ImportPatientsButton } from "../components/ImportPatientsButton";
import { ExportPatientsButton } from "../components/ExportPatientsButton";
import { useState } from "react";
import { PatientAddModal } from "../components/PatientAddModal";
import { useDebounce } from "use-debounce";
import { Input } from "antd";
const { Search } = Input;

export const EmployeePatient = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  // State quản lý tìm kiếm bệnh nhân
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchText] = useDebounce(searchValue, 500);

  const handleClose = () => {
    setIsAddOpen(false);
  };

  return (
    <div className="px-5 mt-5">
      {/* Nút thêm mới, import, export */}
      <div className="flex items-center gap-2.5">
        <button
          className="flex items-center gap-1.5 bg-blue-500 py-3.5 px-3 rounded-xl cursor-pointer"
          onClick={() => setIsAddOpen(true)}
        >
          <UserPlus className="text-white" size={18} />
          <p className="text-white">Thêm bệnh nhân</p>
        </button>

        <ImportPatientsButton />

        <ExportPatientsButton />
      </div>

      {/* Nút search  */}
      <Search
        placeholder="Tìm kiếm theo tên, SĐT"
        enterButton
        style={{ width: 280 }}
        className="mt-4"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />

      <PatientTable search={debouncedSearchText}/>

      <PatientAddModal isAddOpen={isAddOpen} onClose={handleClose} />
    </div>
  );
};
