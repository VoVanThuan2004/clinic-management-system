import { useState } from "react";
import { BaseTable } from "../../components/Table";
import { getPatientColumns } from "./utils/getPatientColumns";
import type { Patient, PatientUpdate } from "../../types/patient.type";
import { usePatients } from "../../hooks/usePatients";
import { useDeletePatient } from "../../hooks/useDeletePatient";
import { useUpdatePatient } from "../../hooks/useUpdatePatient";
import { UpdatePatientModal } from "./UpdatePatientModal";
import { message } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

type Props = {
  debounceSearch: string;
  selectedRowKeys: React.Key[];
  onSelectChange: (keys: React.Key[]) => void;
  isLoadingDelete: boolean;
  role: string;
};

export const PatientTable = ({
  debounceSearch,
  selectedRowKeys,
  onSelectChange,
  isLoadingDelete,
  role,
}: Props) => {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [patientUpdate, setPatientUpdate] = useState<Patient>();
  const [patientId, setPatientId] = useState("");
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    current: 0,
    pageSize: 10,
  });

  const { data, isLoading } = usePatients({
    page: pagination.current,
    pageSize: pagination.pageSize,
    search: debounceSearch || "",
  });
  const patients = data?.data?.content || [];

  const useDeletePatientMutate = useDeletePatient();

  const useUpdatePatientMutate = useUpdatePatient();

  // Xử lý cập nhật bệnh nhân
  const showUpdateModal = (patient: Patient) => {
    setIsUpdateOpen(true);
    setPatientUpdate(patient);
    setPatientId(patient.patientId);
  };

  const handleUpdate = (values: PatientUpdate) => {
    const formattedValues = {
      ...values,
      dateOfBirth: values.dateOfBirth
        ? dayjs(values.dateOfBirth).format("YYYY-MM-DD")
        : "",
    };

    if (!values) return;

    useUpdatePatientMutate.mutate(
      {
        patientId: patientId,
        patientUpdate: formattedValues,
      },
      {
        onSuccess: () => {
          message.success(useUpdatePatientMutate.data?.message);
          setIsUpdateOpen(false);
        },
      },
    );
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    useDeletePatientMutate.mutate(id);
  };

  const onViewPatientHistory = (patientId: string) => {
    if (!patientId) return;
    if (role === "employee") {
      navigate(`/employee/patients/${patientId}`);
    }
    if (role === "admin") {
      navigate(`/admin/users/patients/${patientId}`);
    }
  };

  // Lấy các column đã định nghĩa trong table
  const columns = getPatientColumns({
    onEdit: showUpdateModal,
    onDelete: handleDelete,
    onViewPatientHistory,
  });

  const onClose = () => {
    setIsUpdateOpen(false);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <>
      <BaseTable
        loading={
          isLoading ||
          useUpdatePatientMutate.isPending ||
          useDeletePatientMutate.isPending ||
          isLoadingDelete
        }
        columns={columns}
        dataSource={patients}
        rowKey={"patientId"}
        rowSelection={rowSelection}
        pagination={{
          current: pagination.current + 1,
          pageSize: pagination.pageSize,
          total: data?.data?.totalElements || 0,

          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],

          onChange: (page, pageSize) => {
            setPagination({
              current: page - 1,
              pageSize: pageSize,
            });
          },
        }}
      />

      <UpdatePatientModal
        isLoading={useUpdatePatientMutate.isPending}
        open={isUpdateOpen}
        onSubmit={handleUpdate}
        onClose={onClose}
        patient={patientUpdate as Patient}
      />
    </>
  );
};
