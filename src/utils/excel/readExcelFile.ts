import * as XLSX from 'xlsx';

type Props = {
    file: File;
    ExcelRow: any[];
}

export const readExcelFile = async ({ file, ExcelRow }: Props) => {
  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const data = XLSX.utils.sheet_to_json(worksheet, { header: ExcelRow });

  return data;
};