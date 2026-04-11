import { Popconfirm, Space } from "antd";
import { formatCurrency } from "../../utils/formatCurrency";
import { SquarePen, Trash2Icon } from "lucide-react";

type Props = {
  onDelete: (medicineId: string, fileUrl: string) => void;
  onEdit: (values: any) => void;
}

export const getMedicineColumns = ({ onDelete, onEdit }: Props) => [
  {
    title: "Ảnh",
    dataIndex: "image",
    key: "image",
    width: 70,
    render: (imgUrl: string) => (
      <img
        alt="ảnh thuốc"
        src={imgUrl}
        className="w-10 h-10 object-cover rounded-md border"
      />
    ),
  },

  {
    title: "Tên thuốc",
    dataIndex: "medicine_name",
    key: "medicine_name",
    render: (text: string) => (
      <span className="font-semibold text-gray-800">{text}</span>
    ),
  },

  {
    title: "Đơn vị",
    dataIndex: "unit",
    key: "unit",
    width: 100,
    render: (text: string) => <span className="text-gray-600">{text}</span>,
  },

  {
    title: "Giá nhập",
    dataIndex: "original_price",
    key: "original_price",
    render: (value: number) => (
      <span className="font-medium text-gray-700">{formatCurrency(value)}</span>
    ),
  },

  {
    title: "Giá bán",
    dataIndex: "selling_price",
    key: "selling_price",
    render: (value: number) => (
      <span className="font-semibold text-green-600">
        {formatCurrency(value)}
      </span>
    ),
  },

  {
    title: "Tồn kho",
    dataIndex: "stock_quantity",
    key: "stock_quantity",
    width: 100,
    render: (value: number) => (
      <span
        className={`font-medium ${
          value > 0 ? "text-blue-600" : "text-red-500"
        }`}
      >
        {value}
      </span>
    ),
  },

  {
    title: "Mô tả",
    dataIndex: "description",
    key: "description",
    ellipsis: true,
    render: (text: string) => (
      <span className="text-gray-500 line-clamp-2 max-w-[250px]" title={text}>
        {text}
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
          onClick={() => onEdit(record)}
        />

        <Popconfirm
          title="Xóa danh mục"
          description="Bạn có chắc chắn muốn xóa thuốc này?"
          onConfirm={() => onDelete(record.medicine_id, record.image)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Trash2Icon size={18} className="text-red-500 cursor-pointer" />
        </Popconfirm>
      </Space>
    ),
  },
];
