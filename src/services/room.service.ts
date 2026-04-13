import { supabase } from "../lib/supabase";
import type { UpdateRoomParams } from "../types/room.type";

// Lấy danh sách phòng trống
export const getAllRoomsAvailable = async () => {
  return await supabase
    .from("rooms")
    .select(
      `
            room_id,
            room_name    
        `,
    )
    .eq("is_active", true);
};

// Lấy danh sách phòng quản lý bởi admin
export const getAllRooms = async ({
  page,
  pageSize,
  search,
}: {
  page: number;
  pageSize: number;
  search?: string;
}) => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  let query = supabase
    .from("rooms")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) {
    query = query.or(`room_name.ilike.%${search}%`);
  }

  return await query;
};

// Thêm phòng khám
export const addRoom = async (room_name: string) => {
  const { error } = await supabase.from("rooms").insert({
    room_name,
  });

  if (error) throw error;
};

// Cập nhật phòng khám
export const updateRoom = async (room: UpdateRoomParams) => {
  const { room_id, room_name } = room;
  const { error } = await supabase
    .from("rooms")
    .update({
      room_name,
    })
    .eq("room_id", room_id);

  if (error) throw error;
};

// Xóa phòng khám
export const deleteRoom = async (roomId: string) => {
  const { error } = await supabase.from("rooms").delete().eq("room_id", roomId);

  if (error) throw error;
};
