import { useEffect, useState } from "react";
import type { MedicalService } from "../../types/medical-service.type";
import { getServiceFee } from "../../services/medical-service.service";

export const useGetServiceFee = (recordId: string) => {
  const [isLoadingServiceFee, setIsLoadingServiceFee] = useState<boolean>(true);
  const [serviceFeeData, setServiceFeeData] = useState<MedicalService | null>(
    null,
  );
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchServiceFee = async () => {
      if (!recordId) return;
      setIsLoadingServiceFee(true);
      try {
        const res = await getServiceFee(recordId);
        setServiceFeeData(res.services);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoadingServiceFee(false);
      }
    };
    fetchServiceFee();
  }, [recordId]);

  return { isLoadingServiceFee, serviceFeeData, error };
};
