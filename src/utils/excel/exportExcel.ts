import * as XLSX from 'xlsx';

type Props = {
  data: any[];
  fileName: string;
  name: string;
};

export const exportExcel = (props: Props) => {
  const { data, fileName, name } = props;

  if (!data || data.length === 0) return;

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, name);

  XLSX.writeFile(workbook, fileName);
};
