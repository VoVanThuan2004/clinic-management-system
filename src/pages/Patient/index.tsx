import { useState } from "react";
import { PatientToolbar } from "./PatientToolbar";
import { Input, Popconfirm } from "antd";
import { AddPatientModal } from "./AddPatientModal";
import { PatientTable } from "./PatientTable";
import { useDebounce } from "use-debounce";
import { useDeletePatients } from "../../hooks/useDeletePatients";
import { getPatientMedicalHistory } from "../../services/patient.service";
import { useAuthStore } from "../../stores/useAuthStore";
const { Search } = Input;

export const PatientPage = () => {
  const role = useAuthStore((state) => state.user?.roleName);

  const [isAddOpen, setIsAddOpen] = useState(false);

  // State quản lý tìm kiếm bệnh nhân
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchText] = useDebounce(searchValue, 500);

  // State quản lý chọn selected patients
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Gọi hook api xóa danh sách bệnh nhân
  const useDeletePatientsMutate = useDeletePatients();

  const data = getPatientMedicalHistory("6aa42062-befd-4eff-b861-6bb390d3c86e");
  console.log(data);
  
  
  const handleBulkDelete = () => {
    useDeletePatientsMutate.mutate(selectedRowKeys as string[], {
      onSuccess: () => {
        setSelectedRowKeys([]);
      }
    })
  }

  const onClose = () => {
    setIsAddOpen(false);
  };

  return (
    <div className="px-5 mt-5">
      {/* Nút thêm mới, import, export */}
      <PatientToolbar onAdd={() => setIsAddOpen(true)} />

      {/* Nút search  */}
      <Search
        placeholder="Tìm kiếm theo tên, SĐT"
        enterButton
        style={{ width: 280 }}
        className="mt-4"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />

      {selectedRowKeys.length > 0 && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 px-4 py-2 rounded-xl mt-4">
          <span className="text-red-600 font-medium">
            Đã chọn {selectedRowKeys.length} bệnh nhân
          </span>

          <div className="flex gap-2">
            <Popconfirm
              title="Xóa bệnh nhân"
              description={`Bạn có chắc muốn xóa ${selectedRowKeys.length} bệnh nhân?`}
              onConfirm={() => handleBulkDelete()}
            >
              <button className="bg-red-500 text-white px-3 py-1.5 rounded-lg cursor-pointer">
                Xóa
              </button>
            </Popconfirm>

            <button
              onClick={() => setSelectedRowKeys([])}
              className="px-3 py-1.5 border border-gray-400 rounded-lg cursor-pointer"
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}

      <PatientTable
        debounceSearch={debouncedSearchText}
        selectedRowKeys={selectedRowKeys}
        onSelectChange={setSelectedRowKeys}
        isLoadingDelete={useDeletePatientsMutate.isPending}
        role={role as string}
      />

      <AddPatientModal open={isAddOpen} onClose={onClose} />
    </div>
  );
};
