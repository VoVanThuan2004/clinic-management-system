import { Popconfirm, Space } from "antd";
import { formatCurrency } from "../../utils/formatCurrency";
import { SquarePen, Trash2Icon } from "lucide-react";

type Props = {
  onEdit: (
    serviceId: string,
    serviceName: string,
    price: number,
    description: string,
  ) => void;
  onDelete: (serviceId: string) => void;
};

export const getServiceColumns = ({ onEdit, onDelete }: Props) => [
  {
    title: "Tên dịch vụ",
    dataIndex: "service_name",
    key: "service_name",
    render: (text: string) => (
      <span className="font-semibold text-gray-800">{text}</span>
    ),
  },

  {
    title: "Giá",
    dataIndex: "price",
    key: "price",
    render: (value: number) => (
      <span className="font-medium text-green-600">
        {formatCurrency(value)}
      </span>
    ),
  },

  {
    title: "Mô tả",
    dataIndex: "description",
    key: "description",
    ellipsis: true,
    render: (text: string) => (
      <span className="text-gray-500 line-clamp-2 max-w-[300px]" title={text}>
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
          onClick={() =>
            onEdit(
              record.service_id,
              record.service_name,
              record.price,
              record.description,
            )
          }
        />

        <Popconfirm
          title="Xóa dịch vụ"
          description="Bạn có chắc chắn muốn xóa dịch vụ này?"
          onConfirm={() => onDelete(record.service_id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Trash2Icon size={18} className="text-red-500 cursor-pointer" />
        </Popconfirm>
      </Space>
    ),
  },
];
