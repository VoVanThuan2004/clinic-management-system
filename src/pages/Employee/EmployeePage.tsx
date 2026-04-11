import { useState } from "react";
import { BaseTable } from "../../components/Table";
import { useEmployees } from "../../hooks/employee/useEmployees";
import { getEmployeeColumns } from "./get-employee-columns";
import { Toolbar } from "./Toolbar";
import { Input } from "antd";
import type { Employee } from "../../types/employee";
import { useDebounce } from "use-debounce";
import { EmployeeCreateModal } from "./EmployeeCreateModal";
import { EmployeeUpdateModal } from "./EmployeeUpdateModal";
const { Search } = Input;

export const EmployeePage = () => {
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [searchValue, setSearchValue] = useState("");
  const [debounceSearch] = useDebounce(searchValue, 500);

  // Gọi hook api lấy danh sách nhân viên
  const { data, isLoading } = useEmployees({
    page: pagination.current,
    pageSize: pagination.pageSize,
    search: debounceSearch,
  });

  const mappedEmployees = data?.data as Employee[];

  const openUpdateModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setSelectedEmployeeId(employee.id);
    setIsOpenUpdate(true);
    
  }

  const openAddModal = () => {
    setIsOpenAdd(true);
  }

  const closeAddModal = () => {
    setIsOpenAdd(false);
  }

  const closeUpdateModal = () => {
    setIsOpenUpdate(false);
    setSelectedEmployee(null);
  };

  const columns = getEmployeeColumns({
    onOpenUpdate: openUpdateModal,
    onDelete: (id) => {
      console.log("Delete", id);
    },
  });

  return (
    <div className="px-5 mt-5">
      {/* Nút thêm mới, import, export */}
      <Toolbar onOpenAdd={openAddModal}/>

      {/* Nút search  */}
      <Search
        placeholder="Tìm kiếm theo email, họ tên"
        enterButton
        style={{ width: 280 }}
        className="mt-4"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />

      <BaseTable
        loading={isLoading}
        columns={columns}
        dataSource={mappedEmployees}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: data?.count || 0,

          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],

          onChange: (page, pageSize) => {
            setPagination({
              current: page,
              pageSize: pageSize,
            });
          },
        }}
      />

      <EmployeeCreateModal isOpen={isOpenAdd} onClose={closeAddModal} />
      <EmployeeUpdateModal
        isOpen={isOpenUpdate}
        onClose={closeUpdateModal}
        employeeId={selectedEmployeeId}
        initialValues={selectedEmployee}
      />
    </div>
  );
};
