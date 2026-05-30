import { useEffect, useState } from "react";
import { getRevenueAndProfitStatistics } from "../../services/dashboard.service";
import type { GroupBy, RevenueAndProfitStatsDTO } from "../../types/dashboard.type";
import { formatLabel } from "../../utils/formatLabel";

type Props = {
  startDate: string;
  endDate: string;
  groupBy: GroupBy;
};

export const useRevenueAndProfitStat = (props: Props) => {
  const { startDate, endDate, groupBy } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!startDate || !endDate || !groupBy) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getRevenueAndProfitStatistics(props);

        const data = res.data || [];
        const formatted = data.map((item: RevenueAndProfitStatsDTO) => {
          const label = formatLabel(item.label, groupBy);

          return {
            label,
            revenue: Number(item.revenue),
            profit: Number(item.profit)
          };
        });

        setData(formatted);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, groupBy]);

  return { isLoading, data };
};
