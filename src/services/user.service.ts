import { axiosClient } from "../api/axios-client";
import type { ApiResponse } from "../types/api.response";
import type { UserProfile } from "../types/user.type";

export const getProfileApi = async () => {
  const res = await axiosClient.get<ApiResponse<UserProfile>>(
    `/v1/users`,
  );

  return res.data;
};
