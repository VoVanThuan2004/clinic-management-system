export type UserUpdate = {
  id: string;
  fullname: string;
  phonenumber: string;
  avatar?: File;
  prevAvatar?: string; // ảnh cũ
};
