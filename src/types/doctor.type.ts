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

export type DoctorResponse = {
  id: string;
  fullname: string;
  email: string;
  phonenumber: string;
  gender: number;
  avatarurl: string;
  address: string;
  date_of_birth: string;
  doctor_details: {
    specialty: string;
    experience_years: number;
    biography: string;
  };
};

export type CreateDoctorParams = {
  fullname: string;
  email: string;
  password: string;
  phonenumber: string;
  gender: number;
  address: string;
  date_of_birth: string;
  specialty: string;
  experience_years: number;
  biography: string;
};

export type UpdateDoctorParams = {
  id: string;
  fullname: string;
  phonenumber: string;
  gender: number;
  address: string;
  date_of_birth: string;
  specialty: string;
  experience_years: number;
  biography: string;
}
