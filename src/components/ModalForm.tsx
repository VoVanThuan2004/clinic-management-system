import { Form, Modal } from "antd";
import type { FormField } from "../types/form-field.type";
import { renderField } from "../utils/renderField";
import { useEffect } from "react";
import dayjs from "dayjs";

type Props = {
  type: "add" | "edit";
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  isConfirmLoading?: boolean;
  title: string;
  fields: FormField[];
  initialValues?: Record<string, any>;
};

export const ModalForm = ({
  type,
  open,
  onClose,
  onSubmit,
  isConfirmLoading,
  title,
  fields,
  initialValues,
}: Props) => {
  const [form] = Form.useForm();

  // Set dữ liệu khi mở modal
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        ...initialValues,
        date_of_birth: initialValues?.date_of_birth
          ? dayjs(initialValues.date_of_birth)
          : null,
      });
    } else {
      form.resetFields();
    }
  }, [open, initialValues]);

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={handleClose}
      centered
      okText={type === "add" ? "Thêm" : "Cập nhật"}
      cancelText="Hủy"
      confirmLoading={isConfirmLoading}
      onOk={() => form.submit()}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            rules={field.rules}
          >
            {renderField(field)}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};
