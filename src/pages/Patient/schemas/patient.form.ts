import dayjs from "dayjs";
import type { FormField } from "../../../types/form-field.type";

export const patientFields: FormField[] = [
  {
    name: "full_name",
    label: "Họ tên",
    placeholder: "Nhập họ tên",
    type: "input",
    rules: [{ required: true, message: "Vui lòng nhập họ tên" }],
  },
  {
    name: "date_of_birth",
    label: "Ngày sinh",
    placeholder: "Chọn ngày sinh",
    type: "datepicker",
    rules: [
      { required: true, message: "Vui lòng chọn ngày sinh" },
      {
        validator: (_: any, value: any) => {
          if (!value) return Promise.resolve();

          const today = dayjs().endOf("day"); // Lấy hết ngày hôm nay
          if (value.isAfter(today)) {
            return Promise.reject("Ngày sinh không hợp lệ");
          }

          return Promise.resolve();
        },
      },
    ],
    props: {
      format: "DD/MM/YYYY",
      // Khóa tất cả các ngày sau ngày hôm nay trên giao diện lịch
      disabledDate: (current: any) => {
        // Nếu ngày hiện tại trên lịch lớn hơn ngày hôm nay => Disable (true)
        return current && current.isAfter(dayjs().endOf("day"));
      },
    },
  },
  {
    name: "gender",
    label: "Giới tính",
    placeholder: "Chọn giới tính",
    type: "select",
    options: [
      { label: "Nam", value: 1 },
      { label: "Nữ", value: 0 },
    ],
    rules: [{ required: true, message: "Vui lòng chọn giới tính" }],
  },
  {
    name: "phone_number",
    label: "Số điện thoại",
    type: "number",
    placeholder: "Nhập số điện thoại",
    rules: [
      { required: true, message: "Vui lòng nhập số điện thoại" },
      {
        pattern: /^(0|\+84)[0-9]{9}$/,
        message: "Số điện thoại không hợp lệ (VD: 0901234567)",
      },
    ],
  },

  {
    name: "address",
    label: "Địa chỉ",
    type: "textarea",
    placeholder: "Nhập địa chỉ",
    rules: [
      { required: true, message: "Vui lòng nhập địa chỉ" },
      { max: 500, message: "Địa chỉ không vượt quá 500 ký tự" },
    ],
  },
];
