import { useQuery } from "@tanstack/react-query";
import { getProfileApi } from "../api/get-profile";

export const useProfile = ({ userId }: { userId: string }) => {
  return useQuery({
    queryFn: () => getProfileApi(userId),
    queryKey: ["profile", userId],
  });
};
