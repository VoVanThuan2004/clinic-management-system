import { useForm } from "antd/es/form/Form";
import { AppModal } from "../../components/AppModal";
import { CategoryForm } from "./CategoryForm";
import type { FormField } from "../../types/form-field.type";
import { useEffect } from "react";

type Props = {
  title: string;
  okText: string;
  cancelText: string;
  isOpen: boolean;
  onClose: () => void;
  categoryId?: string;
  initialValues?: any;
  onSubmit: (values: any) => void;
  loading: boolean;
};

export const CategoryModal = (props: Props) => {
  const {
    title,
    okText,
    cancelText,
    isOpen,
    onClose,
    initialValues,
    categoryId,
    onSubmit,
    loading,
  } = props;
  const [form] = useForm();

  useEffect(() => {
    if (isOpen && initialValues) {
      form.setFieldsValue({
        category_name: initialValues,
      });
    }
  }, [isOpen, initialValues, categoryId]);

  const fieldsInput: FormField[] = [
    {
      name: "category_name",
      label: "Tên danh mục",
      type: "input",
      placeholder: "Nhập danh mục",
      rules: [{ required: true, message: "Vui lòng nhập tên danh mục!" }],
    },
  ];

  return (
    <AppModal
      title={title}
      open={isOpen}
      onClose={onClose}
      okText={okText}
      cancelText={cancelText}
      onOk={() => form.submit()}
      confirmLoading={loading}
      children={
        <CategoryForm fields={fieldsInput} onSubmit={onSubmit} form={form} />
      }
    />
  );
};
