import { useEffect, useState } from "react";
import type { MedicalRecordDetail } from "../../types/medical-record.type";
import { getMedicalRecordDetails } from "../../services/medical-record.service";

export const useMedicalRecordDetails = (recordId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecordDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicalRecordDetails = async () => {
      if (!recordId) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await getMedicalRecordDetails(recordId);
        setMedicalRecord(data);
      } catch (error) {
        setError("Failed to fetch medical record details");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicalRecordDetails();
  }, [recordId]);

  return { medicalRecord, isLoading, error };
};
