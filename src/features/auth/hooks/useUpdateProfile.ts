import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProfileApi } from "../api/update-profile";
import type { UserUpdate } from "../types/user.type";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: UserUpdate) => updateProfileApi(user),
    onSuccess: () => {
      // Sau khi cập nhật profile thành công, invalidate query profile để refetch lại data mới nhất
      queryClient.invalidateQueries({ queryKey: ["profile"]});
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
    }
  })
}