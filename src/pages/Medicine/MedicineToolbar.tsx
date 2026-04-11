import { Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { PlusIcon } from "lucide-react";
import { useCategoriesOption } from "../../hooks/category/useCategoriesOption";
import { useState } from "react";
import { useDebounce } from "use-debounce";

type Props = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
    onOpenAddModal: () => void;
};

export const MedicineToolbar = (props: Props) => {
  const { search, setSearch, setSelectedCategory, onOpenAddModal } = props;
  const [searchCategory, setSearchCategory] = useState("");
  const [debouncedSearch] = useDebounce(searchCategory, 500);

  // Gọi hook api lấy danh sách categories option
  const { isLoading, categories } = useCategoriesOption({
    search: debouncedSearch,
  });

  const mappingCategories = categories.map((c) => ({
    label: c.category_name,
    value: c.category_id,
  }));

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Ô tìm kiếm bên trái */}
        <div className="w-full sm:w-[240px] lg:w-[400px]">
          <Input
            placeholder="Tìm theo tên thuốc..."
            prefix={<SearchOutlined />}
            allowClear
            className="h-[42px] text-[15px] rounded-lg w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-[240px] lg:w-[400px]">
          <Select
            className="h-[42px] w-full"
            showSearch
            allowClear
            placeholder="Tìm và chọn danh mục"
            filterOption={false}
            onSearch={(value) => setSearchCategory(value)}
            options={mappingCategories}
            onChange={(value) => setSelectedCategory(value)}
            notFoundContent={
              !searchCategory
                ? null
                : isLoading
                  ? "Đang tải..."
                  : "Không tìm thấy kết quả"
            }
          />
        </div>
      </div>

      {/* Nút thêm danh mục bên phải */}
      <button
        className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 transition py-3.5 px-3 rounded-xl cursor-pointer"
        onClick={() => onOpenAddModal()}
      >
        <PlusIcon className="text-white" size={18} />
        <p className="hidden md:block text-white">Thêm thuốc</p>
      </button>
    </div>
  );
};
