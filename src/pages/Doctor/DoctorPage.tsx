import { useState } from "react";
import { Toolbar } from "./Toolbar";
import { useDebounce } from "use-debounce";
import { useDoctors } from "../../hooks/doctor/useDoctors";
import { BaseTable } from "../../components/Table";
import { Input } from "antd";
import { getDoctorColumns } from "./get-doctor-columns";
import type { DoctorResponse } from "../../types/doctor.type";
import { DoctorCreateModal } from "./DoctorCreateModal";
import { DoctorUpdateModal } from "./DoctorUpdateModal";
const { Search } = Input;

export const DoctorPage = () => {
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorResponse | null>(
    null,
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [searchValue, setSearchValue] = useState("");
  const [debounceSearch] = useDebounce(searchValue, 500);

  // Gọi hook api lấy danh sách nhân viên
  const { data, isLoading } = useDoctors({
    page: pagination.current,
    pageSize: pagination.pageSize,
    search: debounceSearch,
  });

  const mappedDoctors = data?.data as DoctorResponse[];

  const onOpenAddModal = () => {
    setIsOpenAdd(true);
  };

  const onCloseAddModal = () => {
    setIsOpenAdd(false);
  };

  // ==== Update ====
  const onOpenUpdateModal = (values: any) => {
    setSelectedDoctor(values);
    setSelectedDoctorId(values.id);
    setIsOpenUpdate(true);
  };

  const onCloseUpdateModal = () => {
    setIsOpenUpdate(false);
  };

  const columns = getDoctorColumns({
    onOpenUpdate: onOpenUpdateModal,
    onDelete: () => {},
  });

  return (
    <div className="px-5 mt-5">
      <Toolbar onOpenAdd={onOpenAddModal} />

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
        dataSource={mappedDoctors}
        scroll={{ x: "max-content" }}
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

      <DoctorCreateModal isOpen={isOpenAdd} onClose={onCloseAddModal} />
      <DoctorUpdateModal
        doctorId={selectedDoctorId}
        isOpen={isOpenUpdate}
        onClose={onCloseUpdateModal}
        initialValues={selectedDoctor}
      />
    </div>
  );
};
