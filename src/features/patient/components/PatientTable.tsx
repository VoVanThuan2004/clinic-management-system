import { Popconfirm, Space, Table, type TableProps } from "antd";
import { usePatients } from "../hooks/usePatients";
import { useState } from "react";
import { formatDate } from "../../../utils/formatDate";
import { useDeletePatient } from "../hooks/useDeletePatient";
import { PatientUpdateModal } from "./PatientUpdateModal";
import type { Patient, PatientUpdate } from "../types/patient";
import { useUpdatePatient } from "../hooks/useUpdatePatient";
import { Eye, SquarePen, Trash2Icon } from "lucide-react";

interface DataType {
  id: string;
  patient_code: string;
  full_name: string;
  date_of_birth: string;
  gender: number;
  phone_number: string;
  address: string;
}

type Props = {
  search?: string;
};

export const PatientTable = (props: Props) => {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [patientUpdate, setPatientUpdate] = useState<Patient>();
  const [patientId, setPatientId] = useState("");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const { data, isLoading } = usePatients({
    page: pagination.current,
    pageSize: pagination.pageSize,
    search: props?.search,
  });

  const useDeletePatientMutate = useDeletePatient();

  const useUpdatePatientMutate = useUpdatePatient();

  const handleDelete = async (id: string) => {
    useDeletePatientMutate.mutate(id);
  };

  // Xử lý cập nhật bệnh nhân
  const showUpdateModal = (patient: Patient) => {
    setIsUpdateOpen(true);
    setPatientUpdate(patient);
    setPatientId(patient.id);
  };

  const handleUpdate = (patient: PatientUpdate) => {
    console.log(patient);

    if (!patient) return;
    useUpdatePatientMutate.mutate({
      patientId: patientId,
      patientUpdate: patient,
    });
  };

  const handleCancelUpdate = () => {
    setIsUpdateOpen(false);
    setPatientUpdate(undefined);
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Mã BN",
      dataIndex: "patient_code",
      key: "patient_code",
      render: (id: number) => (
        <span className="text-blue-600 font-medium">{id}</span>
      ),
    },
    {
      title: "Họ tên",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "Ngày sinh",
      dataIndex: "date_of_birth",
      key: "date_of_birth",
      render: (date) => <p>{formatDate(date)}</p>,
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => (gender === 1 ? "Nam" : "Nữ"),
    },
    {
      title: "SĐT",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          {/* Icon xem lucide */}
          <Eye size={18} className="text-blue-600 cursor-pointer hover:text-blue-800 transition" />

          <SquarePen size={18} className="text-yellow-500 cursor-pointer hover:text-yellow-600 transition" 
            onClick={() =>
              showUpdateModal({
                id: record.id,
                patient_code: record.patient_code,
                full_name: record.full_name,
                gender: record.gender,
                phone_number: record.phone_number,
                date_of_birth: record.date_of_birth,
                address: record.address,
              })
            }
          />
          <Popconfirm
            title="Xóa bệnh nhân"
            description="Bạn có chắc chắn muốn xóa bệnh nhân này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Trash2Icon size={18} className="text-red-500 cursor-pointer hover:text-red-600 transition" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="mt-5 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <Table<DataType>
        loading={
          isLoading ||
          useDeletePatientMutate.isPending ||
          useUpdatePatientMutate.isPending
        }
        columns={columns}
        dataSource={data?.data || []}
        scroll={{ x: 1000 }}
        className="[&_.ant-table]:rounded-2xl"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: data?.count || 0,

          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],

          onChange: (page, pageSize) => {
            setPagination({
              current: page,
              pageSize: pageSize,
            });
          },
        }}
      />

      <PatientUpdateModal
        isUpdateOpen={isUpdateOpen}
        onClose={handleCancelUpdate}
        patient={patientUpdate}
        onSubmit={handleUpdate}
      />
    </div>
  );
};
