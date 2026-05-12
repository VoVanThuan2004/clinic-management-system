import { Popover, Badge } from "antd";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { useNotifications } from "../hooks/notification/useNotifications";
import dayjs from "dayjs";
import { useMarkReadNotification } from "../hooks/notification/useMarkReadNotification";
import { useDeleteNotification } from "../hooks/notification/useDeleteNotification";
import { useWebSocket } from "../hooks/useWebSocket";
import { useAuthStore } from "../stores/useAuthStore";
import { useMarkReadAllNotifications } from "../hooks/notification/useMarkReadAllNotifications";

type Props = {
  totalNotifications: number;
};

export const NotificationBell = (props: Props) => {
  const { totalNotifications } = props;
  const userId = useAuthStore((state) => state.user?.userId);

  // Gọi socket
  useWebSocket(userId);

  // Gọi hook api lấy danh sách thông báo
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useNotifications();
  const notifications = data?.pages.flatMap((page) => page.data?.content) || [];

  // Gọi hook api đánh dấu đã đọc 1 thông báo
  const onMarkAsReadMutation = useMarkReadNotification();

  // Gọi hook api đánh dấu đã đọc tất cả thông báo
  const onMarkAsReadAllMutation = useMarkReadAllNotifications();

  // Gọi hook api xóa 1 thông báo
  const onDeleteNotificationMutation = useDeleteNotification();

  // Đánh dấu 1 thông báo đã đọc
  const onMarkAsRead = (notificationId: string) => {
    if (!notificationId) return;

    onMarkAsReadMutation.mutate(notificationId);
  };

  // Đánh dấu tất cả thông báo đã đọc
  const onMarkAsReadAll = () => {
    onMarkAsReadAllMutation.mutate();
  }

  const onDeleteNotification = (notificationId: string) => {
    if (!notificationId) return;

    onDeleteNotificationMutation.mutate(notificationId);
  };

  const notificationContent = (
    <div className="w-[360px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 text-[15px]">Thông báo</h3>

        <button className="text-blue-600 text-sm hover:underline cursor-pointer"
          onClick={onMarkAsReadAll}
          disabled={notifications.length === 0 || onMarkAsReadAllMutation.isPending}
        >
          Đánh dấu đã đọc tất cả
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
        {notifications.map((notification) => (
          <div
            key={notification?.notificationId}
            className={`
            group relative rounded-xl border p-4 transition-all duration-200
            hover:shadow-md cursor-pointer
            ${
              notification?.read
                ? "bg-white border-gray-200"
                : "bg-blue-50/70 border-blue-200"
            }
          `}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {/* Unread Dot */}
                {!notification?.read && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                )}

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {notification?.title}
                  </p>

                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                    {notification?.message}
                  </p>

                  <p className="text-[11px] text-gray-400 mt-3">
                    {dayjs(notification?.createdAt).format(
                      "HH:mm • DD/MM/YYYY",
                    )}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div
                className="
                opacity-0 group-hover:opacity-100
                transition flex items-center gap-2
              "
              >
                {/* Mark as read */}
                {!notification?.read && (
                  <button
                    className="
                    p-2 rounded-lg
                    hover:bg-blue-100
                    transition
                  "
                    onClick={(e) => {
                      e.stopPropagation();

                      onMarkAsRead(notification?.notificationId || "");
                    }}
                  >
                    <CheckCheck size={16} className="text-blue-600" />
                  </button>
                )}

                {/* Delete */}
                <button
                  className="
                  p-2 rounded-lg
                  hover:bg-red-100
                  transition
                "
                  onClick={(e) => {
                    e.stopPropagation();

                    onDeleteNotification(notification?.notificationId || "");
                  }}
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Load More */}
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className=" mt-3
            text-sm text-blue-600
            hover:text-blue-700 hover:underline
            transition
            disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed
          "
          >
            {isFetchingNextPage ? "Đang tải..." : "Xem tiếp"}
          </button>
        )}
      </div>

      {/* Empty */}
      {!isLoading && notifications.length === 0 && (
        <div className="py-8 text-center text-sm text-gray-400">
          Không có thông báo
        </div>
      )}
    </div>
  );

  return (
    <Popover
      content={notificationContent}
      trigger="click"
      placement="bottomRight"
      arrow={false}
    >
      <button className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition cursor-pointer">
        <Badge count={totalNotifications || 0} size="small" showZero>
          <Bell className="w-5 h-5 text-gray-600" />
        </Badge>
      </button>
    </Popover>
  );
};
