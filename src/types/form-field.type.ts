export type FormType =
  | "input"
  | "password"
  | "select"
  | "datepicker"
  | "textarea"
  | "number"
  | "checkbox"
  | "radio"
  | "upload";

// Dùng cho 1 field trong form, có thể input, select,...
export interface FormField {
  name: string;
  label: string;
  type: FormType;
  options?: { label: string; value: any }[]; // Dùng cho select, radio
  showSearch?: boolean;
  placeholder?: string;
  rules?: any[]; // validate field,
  props?: any; // Các props thêm cho component (DatePicker, Input,...)
}
