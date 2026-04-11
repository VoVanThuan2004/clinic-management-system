import { ClipboardPlus, Pill, Plus } from "lucide-react";
import { PrescriptionItem } from "./PrescriptionItem";
import { useState } from "react";
import { MedicineModal } from "./MedicineModal";
import { usePrescription } from "../../../hooks/prescription/usePrescription";
import { useCreatePrescription } from "../../../hooks/prescription/useCreatePrescription";
import { Button, Spin } from "antd";
import { useDeletePrescriptionItem } from "../../../hooks/prescription/useDeletePrescriptionItem";
import { useUpdateQuantity } from "../../../hooks/prescription/useUpdateQuantity";
import { useUpdateDosage } from "../../../hooks/prescription/useUpdateDosage";
import { useGetServiceFee } from "../../../hooks/medical-service/useGetServiceFee";

type Props = {
  recordId: string;
  payment_status?: boolean;
};

export const PrescriptionTable = (props: Props) => {
  const { recordId, payment_status = false } = props;
  const [isOpen, setIsOpen] = useState(false);

  // Gọi hook api lấy toa thuốc của record
  const { data: prescription, isLoading } = usePrescription(recordId);
  const data = prescription?.data?.prescription_items || [];
  const prescriptionId = prescription?.data?.prescription_id;

  // Gọi hook api lấy tiền chi phí dịch vụ khám
  const { serviceFeeData } = useGetServiceFee(recordId);
  const totalServiceFee = serviceFeeData?.price || 0;
  const serviceName = serviceFeeData?.service_name;

  const medicineTotal = data.reduce((t, i) => t + i.price * i.quantity, 0);
  const grandTotal = medicineTotal + totalServiceFee;

  // Gọi hook api tạo toa thuốc
  const createPrescriptionMutation = useCreatePrescription();

  // Gọi hook api xóa thuốc ra khỏi toa
  const deletePrescriptionItemMutation = useDeletePrescriptionItem();

  // Gọi hook api cập nhật số lượng
  const updateQuantityMutation = useUpdateQuantity();

  // Gọi hook api cập nhật liều lượng
  const updateDosageMutation = useUpdateDosage();

  const onCreatePrescription = () => {
    createPrescriptionMutation.mutate(recordId);
  };

  const onDelete = (id: string) => {
    deletePrescriptionItemMutation.mutate(id);
  };

  // Hàm cập nhật số lượng item
  const onUpdateQuantity = (itemId: string, newQuantity: number) => {
    updateQuantityMutation.mutate({
      itemId,
      newQuantity,
    });
  };

  // Hàm cập nhật liều lượng thuốc (dosage)
  const onUpdateDosage = (itemId: string, currentDosage: string) => {
    updateDosageMutation.mutate({
      itemId,
      dosage: currentDosage,
    });
  };

  // Đóng modal thêm thuốc
  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative px-6 py-5 bg-white rounded-md shadow-sm min-h-[200px] flex flex-col">
      {isLoading ||
        (deletePrescriptionItemMutation.isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
            <div className="flex flex-col items-center gap-2">
              <Spin size="medium" />
            </div>
          </div>
        ))}

      {/* TRƯỜNG HỢP 1: CHƯA CÓ TOA THUỐC (Lần đầu khám) */}
      {!prescription?.data ? (
        <div className="flex-1 flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-100 rounded-lg">
          <Pill size={40} className="text-gray-200 mb-3" />
          <p className="text-gray-500 mb-4 text-sm">
            Hồ sơ này hiện chưa có toa thuốc.
          </p>
          <Button
            type="primary"
            loading={createPrescriptionMutation.isPending}
            onClick={onCreatePrescription}
          >
            Tạo toa thuốc ngay
          </Button>
        </div>
      ) : (
        /* TRƯỜNG HỢP 2: ĐÃ CÓ TOA THUỐC */
        <>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2 items-center">
              <ClipboardPlus size={19} className="text-blue-500" />
              <h2 className="text-lg font-semibold">Toa thuốc</h2>
              <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-400 uppercase">
                ID: {prescriptionId?.slice(0, 8)}
              </span>
            </div>

            {!payment_status && (
              <button
                className="flex items-center cursor-pointer hover:opacity-70 transition-all"
                onClick={() => setIsOpen(true)}
              >
                <Plus size={15} className="text-blue-500" />
                <span className="ml-1 text-[15px] text-blue-500 font-medium">
                  Thêm thuốc
                </span>
              </button>
            )}
          </div>

          {/* List Items */}
          <div className="flex-1 overflow-y-auto max-h-[350px]">
            {data.length === 0 ? (
              <div className="py-10 flex flex-col items-center">
                <p className="text-sm text-gray-400">Toa thuốc còn trống</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {data.map((item) => (
                  <PrescriptionItem
                    key={item.item_id}
                    item={item}
                    payment_status={payment_status}
                    onDelete={onDelete}
                    onUpdateQuantity={onUpdateQuantity}
                    onUpdateDosage={onUpdateDosage}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Cost breakdown */}
          <div className="mt-4 space-y-2 text-sm">
            {/* Tiền thuốc */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tiền thuốc</span>
              <span className="font-medium text-gray-800">
                {medicineTotal.toLocaleString()}
                <span className="text-xs ml-0.5 underline">đ</span>
              </span>
            </div>

            {/* Phí dịch vụ */}
            {serviceFeeData && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  Dịch vụ khám: {serviceName}
                </span>
                <span className="font-medium text-gray-800">
                  {totalServiceFee.toLocaleString()}
                  <span className="text-xs ml-0.5 underline">đ</span>
                </span>
              </div>
            )}
          </div>

          {/* Footer: Tổng tiền */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
            <span className="text-gray-400 text-sm italic">
              Ngày kê đơn:{" "}
              {new Date(
                prescription.data?.created_at as string,
              ).toLocaleDateString("vi-VN")}
            </span>

            <div className="flex items-center">
              <p className="text-lg font-bold text-gray-800">Tổng cộng:</p>
              <p className="text-2xl font-bold text-red-500 ml-2">
                {grandTotal.toLocaleString()}
                <span className="text-sm ml-0.5 text-red-400 underline">đ</span>
              </p>
            </div>
          </div>
        </>
      )}

      {/* Modal chọn thuốc - Truyền prescriptionId vào để Modal biết cần insert vào toa nào */}
      <MedicineModal
        isOpen={isOpen}
        onClose={onClose}
        prescriptionId={prescription?.data?.prescription_id as string}
      />
    </div>
  );
};
