import { DatePicker, Form, Input, Modal, Select } from "antd";
import dayjs from "dayjs";
import { useAddPatient } from "../hooks/useAddPatient";
import { generatePatientCode } from "../../../pages/Patient/utils/utils/generatePatientCode";
const { Option } = Select;

type Props = {
  isAddOpen: boolean;
  onClose: () => void;
};

export const PatientAddModal = (props: Props) => {
  const [form] = Form.useForm();

  const useAddPatientMutate = useAddPatient();

  const handleOk = () => {
    // Lấy dữ liệu từ form đã được validate
    form.validateFields().then((values) => {
      // 2. Truyền values vào hàm mutate của bạn
      const patient_code = generatePatientCode();
      useAddPatientMutate.mutate(
        {
          patient_code,
          ...values,
        },
        {
          onSuccess: () => {
            form.resetFields(); // Reset form sau khi thêm thành công
            props.onClose(); // Đóng modal
          },
        },
      );
    });
  };

  const handleClose = () => {
    form.resetFields();
    props.onClose();
  };

  return (
    <Modal
      title="Thêm bệnh nhân"
      open={props.isAddOpen}
      onCancel={handleClose}
      onOk={handleOk}
      okText="Thêm"
      cancelText="Hủy"
      centered
      confirmLoading={useAddPatientMutate.isPending}
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
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại" },
            {
              pattern: /^(0|\+84)[0-9]{9}$/,
              message: "Số điện thoại không hợp lệ (VD: 0901234567)",
            },
          ]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        {/* Địa chỉ */}
        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[
            { required: true, message: "Vui lòng nhập địa chỉ" },
            { max: 500, message: "Địa chỉ không vượt quá 500 ký tự" },
          ]}
        >
          <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
