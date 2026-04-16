import { useEffect, useState } from "react";
import { getTotalMedicalRecord } from "../../services/medical-record.service";

export const useTotalMedicalRecords = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const fetchTotalMedicalRecords = async () => {
      setIsLoading(true);
      try {
        const count = await getTotalMedicalRecord();

        setTotal(count);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalMedicalRecords();
  }, []);

  return { isLoading, total };
};
