import { useEffect, useState } from "react";
import { getAllRoomsAvailable } from "../../services/room.service";
import type { Room } from "../../types/room.type";

export const useRoomOption = () => {
  const [isLoadingRoom, setIsLoadingRoom] = useState(false);
  const [rooms, setRooms] = useState<Room[] | null>(null);

  useEffect(() => {
    const fetchRoomAvailable = async () => {
      try {
        const res = await getAllRoomsAvailable();

        setRooms(res.data ?? null);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingRoom(false);
      }
    };

    fetchRoomAvailable();
  }, []);

  return { isLoadingRoom, rooms };
};
