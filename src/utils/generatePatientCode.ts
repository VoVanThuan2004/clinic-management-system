// Tạo mã BN + timestamp + random
export const generatePatientCode = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  // lấy 6 số cuối timestamp

  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `BN${timestamp}${random}`;
};
