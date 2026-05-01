import { ModalForm } from "../../components/ModalForm";
import { useAddPatient } from "../../hooks/useAddPatient";
import { patientFields } from "./schemas/patient.form";
import { message } from "antd";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const AddPatientModal = (props: Props) => {
  // Gọi hook api thêm bệnh nhân
  const useAddPatientMutate = useAddPatient();

  const onSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      dateOfBirth: values.dateOfBirth
        ? values.dateOfBirth.format("YYYY-MM-DD")
        : null,
    };

    // Gọi hàm mutate để thêm bệnh nhân
    useAddPatientMutate.mutate(
      {
        ...formattedValues,
      },
      {
        onSuccess: () => {
          message.success(useAddPatientMutate.data?.message);
          props.onClose();
        },
      },
    );
  };

  return (
    <ModalForm
      isConfirmLoading={useAddPatientMutate.isPending}
      title="Thêm bệnh nhân"
      type="add"
      open={props.open}
      onClose={props.onClose}
      fields={patientFields}
      onSubmit={onSubmit}
    />
  );
};
