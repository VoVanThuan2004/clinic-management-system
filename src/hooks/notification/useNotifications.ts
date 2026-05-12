import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllNotificationsApi } from "../../services/notification.service";

export const useNotifications = () => {
  return useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam = 0 }) =>
      getAllNotificationsApi({
        page: pageParam,
        pageSize: 5,
      }),

    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      if (lastPage.data?.last) {
        return undefined;
      }

      return (lastPage.data?.number as number) + 1;
    },
  });
};
