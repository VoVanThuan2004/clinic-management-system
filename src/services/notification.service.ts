import { axiosClient } from "../api/axios-client";
import type { ApiResponse, PageResponse } from "../types/api.response";
import type { NotificationResponse } from "../types/notification.type";

export const getTotalNotificationsApi = async () => {
  const res = await axiosClient.get<ApiResponse>("/v1/notifications/total");

  return res.data;
};

// Lấy danh sách thông báo
type Props = {
  page: number;
  pageSize: number;
};
export const getAllNotificationsApi = async (props: Props) => {
  const { page, pageSize } = props;

  const res = await axiosClient.get<
    ApiResponse<PageResponse<NotificationResponse>>
  >(`/v1/notifications?page=${page}&size=${pageSize}`);
  return res.data;
};

// Đánh dấu đã đọc 1 thông báo
export const markAsReadNotificationApi = async (notificationId: string) => {
  const res = await axiosClient.put<ApiResponse>(
    `/v1/notifications/${notificationId}/read`,
  );
  return res.data;
};

// Xóa thông báo
export const deleteNotificationApi = async (notificationId: string) => {
  const res = await axiosClient.delete<ApiResponse>(
    `/v1/notifications/${notificationId}`,
  );
  return res.data;
};
