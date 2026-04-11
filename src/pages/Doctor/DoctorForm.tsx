import { Form } from "antd";
import { renderField } from "../../utils/renderField";
import type { FormField } from "../../types/form-field.type";

type Props = {
  fields: FormField[];
  onSubmit: (values: any) => void;
  form: any;
};

export const DoctorForm = (props: Props) => {
  const { fields, onSubmit, form } = props;
    
  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      {fields.map((field) => (
        <Form.Item
          key={field.name}
          label={field.label}
          name={field.name}
          rules={field.rules}
        >
          {renderField(field)}
        </Form.Item>
      ))}
    </Form>
  );
};