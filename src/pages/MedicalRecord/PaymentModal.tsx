import { Button, Divider, Modal } from "antd";
import { BriefcaseMedical, User } from "lucide-react";
import { usePrescription } from "../../hooks/prescription/usePrescription";
import { useGetServiceFee } from "../../hooks/medical-service/useGetServiceFee";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  recordId: string;
  patientName: string;
  doctorName: string;
  onPayMedicalRecord: (
    consultantFee: number,
    total_medicine: number,
    total_amount: number,
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

  const { data, isLoading: loadingPrescription } = usePrescription(recordId);
  const items = data?.data?.prescription_items || [];

  // Hook api lấy thông phí dịch vụ
  const { serviceFeeData, isLoadingServiceFee } = useGetServiceFee(recordId);
  
  // Dựa vào cấu trúc dữ liệu trả về đã phân tích ở câu trước:
  const serviceName = serviceFeeData?.service_name || "Không xác định";
  const serviceFee = serviceFeeData?.price || 0;  

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
      onCancel={onClose}
      destroyOnClose
      loading={loadingPrescription || isLoadingServiceFee}
      footer={[
        <Button key="back" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() =>
            onPayMedicalRecord(serviceFee, totalMedicine, totalAmount)
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
              <span className="font-semibold text-gray-800">{patientName || ""}</span>
            </div>
          </div>

          <div>
            <span className="text-[12px] uppercase text-gray-500 block">
              Bác sĩ phụ trách
            </span>
            <div className="flex items-center gap-2">
              <BriefcaseMedical size={18} className="text-red-500" />
              <span className="font-semibold text-gray-800">{doctorName || ""}</span>
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
              <span className="text-gray-500 text-xs italic block">Phí dịch vụ</span>
              <span className="font-bold text-gray-800">{serviceFee.toLocaleString()} VND</span>
            </div>
          </div>
        </div>

        {/* Tổng kết tiền */}
        <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
          <div className="flex justify-between mb-2">
            <p className="text-gray-600">Tiền thuốc ({items.length} mục):</p>
            <p className="font-medium text-gray-800">{totalMedicine.toLocaleString()} VND</p>
          </div>

          <div className="flex justify-between mb-2">
            <p className="text-gray-600">Phí dịch vụ khám:</p>
            <p className="font-medium text-gray-800">{serviceFee.toLocaleString()} VND</p>
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
