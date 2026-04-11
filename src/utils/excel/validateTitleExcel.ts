type Props = {
  require_fields: string[];
  data: any[]; // Dữ liệu đọc được từ file excel, có thể là bất kỳ kiểu nào
};

// Hàm validate tiêu đề của file excel có khớp với các trường bắt buộc hay không
export const validateTitleExcel = ({ require_fields, data }: Props) => {
  if (!data || data.length === 0) return false;

  const keys = Object.keys(data[0]); // Lấy hàng đầu tiên gồm tên tiêu đề

  return require_fields.every((field) => keys.includes(field)); // Kiểm tra tất cả field bắt buộc có khớp với data
};
