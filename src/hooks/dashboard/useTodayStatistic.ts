import { useEffect, useState } from "react";
import { getTodayStatistics } from "../../services/dashboard.service";
import type { TodayStatistics } from "../../types/dashboard.type";

export const useTodayStatistic = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<TodayStatistics | undefined>();

  useEffect(() => {
    const fetchTodayStatistics = async () => {
      setIsLoading(true);
      try {
        const res = await getTodayStatistics();
        setStats(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayStatistics();
  }, []);

  return { isLoading, stats }
};
