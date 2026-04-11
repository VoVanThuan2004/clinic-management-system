import { useQuery } from "@tanstack/react-query";
import { getPrescriptionByRecordId } from "../../services/prescription.service";

export const usePrescription = (recordId: string) => {
  return useQuery({
    queryFn: () => getPrescriptionByRecordId(recordId),
    queryKey: ["prescription", recordId],
    enabled: !!recordId
  });
};
