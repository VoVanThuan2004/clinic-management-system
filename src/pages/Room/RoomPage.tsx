import { Input, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { PlusIcon } from "lucide-react";
import { BaseTable } from "../../components/Table";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { getRoomColumns } from "./get-room-columns";
import { useRooms } from "../../hooks/room/useRooms";
import { RoomModal } from "./RoomModal";
import { useAddRoom } from "../../hooks/room/useAddRoom";
import { useUpdateRoom } from "../../hooks/room/useUpdateRoom";
import { useDeleteRoom } from "../../hooks/room/useDeleteRoom";

export const RoomPage = () => {
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");

  const [pagination, setPagination] = useState({
    current: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  // Gọi hook api lấy danh sách phòng
  const { data, isLoading } = useRooms({
    page: pagination.current,
    pageSize: pagination.pageSize,
    search: debouncedSearch,
  });

  const rooms = data?.data?.content || [];   

  // Gọi hook api thêm phòng
  const addRoomMutate = useAddRoom();

  // Gọi hook api cập nhật phòng
  const updateRoomMutate = useUpdateRoom();

  // Gọi hook api xóa phòng
  const deleteRoomMutate = useDeleteRoom();


  // === Add ===
  const onShowAddModal = () => {
    setIsOpenAdd(true);
  };

  const onCloseAddModal = () => {
    setIsOpenAdd(false);
  };

  const onAddRoom = (values: any) => {
    addRoomMutate.mutate(values.room_name, {
      onSuccess: (data) => {
        message.success(data.message);
        onCloseAddModal();
      },
    });
  };

  // === Update ===
  const onShowUpdateModal = (roomId: string, roomName: string) => {
    setRoomId(roomId);
    setRoomName(roomName);
    setIsOpenUpdate(true);

  };

  const onCloseUpdateModal = () => {
    setIsOpenUpdate(false);
    setRoomId("");
    setRoomName("");
  };

  const onUpdateRoom = (values: any) => {
    updateRoomMutate.mutate(
      {
        roomId,
        roomName: values.room_name,
      },
      {
        onSuccess: (data) => {
          message.success(data.message);
          onCloseUpdateModal();
        }
      },
    );
  };

  // === Delete ===
  const onDeleteRoom = (roomId: string) => {
    if (!roomId) return;

    deleteRoomMutate.mutate(roomId, {
      onError: () => {
        message.error("Lỗi hệ thống khi xóa phòng khám, vui lòng thử lại sau!");
      },
    });
  };

  const columns = getRoomColumns({
    onEdit: onShowUpdateModal,
    onDelete: onDeleteRoom
  });

  return (
    <div className="px-5 mt-5">
      <div className="flex items-center justify-between gap-3">
        {/* Ô tìm kiếm bên trái */}
        <div className="w-full sm:min-w-[200px] sm:flex-1 lg:max-w-[500px]">
          <Input
            placeholder="Tìm theo tên phòng..."
            prefix={<SearchOutlined />}
            allowClear
            className="h-[42px] text-[15px] rounded-lg w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Nút thêm danh mục bên phải */}
        <button
          className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 transition py-3.5 px-3 rounded-xl cursor-pointer"
          onClick={() => onShowAddModal()}
        >
          <PlusIcon className="text-white" size={18} />
          <p className="hidden md:block text-white">Thêm phòng khám</p>
        </button>
      </div>

      <BaseTable
        loading={isLoading
            || addRoomMutate.isPending
            || updateRoomMutate.isPending
            || deleteRoomMutate.isPending
        }
        columns={columns}
        dataSource={rooms}
        pagination={{
          current: pagination.current + 1,
          pageSize: pagination.pageSize,
          total: data?.data?.totalElements || 0,

          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],

          onChange: (page, pageSize) => {
            setPagination({
              current: page - 1,
              pageSize: pageSize,
            });
          },
        }}
      />

      <RoomModal
        title="Thêm phòng khám"
        okText="Thêm"
        cancelText="Hủy"
        isOpen={isOpenAdd}
        onClose={onCloseAddModal}
        onSubmit={onAddRoom}
        loading={addRoomMutate.isPending}
      />

      <RoomModal
        title="Cập nhật phòng khám"
        okText="Cập nhật"
        cancelText="Hủy"
        isOpen={isOpenUpdate}
        onClose={onCloseUpdateModal}
        roomId={roomId}
        initialValues={roomName}
        onSubmit={onUpdateRoom}
        loading={updateRoomMutate.isPending}
      />
    </div>
  );
};
