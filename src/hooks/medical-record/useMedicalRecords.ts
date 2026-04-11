import { useQuery } from "@tanstack/react-query";
import { getMedicalRecords } from "../../services/medical-record.service";

type Props = {
  page: number;
  pageSize: number;
  search?: string;
  doctorId?: string;
  paymentStatus?: boolean | null;
}

export const useMedicalRecords = (props: Props) => {
  return useQuery({
    queryFn: () => getMedicalRecords(props),
    queryKey: ["medical-records", props],
  });
};
