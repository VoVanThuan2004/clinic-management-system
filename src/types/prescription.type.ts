export type Item = {
  item_id: string;
  prescription_id: number;
  medicine_id: number;
  medicine_name: string;
  price: number;
  quantity: number;
  image_url: string;
  dosage: string;
  created_at: string;
};

export type Prescription = {
  prescription_id: string;
  record_id: number;
  created_at: string;
  prescription_items: Item[];
};

export type PrescriptionItemAdd = {
  prescription_id: string;
  medicine_id: string;
  medicine_name: string;
  price: number;
  quantity: number;
  dosage: string;
  image_url: string;
}