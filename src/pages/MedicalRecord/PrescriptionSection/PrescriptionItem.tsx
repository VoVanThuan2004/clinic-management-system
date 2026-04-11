import { PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import type { Item } from "../../../types/prescription.type";

type Props = {
  item: Item;
  payment_status: boolean;
  onDelete: (id: string) => void;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onUpdateDosage: (itemId: string, currentDosage: string) => void;
};

export const PrescriptionItem = ({ item, payment_status, onDelete, onUpdateQuantity, onUpdateDosage }: Props) => {
  const [quantity, setQuantity] = useState<number>();
  const [dosage, setDosage] = useState(item.dosage);  


  useEffect(() => {
    if (dosage === undefined) return;

    const timeout = setTimeout(() => {
      onUpdateDosage(item.item_id, dosage);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [dosage])

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value) || 0;
    if (newQuantity < 1) {
      // Xóa thuốc
      onDelete(item.item_id);
      return;
    };
    setQuantity(newQuantity);
    onUpdateQuantity(item.item_id, newQuantity); // Gọi hàm cập nhật số lượng callback
  }

  const handleUpdateDosage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentDosage = e.target.value;
    setDosage(currentDosage);
  }
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-gray-100 shadow-sm rounded-xl mb-4 bg-white hover:border-blue-100 transition-colors">
      {/* Group: Image & Info (Luôn nằm cùng hàng để tiết kiệm diện tích) */}
      <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
        <div className="relative">
          <img
            src={item.image_url}
            alt={item.medicine_name}
            className="w-16 h-16 object-cover rounded-lg border border-gray-100"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">
            {item.medicine_name}
          </p>
          <p className="text-sm font-medium text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded mt-1">
            {Number(item.price).toLocaleString()}đ
          </p>
        </div>

        {/* Nút xóa hiện ở góc trên bên phải khi ở mobile */}
        {!payment_status && (
          <button
            onClick={() => onDelete(item.item_id)}
            className="sm:hidden p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
          >
            <PlusIcon size={20} className="rotate-45" />
          </button>
        )}
      </div>

      {/* Group: Inputs (Dưới nhau ở mobile, cùng hàng ở desktop) */}
      <div className="flex items-center gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
        {/* Quantity */}
        <div className="flex flex-col gap-1.5 flex-1 sm:flex-none">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
            SL
          </span>
          <input
            type="number"
            value={quantity ?? item.quantity}
            onChange={(e) => handleQuantityChange(e)}
            disabled={payment_status}
            className="w-full sm:w-16 h-10 border border-slate-200 rounded-lg px-2 text-center text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
          />
        </div>

        {/* Dosage */}
        <div className="flex flex-col gap-1.5 flex-[2] sm:flex-none">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
            Liều lượng
          </span>
          <input
            type="text"
            value={dosage}
            onChange={(e) => handleUpdateDosage(e)}
            disabled={payment_status}
            placeholder="Sáng 1, chiều 1..."
            className="w-full sm:w-44 h-10 border border-slate-200 rounded-lg px-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400"
          />
        </div>

        {/* Nút xóa trên Desktop */}
        {!payment_status && (
          <button
            onClick={() => onDelete(item.item_id)}
            className="hidden sm:flex items-center justify-center p-2 text-red-500 hover:bg-red-50 rounded-full transition-all ml-2 cursor-pointer"
          >
            <PlusIcon size={20} className="rotate-45" />
          </button>
        )}
      </div>
    </div>
  );
};