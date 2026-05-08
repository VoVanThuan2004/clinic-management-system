import { axiosClient } from "../api/axios-client";
import { supabase } from "../lib/supabase";
import type { ApiResponse, PageResponse } from "../types/api.response";
import type { Room, RoomResponse, UpdateRoomParams } from "../types/room.type";

// Lấy danh sách phòng trống
export const getAllRoomsAvailable = async () => {
  const res = await axiosClient.get<ApiResponse<Room[]>>("/v1/rooms/options");
  return res.data;
};

// Lấy danh sách phòng quản lý bởi admin
export const getAllRoomsApi = async ({
  page,
  pageSize,
  search,
}: {
  page: number;
  pageSize: number;
  search?: string;
}) => {
  const queryParams: Record<string, any> = {
    page,
    size: pageSize,
  };

  if (search) queryParams.search = search;

  const res = await axiosClient.get<ApiResponse<PageResponse<RoomResponse>>>(
    "/v1/rooms",
    { params: queryParams }
  );
  return res.data;
};

// Thêm phòng khám
export const addRoom = async (roomName: string) => {
  const res = await axiosClient.post<ApiResponse>(
    "/v1/rooms",
    {
      roomName,
    }
  );

  return res.data;
};

// Cập nhật phòng khám
export const updateRoom = async (room: UpdateRoomParams) => {
  const { roomId, roomName } = room;
  const res = await axiosClient.put<ApiResponse>(
    `/v1/rooms/${roomId}`,
    {
      roomName,
    }
  );

  return res.data;
};

// Xóa phòng khám
export const deleteRoom = async (roomId: string) => {
  const { error } = await supabase.from("rooms").delete().eq("room_id", roomId);

  if (error) throw error;
};
