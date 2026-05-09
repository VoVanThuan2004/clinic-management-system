export type MedicalServiceOption = {
  serviceId: string;
  serviceName: string;
};

export type MedicalService = {
  service_id: string;
  service_name: string;
  price: number;
};

export type MedicalServiceResponse = {
  serviceId: string;
  serviceName: string;
  price: number;
  description: string;
};

export type MedicalServiceRequest = {
  serviceName: string;
  price: number;
  description: string;
};

export type UpdateMedicalServiceRequest = {
  serviceId: string;
  serviceName: string;
  price: number;
  description: string;
};
