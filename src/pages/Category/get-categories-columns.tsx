import { Popconfirm, Space } from "antd";
import dayjs from "dayjs";
import { SquarePen, Trash2Icon } from "lucide-react";

type Props = {
    onEdit: (categoryId: string, categoryName: string) => void;
    onDelete: (categoryId: string) => void;
}

export const getCategoriesColumns = ({ onDelete, onEdit }: Props) => [
  {
    title: "Tên danh mục",
    dataIndex: "category_name",
    key: "category_name",
    render: (text: string) => (
      <span className="font-medium text-gray-800">{text}</span>
    ),
  },

  {
    title: "Thời gian tạo",
    dataIndex: "created_at",
    key: "created_at",
    render: (time: string) => (
      <span className="text-gray-600">
        {dayjs(time).format("HH:mm DD/MM/YYYY")}
      </span>
    ),
  },

  {
    title: "Thời gian cập nhật",
    dataIndex: "updated_at",
    key: "updated_at",
    render: (time: string) => (
      <span className="text-gray-600">
        {dayjs(time).format("HH:mm DD/MM/YYYY")}
      </span>
    ),
  },
  {
    title: "Hành động",
    key: "action",
    render: (_: any, record: any) => (
      <Space>
        <SquarePen
          size={18}
          className="text-yellow-500 cursor-pointer"
            onClick={() => onEdit(record.category_id, record.category_name)}
        />

        <Popconfirm
          title="Xóa danh mục"
          description="Bạn có chắc chắn muốn xóa danh mục này?"
            onConfirm={() => onDelete(record.category_id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Trash2Icon size={18} className="text-red-500 cursor-pointer" />
        </Popconfirm>
      </Space>
    ),
  },
];
