import { Popconfirm, Space } from "antd";
import { formatDate } from "../../../utils/formatDate";
import { Eye, SquarePen, Trash2Icon } from "lucide-react";

type Props = {
  onEdit: (record: any) => void;
  onDelete: (id: string) => void;
  onViewPatientHistory: (patientId: string) => void;
};

export const getPatientColumns = ({ onEdit, onDelete, onViewPatientHistory }: Props) => [
  {
    title: "Mã BN",
    dataIndex: "patientCode",
    key: "patientCode",
    render: (id: number) => (
      <span className="text-blue-600 font-medium">{id}</span>
    ),
  },
  {
    title: "Họ tên",
    dataIndex: "fullName",
    key: "fullName",
  },
  {
    title: "Ngày sinh",
    dataIndex: "dateOfBirth",
    key: "dateOfBirth",
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
    dataIndex: "phoneNumber",
    key: "phoneNumber",
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
        <Eye size={18} className="text-blue-600 cursor-pointer" 
          onClick={() => onViewPatientHistory(record.id)}
        />

        <SquarePen
          size={18}
          className="text-yellow-500 cursor-pointer"
          onClick={() => onEdit(record)}
        />

        <Popconfirm
          title="Xóa bệnh nhân"
          description="Bạn có chắc chắn muốn xóa bệnh nhân này?"
          onConfirm={() => onDelete(record.patientId)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Trash2Icon size={18} className="text-red-500 cursor-pointer" />
        </Popconfirm>
      </Space>
    ),
  },
];
