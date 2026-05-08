export type Room = {
  roomId: string;
  roomName: string;
};

export type RoomResponse = {
  roomId: string;
  roomName: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UpdateRoomParams = {
  roomId: string;
  roomName: string;
};
