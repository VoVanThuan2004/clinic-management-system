import dayjs from "dayjs";
import { AppModal } from "../../components/AppModal";
import type { FormField } from "../../types/form-field.type";
import { DoctorForm } from "./DoctorForm";
import { useForm } from "antd/es/form/Form";
import { useCreateDoctor } from "../../hooks/doctor/useCreateDoctor";
import { message } from "antd";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const DoctorCreateModal = (props: Props) => {
  const { isOpen, onClose } = props;
  const [form] = useForm();

  // Gọi hook api tạo bác sĩ mới
  const createDoctorMutate = useCreateDoctor();

  const onSubmit = (values: any) => {
    // Gọi API tạo bác sĩ mới
    // console.log(createDoctorMutate.isPending);

    // console.log(values);
    createDoctorMutate.mutate(values, {
      onSuccess: () => {
        message.success("Tạo bác sĩ thành công");
        onCancel();
      },
      onError: (error: any) => {
        if (error.message === "EMAIL_ALREADY_EXISTS") {
          message.error("Email đã tồn tại");
        } else if (error.message === "CREATE_PROFILE_FAILED" || error.message === "CREATE_DOCTOR_DETAILS_FAILED") {
          message.error("Tạo tài khoản thất bại");
        } else {
          message.error("Lỗi khi tạo nhân viên");
          console.log(error);
        }
      },
    });
  };

  const onCancel = () => {
    onClose();
    form.resetFields();
  };

  const fieldsInput: FormField[] = [
    {
      name: "email",
      label: "Email",
      type: "input",
      placeholder: "Nhập email",
      rules: [
        { required: true, message: "Vui lòng nhập email!" },
        {
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Email không hợp lệ!",
        },
      ],
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
        { label: "Nữ", value: 0 },
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

    {
      name: "specialty",
      label: "Chuyên khoa",
      type: "input",
      placeholder: "Nhập chuyên khoa",
      rules: [{ required: true, message: "Vui lòng nhập chuyên khoa!" }],
    },
    {
      name: "experience_years",
      label: "Năm kinh nghiệm",
      type: "number",
      placeholder: "Nhập năm kinh nghiệm",
      rules: [{ required: true, message: "Vui lòng nhập năm kinh nghiệm!" }],
    },
    {
      name: "biography",
      label: "Tiểu sử",
      type: "textarea",
      placeholder: "Nhập tiểu sử",
      rules: [{ required: true, message: "Vui lòng nhập tiểu sử!" }],
    },
  ];

  return (
    <AppModal
      title="Thêm bác sĩ"
      open={isOpen}
      onClose={onCancel}
      okText="Thêm"
      cancelText="Hủy"
      onOk={() => form.submit()}
      confirmLoading={createDoctorMutate.isPending}
      children={
        <DoctorForm fields={fieldsInput} onSubmit={onSubmit} form={form} />
      }
    />
  );
};
