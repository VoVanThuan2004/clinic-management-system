import { Popconfirm, Space, Tag } from "antd";
import dayjs from "dayjs";
import { SquarePen, Trash2Icon } from "lucide-react";

type Props = {
    onEdit: (roomId: string, roomName: string) => void;
    onDelete: (roomId: string) => void;
}

export const getRoomColumns = ({ onEdit, onDelete }: Props) => [
  {
    title: "Tên phòng",
    dataIndex: "roomName",
    key: "roomName",
    render: (text: string) => (
      <span className="font-medium text-gray-800">{text}</span>
    ),
  },

  {
    title: "Hoạt động",
    dataIndex: "active",
    key: "active",
    render: (active: boolean) => (
      <Tag color={active ? "green" : "red"}>
        {active ? "Hoạt động" : "Đã tắt"}
      </Tag>
    ),
  },

  {
    title: "Thời gian tạo",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (time: string) => (
      <span className="text-gray-600">
        {dayjs(time).format("HH:mm DD/MM/YYYY")}
      </span>
    ),
  },

  {
    title: "Thời gian cập nhật",
    dataIndex: "updatedAt",
    key: "updatedAt",
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
            onClick={() => onEdit(record.roomId, record.roomName)}
        />

        <Popconfirm
          title="Xóa danh mục"
          description="Bạn có chắc chắn muốn xóa phòng khám này?"
            onConfirm={() => onDelete(record.roomId)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Trash2Icon size={18} className="text-red-500 cursor-pointer" />
        </Popconfirm>
      </Space>
    ),
  },
];
