import { DatePicker, Form, Input, Modal, Select } from "antd";
import type { Patient } from "../types/patient";
import { useEffect } from "react";
import dayjs from "dayjs";
const { Option } = Select;

type Props = {
  isUpdateOpen: boolean;
  onClose: () => void;
  patient: Patient | undefined;
  onSubmit: (patient: Patient) => void;
};

export const PatientUpdateModal = (props: Props) => {
  const [form] = Form.useForm();
  // Set dữ liệu thông tin user lên form, khi mở modal
  useEffect(() => {
    if (props.patient) {
      form.setFieldsValue({
        id: props.patient.id,
        patient_code: props.patient.patient_code,
        full_name: props.patient.full_name,
        date_of_birth: props.patient.date_of_birth
          ? dayjs(props.patient.date_of_birth)
          : null,
        gender: props.patient.gender,
        phone_number: props.patient.phone_number,
        address: props.patient.address,
      });
    }
  }, [props.patient, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      props.onSubmit({
        ...values,
        date_of_birth: values.date_of_birth
          ? values.date_of_birth.format("YYYY-MM-DD")
          : null,
      });

      form.resetFields();
      props.onClose();
    });
  };

  return (
    <Modal
      title="Cập nhật bệnh nhân"
      open={props.isUpdateOpen}
      onCancel={props.onClose}
      onOk={handleOk}
      okText="Cập nhật"
      cancelText="Hủy"
      centered
    >
      <Form form={form} layout="vertical">
        {/* Họ tên */}
        <Form.Item
          label="Họ tên"
          name="full_name"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input placeholder="Nhập họ tên" />
        </Form.Item>

        {/* Ngày sinh */}
        <Form.Item
          label="Ngày sinh"
          name="date_of_birth"
          rules={[
            { required: true, message: "Vui lòng chọn ngày sinh" },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();

                const today = dayjs();
                if (value.isAfter(today)) {
                  return Promise.reject("Ngày sinh không hợp lệ");
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
        </Form.Item>

        {/* Giới tính */}
        <Form.Item label="Giới tính" name="gender">
          <Select placeholder="Chọn giới tính">
            <Option value={1}>Nam</Option>
            <Option value={2}>Nữ</Option>
          </Select>
        </Form.Item>

        {/* SĐT */}
        <Form.Item
          label="Số điện thoại"
          name="phone_number"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        {/* Địa chỉ */}
        <Form.Item label="Địa chỉ" name="address">
          <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
