export type AddServiceParams = {
  service_name: string;
  price: number;
  description: string;
};

export type UpdateServiceParams = {
  service_id: string;
  service_name: string;
  price: number;
  description: string;
};
