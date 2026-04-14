import { Button, Empty, Input, Modal, Pagination, Select, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { MedicineItem } from "./MedicineItem";
import { useCategories } from "../../../hooks/category/useCategories";
import type { Category } from "../../../types/category.type";
import { useMemo, useState } from "react";
import { useMedicines } from "../../../hooks/medicine/useMedicines";
import type { Medicine } from "../../../types/medicine.type";
import { useDebounce } from "use-debounce";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  prescriptionId: string;
};

export const MedicineModal = (props: Props) => {
  const { isOpen, onClose, prescriptionId } = props;
  const [categoryId, setCategoryId] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 6,
  });
  const [searchMedicine, setSearchMedicine] = useState("");
  const [searchMedicineDebouned] = useDebounce(searchMedicine, 500);

  // Gọi hook api lấy danh sách danh mục thuốc
  const { categories, isLoading, error } = useCategories();

  // Gọi hook api lấy danh sách thuốc theo categoryId
  const { data, isLoading: isMedicinesLoading } = useMedicines({
    search: searchMedicineDebouned,
    category_id: categoryId,
    page: pagination.page,
    pageSize: pagination.pageSize,
  });
  const medicines = data?.data || [];


  // tạo options cho Select từ categories, tạo label và value (all) măc định
  const categoryOptions = categories.map((category: Category) => ({
    label: category.category_name,
    value: category.category_id,
  }));

  // Thêm tùy chọn "Tất cả" vào đầu danh sách
  categoryOptions.unshift({
    label: "Tất cả",
    value: "all",
  });

  // Sử dụng useMemo để ghi nhớ  categoryOptions, tránh tính toán lại khi categories không thay đổi
  const memoizedCategoryOptions = useMemo(
    () => categoryOptions,
    [categoryOptions],
  );

  if (error) {
    alert("Lỗi khi tải danh mục thuốc: " + error);
    return;
  }

  return (
    <Modal
      open={isOpen}
      title={
        <div>
          <h2 className="text-lg font-semibold">Chọn thuốc</h2>

          {/* Ô tìm kiếm + select chọn danh mục */}
          <div className="flex gap-4 mt-3">
            <Input
              placeholder="Tìm theo tên thuốc..."
              prefix={<SearchOutlined />}
              allowClear
              className="h-[42px] text-[15px] rounded-lg"
              value={searchMedicine}
              onChange={(e) => setSearchMedicine(e.target.value)}
            />

            <Select
              loading={isLoading}
              className="h-[42px]"
              style={{ width: 800 }}
              showSearch
              placeholder="Tìm và chọn danh mục thuốc"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={memoizedCategoryOptions}
              defaultValue={categoryId}
              onChange={(value) => {
                setCategoryId(value);
              }}
            />
          </div>
        </div>
      }
      onCancel={onClose}
      centered
      destroyOnClose
      width={1000}
      footer={[
        <div key="footer-wrapper" className="flex flex-col gap-4">
          {/* Phân trang nằm trong footer hoặc ngay trên nút Hủy */}
          {!isMedicinesLoading && medicines.length > 0 && (
            <div className="py-2 border-t border-gray-50">
              <Pagination
                align="center"
                current={pagination.page}
                pageSize={pagination.pageSize}
                total={data?.count || 0} // Lấy tổng số record từ API trả về
                onChange={(page, pageSize) => {
                  setPagination({ page, pageSize });
                }}
                showSizeChanger={false} // Ẩn chọn số lượng mỗi trang nếu không cần thiết
                size="medium"
              />
            </div>
          )}
          <div className="flex justify-end">
            <Button key="back" onClick={onClose}>
              Hủy
            </Button>
          </div>
        </div>,
      ]}
    >
      {/* Hiển thị danh sách thuốc theo grid */}
      <div className="mt-4 min-h-[400px]">
        {isMedicinesLoading ? (
          <div className="flex items-center justify-center py-20 w-full">
            <Spin />
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {medicines.length > 0 ? (
              medicines.map((medicine: Medicine) => (
                <MedicineItem key={medicine.medicine_id} medicine={medicine} prescriptionId={prescriptionId}/>
              ))
            ) : (
              <div className="flex items-center justify-center py-20 w-full">
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
