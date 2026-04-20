import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";
import type { FormField } from "../../types/form-field.type";
import { AppModal } from "../../components/AppModal";
import { RoomForm } from "./RoomForm";

type Props = {
  title: string;
  okText: string;
  cancelText: string;
  isOpen: boolean;
  onClose: () => void;
  roomId?: string;
  initialValues?: any;
  onSubmit: (values: any) => void;
  loading: boolean;
};

export const RoomModal = (props: Props) => {
  const {
    title,
    okText,
    cancelText,
    isOpen,
    onClose,
    initialValues,
    onSubmit,
    loading,
    roomId,
  } = props;
  const [form] = useForm();

  useEffect(() => {
    if (isOpen && initialValues) {
      form.setFieldsValue({
        room_name: initialValues,
      });
    }
  }, [isOpen, initialValues, roomId]);

  const fieldsInput: FormField[] = [
    {
      name: "room_name",
      label: "Tên phòng khám",
      type: "input",
      placeholder: "Nhập tên phòng khám",
      rules: [{ required: true, message: "Vui lòng nhập tên phòng khám!" }],
    },
  ];

  const onCloseModal = () => {
    onClose();
    form.resetFields();
  }

  return (
    <AppModal
      title={title}
      open={isOpen}
      onClose={onCloseModal}
      okText={okText}
      cancelText={cancelText}
      onOk={() => form.submit()}
      confirmLoading={loading}
      children={
        <RoomForm fields={fieldsInput} onSubmit={onSubmit} form={form} />
      }
    />
  );
};
