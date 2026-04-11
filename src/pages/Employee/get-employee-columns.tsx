import { Avatar, Popconfirm, Space } from "antd";
import { formatDate } from "../../utils/formatDate";
import { SquarePen, Trash2Icon } from "lucide-react";
import type { Employee } from "../../types/employee";

type Props = {
  onOpenUpdate: (employee: Employee) => void;
  onDelete: (id: string) => void;
};

export const getEmployeeColumns = ({ onOpenUpdate, onDelete }: Props) => [
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (email: string) => (
      <span className="text-blue-600 font-medium">{email}</span>
    ),
  },
  {
    title: "Họ tên",
    key: "fullname",
    render: (_: any, record: any) => {
      const name = record.fullname || "";
      const avatar = record.avatarurl;

      return (
        <div className="flex items-center gap-3">
          <Avatar size={34} src={avatar} className="bg-blue-500 text-white">
            {!avatar && name.charAt(0).toUpperCase()}
          </Avatar>

          <span className="font-medium text-gray-700">{name}</span>
        </div>
      );
    },
  },
  {
    title: "Ngày sinh",
    dataIndex: "date_of_birth",
    key: "date_of_birth",
    render: (date: string) => <p>{formatDate(date)}</p>,
  },
  {
    title: "Giới tính",
    dataIndex: "gender",
    key: "gender",
    render: (gender: number) => (gender === 1 ? "Nam" : "Nữ"),
  },
  {
    title: "SĐT",
    dataIndex: "phonenumber",
    key: "phonenumber",
  },
  {
    title: "Địa chỉ",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Hành động",
    key: "action",
    render: (_: any, record: any) => (
      <Space>

        <SquarePen
          size={18}
          className="text-yellow-500 cursor-pointer"
          onClick={() => onOpenUpdate(record)}
        />

        <Popconfirm
          title="Xóa nhân viên"
          description="Bạn có chắc chắn muốn xóa bệnh nhân này?"
          onConfirm={() => onDelete(record.id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Trash2Icon size={18} className="text-red-500 cursor-pointer" />
        </Popconfirm>
      </Space>
    ),
  },
];