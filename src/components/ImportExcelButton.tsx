import {  Upload } from "antd";
import { FileUp, Loader2 } from "lucide-react";

type Props = {
  isLoading: boolean;
  handleImport: (file: File) => void;
};

export const ImportExcelButton = ({ isLoading, handleImport }: Props) => {
  return (
    <Upload
      accept=".xlsx, .xls"
      showUploadList={false}
      disabled={isLoading}
      beforeUpload={(file) => {
        handleImport(file);
        return false;
      }}
    >
      <button
        disabled={isLoading}
        className={`flex items-center gap-1.5 px-3 py-3.5 border border-blue-200 rounded-xl bg-white
        ${isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}`}
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin text-green-600" />
        ) : (
          <FileUp size={18} className="text-green-600" />
        )}

        <p className="text-[16px] font-serif">
          {isLoading ? "Đang import..." : "Import Excel"}
        </p>
      </button>
    </Upload>
  );
};
