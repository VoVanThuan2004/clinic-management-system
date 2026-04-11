import { useForm } from "antd/es/form/Form";
import { AppModal } from "../../components/AppModal";
import { DoctorForm } from "./DoctorForm";
import type { FormField } from "../../types/form-field.type";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useUpdateDoctor } from "../../hooks/doctor/useUpdateDoctor";
import { message } from "antd";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  doctorId: string;
  initialValues?: any;
};

export const DoctorUpdateModal = (props: Props) => {
  const { isOpen, onClose, initialValues, doctorId } = props;
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
        specialty: initialValues.doctor_details.specialty,
        experience_years: initialValues.doctor_details.experience_years,
        biography: initialValues.doctor_details.biography,
      });
    }
  }, [isOpen, initialValues]);

  // Gọi hook api cập nhật bác sĩ
  const updateDoctorMutate = useUpdateDoctor();

  const onSubmit = (values: any) => {
    updateDoctorMutate.mutate(
      {
        id: doctorId,
        ...values,
        date_of_birth: dayjs(values.date_of_birth).format("YYYY-MM-DD"),
      },
      {
        onSuccess: () => {
          message.success("Cập nhật bác sĩ thành công");
          onCancel();
        },
        onError: (error: any) => {
          if (
            error.message === "UPDATE_DOCTOR_FAILED" ||
            error.message === "UPDATE_DOCTOR_DETAILS_FAILED"
          ) {
            message.error("Cập nhật nhân viên thất bại");
          }
          message.error("Có lỗi xảy ra, vui lòng thử lại");
        },
      },
    );
  };

  const fieldsInput: FormField[] = [
    {
      name: "email",
      label: "Email",
      type: "input",
      placeholder: "Nhập email",
      rules: [{ required: true, message: "Vui lòng nhập email!" }],
      props: {
        disabled: true,
      },
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

  const onCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <AppModal
      title="Cập nhật bác sĩ"
      open={isOpen}
      onClose={onCancel}
      okText="Cập nhật"
      cancelText="Hủy"
      confirmLoading={updateDoctorMutate.isPending}
      onOk={() => form.submit()}
      children={
        <DoctorForm fields={fieldsInput} onSubmit={onSubmit} form={form} />
      }
    />
  );
};
