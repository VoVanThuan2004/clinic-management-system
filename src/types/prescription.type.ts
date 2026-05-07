export type Item = {
  itemId: string;
  medicineName: string;
  price: number;
  quantity: number;
  imageUrl: string;
  dosage: string;
};

export type Prescription = {
  prescriptionId: string;
  createdAt: string;
  serviceName: string;
  serviceFee: number;
  items: Item[];
};

export type PrescriptionItemAdd = {
  prescriptionId: string;
  medicineId: string;
  quantity: number;
}