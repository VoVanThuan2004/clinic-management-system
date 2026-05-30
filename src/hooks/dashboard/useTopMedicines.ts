import { useEffect, useState } from "react";
import { getTopMedicines } from "../../services/dashboard.service";
import type { TopMedicineDTO } from "../../types/dashboard.type";

export const useTopMedicines = (startDate: string, endDate: string) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getTopMedicines(startDate, endDate);
        const data = res.data || [];

        // tính % cho UI
        const max = data[0]?.totalSold || 1;

        const formatted = data.map((item: TopMedicineDTO) => ({
          name: item.medicineName,
          value: item.totalSold,
          percent: (item.totalSold / max) * 100,
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
