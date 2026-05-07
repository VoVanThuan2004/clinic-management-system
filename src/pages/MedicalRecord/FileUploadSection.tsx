import { ExternalLink, FileText, ImageIcon, Trash2 } from "lucide-react";
import { InboxOutlined } from "@ant-design/icons";
import { Button, Empty, message, Spin, Upload } from "antd";
import {
  deleteFileRecordApi,
  uploadFileRecord,
} from "../../services/file.service";
import { useQueryClient } from "@tanstack/react-query";
import { useGetFilesUpload } from "../../hooks/medical-record/useGetFilesUpload";
import { useState } from "react";


type Props = {
  recordId: string;
  payment_status: boolean;
};

export const FileUploadSection = (props: Props) => {
  const { recordId, payment_status } = props;
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  // Gọi hook api lấy danh sách file trong medical record
  const { data, isLoading } = useGetFilesUpload(recordId);
  const files = data?.data || [];

  // 2. Logic Upload
  const handleUpload = async (file: File) => {
    setLoading(true);
    try {
      await uploadFileRecord({
        recordId,
        files: [file],
      });

      message.success("Tải lên thành công");

      queryClient.invalidateQueries({
        queryKey: ["medical-record-files", recordId],
      });
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
    return false; // Ngăn upload mặc định
  };

  const handleDelete = async (fileId: string) => {
    setLoading(true);
    try {
      const res = await deleteFileRecordApi(fileId);

      message.success(res.message);

      // Làm mới danh sách
      queryClient.invalidateQueries({
        queryKey: ["medical-record-files", recordId],
      });
    }  finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon size={20} className="text-blue-500" />
        <h2 className="text-lg font-semibold">Tài liệu đính kèm</h2>
      </div>
      <Upload.Dragger
        beforeUpload={(file) => {
          const isImage = file.type.startsWith("image/");
          if (!isImage) {
            message.error("Chỉ cho phép chọn file ảnh");
            return Upload.LIST_IGNORE;
          }
          handleUpload(file); // Gọi trực tiếp
          return false; // Ngăn upload mặc định
        }}
        showUploadList={false}
        multiple
        disabled={payment_status}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Kéo thả hoặc nhấn để tải ảnh/file</p>
        <p className="ant-upload-hint">Hỗ trợ upload nhiều file cùng lúc</p>
      </Upload.Dragger>
      <div className="flex-1 overflow-y-auto max-h-[400px]  custom-scrollbar">
        {isLoading || loading ? (
          <div className="flex justify-center py-10">
            <Spin />
          </div>
        ) : files.length === 0 ? (
          <Empty
            description="Chưa có tài liệu"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <div className="space-y-3 mt-2">
            {files.map((file) => (
              <div
                key={file.fileId}
                className="group flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  {file.fileType.includes("image") ? (
                    <img
                      src={file.fileUrl}
                      className="w-12 h-12 object-cover rounded shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded border">
                      <FileText size={22} className="text-gray-400" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[150px]">
                      {file.fileUrl.split("/").pop()}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase">
                      {file.fileType.split("/")[1]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    type="text"
                    size="small"
                    icon={<ExternalLink size={16} />}
                    onClick={() => window.open(file.fileUrl, "_blank")}
                  />
                  <Button
                    type="text"
                    size="small"
                    danger
                    disabled={payment_status}
                    icon={<Trash2 size={16} />}
                    onClick={() => handleDelete(file.fileId)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
