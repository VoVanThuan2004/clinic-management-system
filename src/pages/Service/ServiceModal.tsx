import { useForm } from "antd/es/form/Form";
import { AppModal } from "../../components/AppModal";
import { useEffect } from "react";
import type { FormField } from "../../types/form-field.type";
import { ServiceForm } from "./ServiceForm";

type Props = {
  title: string;
  okText: string;
  cancelText: string;
  isOpen: boolean;
  onClose: () => void;
  serviceId?: string;
  initialValues?: any;
  onSubmit: (values: any) => void;
  loading: boolean;
};

export const ServiceModal = (props: Props) => {
  const {
    title,
    okText,
    cancelText,
    isOpen,
    onClose,
    initialValues,
    onSubmit,
    loading,
    serviceId,
  } = props;
  const [form] = useForm();

  useEffect(() => {
    if (isOpen && initialValues) {
      form.setFieldsValue({
        service_name: initialValues.service_name,
        price: initialValues.price,
        description: initialValues.description,
      });
    }
  }, [isOpen, initialValues, serviceId]);

  const fieldsInput: FormField[] = [
    {
      name: "service_name",
      label: "Tên dịch vụ",
      type: "input",
      placeholder: "Nhập tên dịch vụ",
      rules: [{ required: true, message: "Vui lòng nhập tên dịch vụ!" }],
    },

    {
      name: "price",
      label: "Giá",
      type: "number",
      placeholder: "Nhập giá dịch vụ",
      props: { min: 0, step: 1000 },
      rules: [
        { required: true, message: "Vui lòng nhập giá dịch vụ!" },
        {
          validator: (_: any, value: any) => {
            if (value === undefined || value === null || value === "") {
              return Promise.resolve();
            }
            const numberValue = Number(value);
            if (Number.isNaN(numberValue) || numberValue <= 0) {
              return Promise.reject(new Error("Giá phải là số lớn hơn 0"));
            }
            return Promise.resolve();
          },
        },
      ],
    },

    {
      name: "description",
      label: "Mô tả",
      type: "textarea",
      placeholder: "Nhập mô tả dịch vụ",
      rules: [
        { required: true, message: "Vui lòng nhập mô tả dịch vụ!" },
        {
          max: 500,
          message: "Mô tả không được quá 500 ký tự",
        },
      ],
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
        <ServiceForm fields={fieldsInput} onSubmit={onSubmit} form={form} />
      }
    />
  );
};
