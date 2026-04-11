import { useQuery } from "@tanstack/react-query";
import { getFilesByRecordId } from "../../services/file.service";

export const useGetFilesUpload = (recordId: string) => {
  return useQuery({
    queryFn: () => getFilesByRecordId(recordId),
    queryKey: ["medical-record-files", recordId],
  });
};
