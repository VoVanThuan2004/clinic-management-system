import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { useEffect } from "react";
import type { FormField } from "../../types/form-field.type";
import { AppModal } from "../../components/AppModal";
import { EmployeeForm } from "./EmployeeForm";
import { useUpdateEmployee } from "../../hooks/employee/useUpdateEmployee";
import { message } from "antd";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  initialValues: any;
};

export const EmployeeUpdateModal = (props: Props) => {
  const { isOpen, onClose, initialValues, employeeId } = props;
  const [form] = useForm();

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({
        email: initialValues.email,
        fullname: initialValues.fullname,
        phonenumber: initialValues.phonenumber,
        gender: initialValues.gender,
        address: initialValues.address,
        date_of_birth: dayjs(initialValues.date_of_birth),
      });
    }
  }, [isOpen, initialValues]);

  // Gọi hook api cập nhật nhân viên
  const updateEmployeeMutate = useUpdateEmployee();

  const onSubmit = (values: any) => {
    updateEmployeeMutate.mutate(
      {
        id: employeeId,
        ...values,
        date_of_birth: dayjs(values.date_of_birth).format("YYYY-MM-DD"),
      },
      {
        onSuccess: () => {
          message.success("Cập nhật nhân viên thành công");
          onCancel();
        },
        onError: (error: any) => {
          if (error.message === "UPDATE_EMPLOYEE_FAILED") {
            message.error("Cập nhật nhân viên thất bại");
          }
          message.error("Có lỗi xảy ra, vui lòng thử lại");
        },
      },
    );
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
      props: {
        disabled: true,
      },
      rules: [{ required: true, message: "Vui lòng nhập email!" }],
    },
    {
      name: "fullname",
      label: "Họ và tên",
      type: "input",
      placeholder: "Nhập họ tên",
      rules: [{ required: true, message: "Vui lòng nhập họ tên!" }],
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
      title="Cập nhật nhân viên"
      open={isOpen}
      onClose={onCancel}
      okText="Cập nhật"
      cancelText="Hủy"
      confirmLoading={updateEmployeeMutate.isPending}
      onOk={() => form.submit()}
      children={
        <EmployeeForm fields={fieldsInput} onSubmit={onSubmit} form={form} />
      }
    />
  );
};
