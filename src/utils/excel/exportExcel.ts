import * as XLSX from 'xlsx';

type Props = {
  data: any[];
  fileName: string;
  name: string;
};

export const exportExcel = (props: Props) => {
  const { data, fileName, name } = props;

  if (!data || data.length === 0) return;

//   const mappingData = data.map((p) => ({
//     "Email": p.email,
//     "Họ tên": p.full_name,
//     "Giới tính": p.gender === 1 ? "Nam" : "Nữ",
//     "Ngày sinh": formatDate(p.date_of_birth),
//     "SĐT": p.phone_number,
//     "Địa chỉ": p.address,
//   }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, name);

  XLSX.writeFile(workbook, fileName);
};
