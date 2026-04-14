import { useEffect, useState } from "react";
import { getTodayStatistics } from "../../services/dashboard.service";

export const useTodayStatistic = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ totalRevenue: 0, totalPatients: 0 });

  useEffect(() => {
    const fetchTodayStatistics = async () => {
      setIsLoading(true);
      try {
        const data = await getTodayStatistics();
        setStats(data);
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
