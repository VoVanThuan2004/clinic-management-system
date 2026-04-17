import { Input } from "antd";
import { PlusIcon } from "lucide-react";
import { SearchOutlined } from "@ant-design/icons";

type Props = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  onShowAddModal: () => void;
}

export const CategoryToolbar = (props: Props) => {
  const { search, setSearch, onShowAddModal } = props;
  return (
    <div className="flex items-center justify-between gap-3">
      {/* Ô tìm kiếm bên trái */}
      <div className="w-full sm:min-w-[200px] sm:flex-1 lg:max-w-[500px]">
        <Input
          placeholder="Tìm theo tên danh mục..."
          prefix={<SearchOutlined />}
          allowClear
          className="h-[42px] text-[15px] rounded-lg w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Nút thêm danh mục bên phải */}
      <button className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 transition py-3.5 px-3 rounded-xl cursor-pointer"
        onClick={() => onShowAddModal()}
      >
        <PlusIcon className="text-white" size={18} />
        <p className="hidden md:block text-white">Thêm danh mục</p>
      </button>
    </div>
  );
};
