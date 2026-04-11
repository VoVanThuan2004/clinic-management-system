export type Doctor = {
  id: string;
  fullname: string;
  roles: {
    id: string;
    name: string;
  };
  doctor_details: {
    specialty: string;
  };
};
