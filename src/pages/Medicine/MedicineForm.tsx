import { Form } from "antd";
import type { FormField } from "../../types/form-field.type";
import { renderField } from "../../utils/renderField";

type Props = {
  fields: FormField[];
  onSubmit: (values: any) => void;
  form: any;
};

export const MedicineForm = (props: Props) => {
  const { form, fields, onSubmit } = props;

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      {fields.map((field) => (
        <Form.Item
          key={field.name}
          name={field.name}
          label={field.label}
          rules={field.rules}
        >
          {renderField(field)}
        </Form.Item>
      ))}
    </Form>
  );
};
