import { useEffect, useState } from "react";
import { profitStatistics, revenueStatistics } from "../../services/dashboard.service";
import type { GroupBy } from "../../types/dashboard.type";
import { formatLabel } from "../../utils/formatLabel";

type Props = {
  startDate: string;
  endDate: string;
  groupBy: GroupBy;
};

export const useRevenueStatistics = (props: Props) => {
  const { startDate, endDate, groupBy } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!startDate || !endDate || !groupBy) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [revenueRes, profitRes] = await Promise.all([
          revenueStatistics({ startDate, endDate, groupBy }),
          profitStatistics({ startDate, endDate, groupBy }),
        ]);

        // Convert về map để lookup nhanh
        const profitMap = new Map(
          profitRes.map((item: any) => [
            formatLabel(item.period, groupBy),
            Number(item.profit),
          ])
        );

        const formatted = revenueRes.map((item: any) => {
          const label = formatLabel(item.label, groupBy);

          return {
            label,
            revenue: Number(item.revenue),
            profit: profitMap.get(label) || 0,
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
