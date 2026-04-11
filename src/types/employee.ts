export type Employee = {
  id: string;
  fullname: string;
  email: string;
  phonenumber: string;
  gender: number;
  avatarurl: string;
  address: string;
  date_of_birth: string;
};

export type UpdateEmployeeParams = {
  id: string;
  fullname: string;
  phonenumber: string;
  gender: number;
  avatarurl: string;
  address: string;
  date_of_birth: string;
};
