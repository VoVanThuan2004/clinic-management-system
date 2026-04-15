import { Plus } from "lucide-react";
import { useState } from "react";
import type { Medicine } from "../../../types/medicine.type";
import { useAddPrescriptionItem } from "../../../hooks/prescription/useAddPrescriptionItem";

type Props = {
  medicine: Medicine;
  prescriptionId: string;
};
export const MedicineItem = (props: Props) => {
  const { medicine, prescriptionId } = props;
  const [quantity, setQuantity] = useState<number>(1);

  // Gọi hook api thêm thuốc vào toa
  const addPrescriptionItemMutation = useAddPrescriptionItem();

  const onAddMedicineToPrescription = (medicine: Medicine) => {
    addPrescriptionItemMutation.mutate({
      prescription_id: prescriptionId,
      medicine_id: medicine.medicine_id,
      medicine_name: medicine.medicine_name,
      image_url: medicine.image,
      price: medicine.selling_price,
      quantity: quantity,
      dosage: "",
    });
  };

  const onChangeQuantity = (value: number) => {
    if (value < 1) {
      return;
    }
    setQuantity(value);
  };

  const isOutOfStock = medicine.status === false;

  return (
    <div className="relative flex flex-col px-3 py-2 bg-gray-50 rounded-sm shadow-md">
      {/* Overlay hết hàng */}
      {isOutOfStock && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/75 backdrop-blur-sm text-sm font-semibold text-red-600">
          Đã hết hàng
        </div>
      )}

      {/* Ảnh thuốc */}
      <div className="relative overflow-hidden rounded-sm">
        <img
          src={medicine.image}
          alt="Thuốc"
          className="w-full h-42 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Tên thuốc */}
      <h3 className="text-[17px] font-medium mt-2">{medicine.medicine_name}</h3>

      {/* Giá + tồn kho */}
      <div className="flex justify-between items-center mt-2">
        <span className="text-lg font-bold text-blue-600">
          {medicine.selling_price}đ
        </span>
        <span className="text-sm text-gray-500">
          Tồn kho: {medicine.stock_quantity} viên
        </span>
      </div>

      {/* Input số lượng và nút thêm vào toa */}
      <div className="mt-4 pt-3 border-t border-dashed border-gray-100 flex items-center gap-3">
        {/* Input chọn số lượng nhanh */}
        <div className="flex-1">
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => onChangeQuantity(Number(e.target.value))}
            className={`w-full h-9 border border-gray-200 rounded-lg text-center text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${isOutOfStock ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-900"}`}
            placeholder="SL"
            disabled={isOutOfStock}
          />
        </div>

        {/* Nút Plus để Add vào toa */}
        <button
          className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors shadow-sm ${isOutOfStock ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none" : "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-200 active:scale-95 cursor-pointer"}`}
          title="Thêm vào toa thuốc"
          disabled={isOutOfStock || addPrescriptionItemMutation.isPending}
          onClick={() => onAddMedicineToPrescription(medicine)}
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};
