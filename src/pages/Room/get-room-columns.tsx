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
    dataIndex: "room_name",
    key: "room_name",
    render: (text: string) => (
      <span className="font-medium text-gray-800">{text}</span>
    ),
  },

  {
    title: "Hoạt động",
    dataIndex: "is_active",
    key: "is_active",
    render: (isActive: boolean) => (
      <Tag color={isActive ? "green" : "red"}>
        {isActive ? "Đang dùng" : "Đã tắt"}
      </Tag>
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
            onClick={() => onEdit(record.room_id, record.room_name)}
        />

        <Popconfirm
          title="Xóa danh mục"
          description="Bạn có chắc chắn muốn xóa phòng khám này?"
            onConfirm={() => onDelete(record.room_id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Trash2Icon size={18} className="text-red-500 cursor-pointer" />
        </Popconfirm>
      </Space>
    ),
  },
];
