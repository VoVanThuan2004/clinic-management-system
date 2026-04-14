import { useEffect, useState } from "react";
import { getTopMedicines } from "../../services/dashboard.service";

export const useTopMedicines = (startDate: string, endDate: string) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getTopMedicines(startDate, endDate);

        // tính % cho UI
        const max = res[0]?.total_quantity || 1;

        const formatted = res.map((item: any) => ({
          name: item.medicine_name,
          value: item.total_quantity,
          percent: (item.total_quantity / max) * 100,
        }));

        setData(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  return { data, isLoading };
};
