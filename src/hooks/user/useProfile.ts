import { useEffect, useState } from "react";
import type { UserProfile } from "../../types/user.type";
import { getProfileApi } from "../../services/user.service";

export const useProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserProfile>();

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await getProfileApi();

      setUserInfo(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { isLoading, userInfo };
};
