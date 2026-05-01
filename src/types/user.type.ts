export type ProfileType = {
  id: string;
  fullname: string;
  email: string;
  avatarurl: string;
  phonenumber: string;
  roles: {
    name: string;
  } | null; // Có thể null nếu join thất bại
};

export type UserProfile = {
  userId: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  gender: number;
  phoneNumber: string;
  role: string;
}
