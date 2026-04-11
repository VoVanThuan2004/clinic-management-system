import { Calendar, ImageIcon, Pill } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import type { PatientHistory } from "../../types/patient.type";

export const PatientHistoryList = ({
  patientHistory,
}: {
  patientHistory: PatientHistory;
}) => {
  if (!patientHistory) return;

  const {
    created_at,
    symptoms,
    diagnosis,
    files,
    prescriptions,
    notes,
    payments,
  } = patientHistory;
  const allItems = prescriptions?.prescription_items || [];
  const payment = payments?.[0] || {};

  return (
    <div className="px-6 py-5 bg-white rounded-md shadow-sm border border-gray-100 mb-6">
      {/* Header: Ngày khám & Mã hồ sơ */}
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-50">
        <div className="flex gap-2 items-center">
          <Calendar size={19} className="text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-800">
            Hồ sơ ngày {new Date(created_at).toLocaleDateString("vi-VN")}
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        {/* 1. Thông tin lâm sàng */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Triệu chứng
            </label>
            <div className="p-3 bg-gray-50 rounded-md text-gray-700 min-h-[60px] border border-gray-100">
              {symptoms || "Không có dữ liệu"}
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Chẩn đoán
            </label>
            <div className="p-3 bg-blue-50 text-blue-900 font-medium rounded-md min-h-[60px] border border-blue-100">
              {diagnosis || "Chưa có chẩn đoán"}
            </div>
          </div>
        </div>

        {/* 2. Ảnh xét nghiệm */}
        {files && files.length > 0 && (
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
              <ImageIcon size={14} /> Ảnh xét nghiệm / Kết quả
            </label>
            <div className="flex flex-wrap gap-3">
              {files.map((file, idx) => (
                <a
                  key={idx}
                  href={file.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="relative group"
                >
                  <img
                    src={file.file_url}
                    alt="Kết quả"
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200 hover:ring-2 hover:ring-blue-400 transition-all"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* 3. Đơn thuốc chi tiết */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase mb-2">
            <Pill size={14} /> Đơn thuốc
          </label>
          <div className="overflow-hidden border border-gray-100 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Tên thuốc
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                    SL
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Liều dùng
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                    Giá
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {allItems.length > 0 ? (
                  allItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-800 font-medium">
                        {item.medicine_name}
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-gray-600">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500 italic text-xs">
                        {item.dosage}
                      </td>
                      <td className="px-4 py-2 text-sm text-right text-gray-700">
                        {formatCurrency(item.price)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-4 text-center text-gray-400 text-sm"
                    >
                      Không kê đơn thuốc
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Ghi chú & Thanh toán */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-dashed border-gray-200">
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
              Ghi chú của bác sĩ
            </label>
            <p className="text-sm text-gray-600 italic">
              {notes || "Không có ghi chú thêm."}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Phí khám dịch vụ:</span>
              <span className="font-medium">
                {formatCurrency(payment.service_fee || 0)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tổng tiền thuốc:</span>
              <span className="font-medium">
                {formatCurrency(payment.total_medicine || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className="font-bold text-gray-700 uppercase text-xs">
                Tổng thanh toán:
              </span>
              <span className="text-lg font-bold text-emerald-600">
                {formatCurrency(payment.total_amount || 0)}
              </span>
            </div>
            <div className="mt-2 pt-2 text-[11px] text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>
                  Phương thức:{" "}
                  <span className="uppercase text-gray-600 font-medium">
                    {payment.payment_method || "N/A"}
                  </span>
                </span>
                <span
                  className={`font-bold ${payment.payment_status === "paid" ? "text-blue-500" : "text-orange-500"}`}
                >
                  {payment.payment_status || "N/A"}
                </span>
              </div>
              <p>
                Ngày trả:{" "}
                {payment.paid_at
                  ? formatDate(payment.paid_at)
                  : "Chưa thanh toán"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
