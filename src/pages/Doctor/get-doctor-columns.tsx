import { Avatar, Popconfirm, Space } from "antd";
import { formatDate } from "../../utils/formatDate";
import { Key, SquarePen, Trash2Icon } from "lucide-react";

type Props = {
  onOpenUpdate: (record: any) => void;
  onDelete: (id: string) => void;
  onResetPassword: (email: string) => Promise<void>;
};

export const getDoctorColumns = ({
  onOpenUpdate,
  onDelete,
  onResetPassword,
}: Props) => [
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
          <Avatar size={30} src={avatar} className="bg-blue-500 text-white">
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
    title: "Chuyên khoa",
    key: "doctor_details.specialty",
    render: (_: any, record: any) => record.doctor_details?.specialty || "-",
  },
  {
    title: "Năm kinh nghiệm",
    key: "experience_years",
    render: (_: any, record: any) =>
      record.doctor_details?.experience_years || "-",
  },
  {
    title: "Tiểu sử",
    key: "biography",
    render: (_: any, record: any) => record.doctor_details?.biography || "-",
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
          title="Reset mật khẩu"
          description={`Gửi email reset password tới ${record.email}?`}
          onConfirm={() => onResetPassword(record.email)}
          okText="Gửi"
          cancelText="Hủy"
        >
          <Key size={18} className="text-blue-500 cursor-pointer" />
        </Popconfirm>

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
