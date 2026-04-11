import { ModalForm } from "../../components/ModalForm";
import { generatePatientCode } from "../../utils/generatePatientCode";
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
    // Tạo mã code bệnh nhân
    const patient_code = generatePatientCode();

    const formattedValues = {
      ...values,
      date_of_birth: values.date_of_birth 
        ? values.date_of_birth.format("YYYY-MM-DD") 
        : null,
    };

    // Gọi hàm mutate để thêm bệnh nhân
    useAddPatientMutate.mutate(
      {
        patient_code,
        ...formattedValues,
      },
      {
        onSuccess: () => {
          message.success("Thêm bệnh nhân thành công");
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
