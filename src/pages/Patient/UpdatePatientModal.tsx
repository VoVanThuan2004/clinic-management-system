import { ModalForm } from "../../components/ModalForm";
import type { Patient } from "../../types/patient.type";
import { patientFields } from "./schemas/patient.form";

type Props = {
  open: boolean;
  isLoading: boolean;
  onSubmit: (value: any) => void;
  onClose: () => void;
  patient: Patient;
};

export const UpdatePatientModal = (props: Props) => {
  return (
    <ModalForm
      type="edit"
      title="Cập nhật bệnh nhân"
      open={props.open}
      isConfirmLoading={props.isLoading}
      onClose={props.onClose}
      fields={patientFields}
      onSubmit={props.onSubmit}
      initialValues={props.patient}
    />
  );
};
