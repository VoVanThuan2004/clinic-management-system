import { useEffect, useState } from "react";
import type { MedicalServiceOption } from "../../types/medical-service.type";
import { selectMedicalService } from "../../services/medical-service.service";

export const useMedicalServiceOption = () => {
  const [isLoadingMedicalService, setIsLoadingMedicalService] = useState(false);
  const [medicalServices, setMedicalServices] = useState<
    MedicalServiceOption[] | null
  >(null);

  useEffect(() => {
    const fetchMedicalServices = async () => {
      setIsLoadingMedicalService(true);
      try {
        const res = await selectMedicalService();        

        setMedicalServices(res.data);
      } catch (error) {
        console.error("Error fetching medical services:", error);
      } finally {
        setIsLoadingMedicalService(false);
      }
    };

    fetchMedicalServices();
  }, []);

  return { isLoadingMedicalService, medicalServices };
};
