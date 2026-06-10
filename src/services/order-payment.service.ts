import { axiosClient } from "../api/axios-client";
import type { ApiResponse } from "../types/api.response";
import type { OrderPaymentResponse } from "../types/order-payment.type";

export const getOrderPaymentDetail = async (orderId: string) => {
  const res = await axiosClient.get<ApiResponse<OrderPaymentResponse>>(`/v1/order-payments/${orderId}`);
  return res.data;
};
