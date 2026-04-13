import { Form } from "antd";
import type { FormField } from "../../types/form-field.type";
import { renderField } from "../../utils/renderField";

type Props = {
  fields: FormField[];
  form: any;
  onSubmit: (values: any) => void;
};

export const ServiceForm = (props: Props) => {
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
