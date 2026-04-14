import { useEffect, useState } from "react";
import { revenueStatistics } from "../../services/dashboard.service";
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
        const res = await revenueStatistics({
          startDate,
          endDate,
          groupBy,
        });

        // Format cho chart
        const formatted = res.map((item: any) => ({
          label: formatLabel(item.label, groupBy),
          revenue: Number(item.revenue),
        }));

        setData(formatted);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate, groupBy]);

  return { isLoading, data }
};
