import { DatePicker, Input, Select, Upload } from "antd";
import type { FormField } from "../types/form-field.type";
import TextArea from "antd/es/input/TextArea";

export const renderField = (field: FormField) => {
  const { Option } = Select;
  if (field.type === "input") {
    return <Input placeholder={field.placeholder} {...field.props} />;
  }
  if (field.type === "password") {
    return <Input.Password placeholder={field.placeholder} {...field.props} />;
  }
  if (field.type === "number") {
    return (
      <Input type="number" placeholder={field.placeholder} {...field.props} />
    );
  }
  if (field.type === "textarea") {
    return (
      <TextArea rows={3} placeholder={field.placeholder} {...field.props} />
    );
  }
  if (field.type === "select") {
    return (
      <Select
        placeholder={field.placeholder}
        showSearch={field.showSearch}
        filterOption={false} // dùng search server
        {...field.props}
      >
        {field.options?.map((opt) => (
          <Option key={opt.value} value={opt.value}>
            {opt.label}
          </Option>
        ))}
      </Select>
    );
  }
  if (field.type === "datepicker") {
    return <DatePicker style={{ width: "100%" }} {...field.props} />;
  }

  if (field.type === "upload") {
    return (
      <Upload
        {...field.props}
        beforeUpload={() => false} // không auto upload
      >
        <div>
          <Upload />
          <div style={{ marginTop: 8 }}>Tải ảnh</div>
        </div>
      </Upload>
    );
  }
};
