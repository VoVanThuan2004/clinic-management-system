import { useEffect, useState } from "react";
import { profitStatistics } from "../../services/dashboard.service";
import { formatLabel } from "../../utils/formatLabel";
import type { GroupBy } from "../../types/dashboard.type";

type Props = {
  startDate: string;
  endDate: string;
  groupBy: GroupBy;
};

export const useProfitStatistics = (props: Props) => {
  const { startDate, endDate, groupBy } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!startDate || !endDate || !groupBy) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await profitStatistics({
          startDate,
          endDate,
          groupBy,
        });

        const formatted = res.map((item: any) => ({
          label: formatLabel(item.period, groupBy),
          profit: Number(item.profit),
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

  return { isLoading, data };
};