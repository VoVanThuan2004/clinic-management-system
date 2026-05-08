export type Doctor = {
  id: string | null;
  fullname: string;
  roles: {
    id: string;
    name: string;
  };
  doctor_details: {
    specialty: string;
  };
};

export type DoctorOption = {
  doctorId: string;
  doctorName: string;
  specialty: string;
}

export type DoctorResponse = {
  doctorId: string;
  doctorName: string;
  email: string;
  phoneNumber: string;
  gender: number;
  avatarUrl: string;
  dateOfBirth: string;
  doctorDetailResponse: {
    specialty: string;
    experienceYears: number;
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
