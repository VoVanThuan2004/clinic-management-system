import { Download, Loader2 } from "lucide-react";

type Props = {
  isLoading: boolean;
  handleExport: () => Promise<void>;
};

export const ExportExcelButton = ({ isLoading, handleExport }: Props) => {
  return (
   <button
      onClick={handleExport}
      disabled={isLoading}
      className={`flex items-center gap-1.5 px-3 py-3.5 border border-blue-200 rounded-xl bg-white
        ${isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}`}
    >
      {isLoading ? (
        <Loader2 size={18} className="animate-spin text-blue-600" />
      ) : (
        <Download size={18} className="text-blue-600" />
      )}

      <p className="text-[16px] font-serif">
        {isLoading ? "Đang export..." : "Export Excel"}
      </p>
    </button>
  );
};
