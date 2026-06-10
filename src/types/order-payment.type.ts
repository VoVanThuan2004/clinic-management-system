export type OrderPaymentResponse = {
  orderId: string;
  serviceFee: number;
  totalMedicine: number;
  totalAmount: number;
  paymentStatus: boolean;
  paymentMethod: string;
  status: string;
};
