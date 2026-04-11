import { AppModal } from "../../components/AppModal";
import { EmployeeForm } from "./EmployeeForm";
import type { FormField } from "../../types/form-field.type";
import dayjs from "dayjs";
import { useCreateEmployee } from "../../hooks/employee/useCreateEmployee";
import { message } from "antd";
import { useForm } from "antd/es/form/Form";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const EmployeeCreateModal = (props: Props) => {
  const { isOpen, onClose } = props;
  const [form] = useForm();

  // Gọi hook api tạo nhân viên mới
  const createEmployeeMutate = useCreateEmployee();

  const onSubmit = (values: any) => {
    createEmployeeMutate.mutate(values, {
      onSuccess: () => {
        message.success("Tạo nhân viên thành công");
        onCancel();
      },
      onError: (error: any) => {
        if (error.message === "EMAIL_ALREADY_EXISTS") {
          message.error("Email đã tồn tại");
        } else if (error.message === "CREATE_USER_FAILED") {
          message.error("Tạo tài khoản thất bại");
        } else {
          message.error("Lỗi khi tạo nhân viên");
          console.log(error);
        }
      },
    });
  };

  const onCancel = () => {
    form.resetFields();
    onClose();
  };

  const fieldsInput: FormField[] = [
    {
      name: "email",
      label: "Email",
      type: "input",
      placeholder: "Nhập email",
      rules: [{ required: true, message: "Vui lòng nhập email!" }],
    },
    {
      name: "fullname",
      label: "Họ và tên",
      type: "input",
      placeholder: "Nhập họ tên",
      rules: [{ required: true, message: "Vui lòng nhập họ tên!" }],
    },

    // Mật khẩu, validate (ít nhất 8 ký tự)
    {
      name: "password",
      label: "Mật khẩu",
      type: "password",
      placeholder: "Nhập mật khẩu",
      rules: [
        { required: true, message: "Vui lòng nhập mật khẩu!" },
        { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
      ],
    },
    {
      name: "date_of_birth",
      label: "Ngày sinh",
      type: "datepicker",
      placeholder: "Chọn ngày sinh",
      rules: [{ required: true, message: "Vui lòng chọn ngày sinh!" }],
      props: {
        disabledDate: (current: any) => {
          return current && current > dayjs().endOf("day");
        },
        format: "DD/MM/YYYY",
      },
    },
    {
      name: "gender",
      label: "Giới tính",
      type: "select",
      options: [
        { label: "Nam", value: 1 },
        { label: "Nữ", value: 2 },
      ],
      placeholder: "Chọn giới tính",
      rules: [{ required: true, message: "Vui lòng chọn giới tính!" }],
    },

    // Số điện thoại (validate 10 số)
    {
      name: "phonenumber",
      label: "Số điện thoại",
      type: "input",
      placeholder: "Nhập số điện thoại",
      rules: [
        { required: true, message: "Vui lòng nhập số điện thoại!" },
        {
          pattern: /^0[0-9]{9}$/,
          message: "Số điện thoại không hợp lệ!",
        },
      ],
    },

    {
      name: "address",
      label: "Địa chỉ",
      type: "textarea",
      placeholder: "Nhập địa chỉ",
      rules: [{ required: true, message: "Vui lòng nhập địa chỉ!" }],
    },
  ];

  return (
    <AppModal
      title="Thêm nhân viên"
      open={isOpen}
      onClose={onCancel}
      okText="Thêm"
      cancelText="Hủy"
      confirmLoading={createEmployeeMutate.isPending}
      onOk={() => form.submit()}
      children={
        <EmployeeForm fields={fieldsInput} onSubmit={onSubmit} form={form} />
      }
    />
  );
};
