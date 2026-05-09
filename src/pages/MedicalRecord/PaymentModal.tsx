import { Button, Divider, Modal } from "antd";
import { BriefcaseMedical, User } from "lucide-react";
import { usePrescription } from "../../hooks/prescription/usePrescription";
import { useState } from "react";
import { Banknote, Landmark, CheckCircle2 } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  recordId: string;
  patientName: string;
  doctorName: string;
  onPayMedicalRecord: (
    serviceFee: number,
    totalMedicine: number,
    totalAmount: number,
    paymentMethod: "CASH" | "BANKING"
  ) => void;
  isLoading: boolean;
};

export const PaymentModal = (props: Props) => {
  const {
    isOpen,
    onClose,
    recordId,
    patientName,
    doctorName,
    onPayMedicalRecord,
    isLoading,
  } = props;
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "BANKING">(
    "CASH",
  );

  const { data, isLoading: loadingPrescription } = usePrescription(recordId);
  const items = data?.data?.items || [];

  const serviceName = data?.data?.serviceName || "Không xác định";
  const serviceFee = data?.data?.serviceFee || 0;

  const totalMedicine = items.reduce((accumulator, currentValue) => {
    const itemTotal = currentValue.price * currentValue.quantity;
    return accumulator + itemTotal;
  }, 0);

  const totalAmount = totalMedicine + serviceFee;

  return (
    <Modal
      open={isOpen}
      title={
        <h2 className="text-lg font-semibold">Thanh toán hóa đơn khám bệnh</h2>
      }
      centered
      onCancel={onClose}
      destroyOnClose
      loading={loadingPrescription}
      footer={[
        <Button key="back" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() =>
            onPayMedicalRecord(serviceFee, totalMedicine, totalAmount, paymentMethod)
          }
          loading={isLoading}
          disabled={isLoading}
        >
          Xác nhận thanh toán
        </Button>,
      ]}
    >
      <div className="py-2">
        {/* Thông tin chung */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div>
            <span className="text-[12px] uppercase text-gray-500 block">
              Bệnh nhân
            </span>
            <div className="flex items-center gap-2">
              <User size={18} className="text-blue-500" />
              <span className="font-semibold text-gray-800">
                {patientName || ""}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[12px] uppercase text-gray-500 block">
              Bác sĩ phụ trách
            </span>
            <div className="flex items-center gap-2">
              <BriefcaseMedical size={18} className="text-red-500" />
              <span className="font-semibold text-gray-800">
                {doctorName || ""}
              </span>
            </div>
          </div>
        </div>

        {/* Hiển thị dịch vụ đã chọn */}
        <div className="mb-6 p-4 rounded-lg border border-gray-200 bg-white shadow-sm">
          <label className="block mb-3 font-medium text-gray-700 border-b pb-2">
            Thông tin dịch vụ thực hiện:
          </label>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs italic">Tên dịch vụ</span>
              <span className="font-medium text-blue-600">{serviceName}</span>
            </div>
            <div className="text-right">
              <span className="text-gray-500 text-xs italic block">
                Phí dịch vụ
              </span>
              <span className="font-bold text-gray-800">
                {serviceFee.toLocaleString()} VND
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <label className="block mb-3 font-medium text-gray-700">
            Phương thức thanh toán
          </label>

          <div className="grid grid-cols-2 gap-4">
            {/* Cash */}
            <button
              onClick={() => setPaymentMethod("CASH")}
              className={`
        relative border rounded-2xl p-4 transition-all
        flex items-center gap-4 text-left
        hover:border-emerald-400 hover:shadow-sm
        ${
          paymentMethod === "CASH"
            ? "border-emerald-500 bg-emerald-50"
            : "border-gray-200 bg-white"
        }
      `}
            >
              {/* Selected */}
              {paymentMethod === "CASH" && (
                <CheckCircle2
                  size={18}
                  className="absolute top-3 right-3 text-emerald-600"
                />
              )}

              <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Banknote size={22} className="text-emerald-600" />
              </div>

              <div>
                <p className="font-semibold text-gray-800">Tiền mặt</p>

                <p className="text-xs text-gray-500 mt-1">
                  Thanh toán trực tiếp tại quầy
                </p>
              </div>
            </button>

            {/* Banking */}
            <button
              onClick={() => setPaymentMethod("BANKING")}
              className={`
        relative border rounded-2xl p-4 transition-all
        flex items-center gap-4 text-left
        hover:border-blue-400 hover:shadow-sm
        ${
          paymentMethod === "BANKING"
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 bg-white"
        }
      `}
            >
              {/* Selected */}
              {paymentMethod === "BANKING" && (
                <CheckCircle2
                  size={18}
                  className="absolute top-3 right-3 text-blue-600"
                />
              )}

              <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                <Landmark size={22} className="text-blue-600" />
              </div>

              <div>
                <p className="font-semibold text-gray-800">Chuyển khoản</p>

                <p className="text-xs text-gray-500 mt-1">
                  Thanh toán qua ngân hàng
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Tổng kết tiền */}
        <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
          <div className="flex justify-between mb-2">
            <p className="text-gray-600">Tiền thuốc ({items.length} mục):</p>
            <p className="font-medium text-gray-800">
              {totalMedicine.toLocaleString()} VND
            </p>
          </div>

          <div className="flex justify-between mb-2">
            <p className="text-gray-600">Phí dịch vụ khám:</p>
            <p className="font-medium text-gray-800">
              {serviceFee.toLocaleString()} VND
            </p>
          </div>

          <Divider className="my-3" />

          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold text-gray-800">Tổng cộng:</p>
            <p className="text-xl font-bold text-emerald-600">
              {totalAmount.toLocaleString()} VND
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
