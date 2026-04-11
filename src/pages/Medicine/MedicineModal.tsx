import { useForm } from "antd/es/form/Form";
import { AppModal } from "../../components/AppModal";
import type { FormField } from "../../types/form-field.type";
import { MedicineForm } from "./MedicineForm";
import { useCategoriesOption } from "../../hooks/category/useCategoriesOption";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { convertImageToFileList } from "../../utils/convertImageToFileList";

type Props = {
  title: string;
  okText: string;
  cancelText: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  loading: boolean;
  initialValues?: any;
};

export const MedicineModal = (props: Props) => {
  const {
    title,
    okText,
    cancelText,
    isOpen,
    onClose,
    onSubmit,
    loading,
    initialValues,
  } = props;
  const [form] = useForm();

  const [searchCategory, setSearchCategory] = useState("");
  const [debouncedSearch] = useDebounce(searchCategory, 500);

  useEffect(() => {
    if (isOpen && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        image: convertImageToFileList(initialValues.image),
      });
    }
  }, [isOpen, initialValues]);

  // Gọi hook api lấy danh sách categories option
  const { categories } = useCategoriesOption({
    search: debouncedSearch,
  });

  const mappingCategories = categories.map((c) => ({
    label: c.category_name,
    value: c.category_id,
  }));

  const onCloseModal = () => {
    form.resetFields();
    onClose();
  };

  const medicineFields: FormField[] = [
    {
      name: "category_id",
      label: "Danh mục",
      type: "select",
      placeholder: "Chọn danh mục",
      options: mappingCategories,
      showSearch: true,
      props: {
        onSearch: (value: string) => setSearchCategory(value),
        allowClear: true,
      },
      rules: [{ required: true, message: "Vui lòng chọn danh mục!" }],
    },

    {
      name: "medicine_name",
      label: "Tên thuốc",
      type: "input",
      placeholder: "Nhập tên thuốc",
      rules: [{ required: true, message: "Vui lòng nhập tên thuốc!" }],
    },

    {
      name: "unit",
      label: "Đơn vị",
      type: "input",
      placeholder: "Ví dụ: viên, hộp, chai...",
      rules: [{ required: true, message: "Vui lòng nhập đơn vị!" }],
    },

    {
      name: "original_price",
      label: "Giá nhập",
      type: "number",
      placeholder: "Nhập giá nhập",
      props: {
        min: 0,
      },
      rules: [{ required: true, message: "Vui lòng nhập giá nhập!" }],
    },

    {
      name: "selling_price",
      label: "Giá bán",
      type: "number",
      placeholder: "Nhập giá bán",
      props: {
        min: 0,
      },
      rules: [{ required: true, message: "Vui lòng nhập giá bán!" }],
    },

    {
      name: "stock_quantity",
      label: "Tồn kho",
      type: "number",
      placeholder: "Nhập số lượng",
      props: {
        min: 0,
      },
      rules: [{ required: true, message: "Vui lòng nhập tồn kho!" }],
    },

    {
      name: "description",
      label: "Mô tả",
      type: "textarea",
      placeholder: "Nhập mô tả thuốc",
      props: {
        rows: 3,
      },
      rules: [{ required: true, message: "Vui lòng nhập mô tả!" }],
    },

    {
      name: "image",
      label: "Ảnh thuốc",
      type: "upload",
      props: {
        listType: "picture-card",
        maxCount: 1,
      },
      rules: [{ required: true, message: "Vui lòng tải ảnh!" }],
    },
  ];

  return (
    <AppModal
      title={title}
      okText={okText}
      cancelText={cancelText}
      open={isOpen}
      onClose={onCloseModal}
      confirmLoading={loading}
      onOk={() => form.submit()}
      children={
        <MedicineForm fields={medicineFields} form={form} onSubmit={onSubmit} />
      }
    />
  );
};
