import { axiosClient } from "../api/axios-client";
import type { ApiResponse } from "../types/api.response";
import type { FileRecord } from "../types/medical-record.type";

export const getFilesByRecordId = async (recordId: string) => {
  const res = await axiosClient.get<ApiResponse<FileRecord[]>>(
    `/v1/record-files/${recordId}`,
  );
  return res.data;
};

export const uploadFileRecord = async ({
  recordId,
  files,
}: {
  recordId: string;
  files: File[];
}) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const res = await axiosClient.post<ApiResponse>(
    `/v1/record-files?recordId=${recordId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return res.data;
};

export const deleteFileRecordApi = async (fileId: string) => {
  const res = await axiosClient.delete<ApiResponse>(
    `/v1/record-files/${fileId}`,
  );
  return res.data;
};
