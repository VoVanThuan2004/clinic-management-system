export type Medicine = {
  medicine_id: string;
  medicine_name: string;
  image: string;
  unit: string;
  original_price: number;
  selling_price: number;
  stock_quantity: number;
  description: string;
};

export type AddMedicineParams = {
  category_id: string;
  medicine_name: string;
  unit: string;
  original_price: number;
  selling_price: number;
  stock_quantity: number;
  description: string;
  fileObj: File;
  filePath: string;
}

export type UpdateMedicineParams = {
  medicine_id: string;
  category_id: string;
  medicine_name: string;
  unit: string;
  original_price: number;
  selling_price: number;
  stock_quantity: number;
  description: string;
  image: string;
  fileObj?: File;
}
