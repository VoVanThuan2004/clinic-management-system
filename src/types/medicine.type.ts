export type Medicine = {
  categoryId: string;
  medicineId: string;
  medicineName: string;
  image: string;
  unit: string;
  originalPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  description: string;
  status: boolean;
};

export type AddMedicineParams = {
  categoryId: string;
  medicineName: string;
  unit: string;
  originalPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  description: string;
  file: File;
}

export type UpdateMedicineParams = {
  medicineId: string;
  categoryId: string;
  medicineName: string;
  unit: string;
  originalPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  description: string;
  file: File | undefined;
}
