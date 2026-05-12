import { useState } from "react";
import { MedicineToolbar } from "./MedicineToolbar";
import { BaseTable } from "../../components/Table";
import { getMedicineColumns } from "./get-medicine-columns";
import { useMedicines } from "../../hooks/medicine/useMedicines";
import { useDebounce } from "use-debounce";
import { MedicineModal } from "./MedicineModal";
import { message } from "antd";
import { useAddMedicine } from "../../hooks/medicine/useAddMedicine";
import { useDeleteMedicine } from "../../hooks/medicine/useDeleteMedicine";
import type { UpdateMedicineParams } from "../../types/medicine.type";
import { useUpdateMedicine } from "../../hooks/medicine/useUpdateMedicine";

export const MedicinePage = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [pagination, setPagination] = useState({
    current: 0,
    pageSize: 10,
  });
  const [selectedCategory, setSelectedCategory] = useState("");

  // State mở modal thêm thuốc
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [medicineUpdate, setMedicineUpdate] = useState<UpdateMedicineParams>();
  const [medicineId, setMedicineId] = useState("");

  // Gọi hook api lấy danh sách thuốc theo danh mục
  const { data, isLoading } = useMedicines({
    search: debouncedSearch,
    page: pagination.current,
    pageSize: pagination.pageSize,
    category_id: selectedCategory || "all",
  });
  const medicines = data?.data?.content || [];

  // Gọi hook api thêm thuốc
  const addMedicineMutate = useAddMedicine();

  // Gọi hook api xóa thuốc
  const deleteMedicineMutate = useDeleteMedicine();

  // Gọi hook api cập nhật thuốc
  const updateMedicineMutate = useUpdateMedicine();

  const onOpenAddModal = () => {
    setIsOpenAdd(true);
  };

  const onCloseAddModal = () => {
    setIsOpenAdd(false);
  };

  const onAddMedicine = (values: any) => {
    if (Number(values.original_price) > Number(values.selling_price)) {
      message.error("Giá nhập không được lớn hơn giá bán!");
      return;
    }

    console.log(values);
    

    // 2. Extract file
    const fileObj = values.image[0]?.originFileObj;

    addMedicineMutate.mutate(
      {
        categoryId: values.categoryId,
        medicineName: values.medicineName,
        unit: values.unit,
        originalPrice: values.originalPrice,
        sellingPrice: values.sellingPrice,
        stockQuantity: values.stockQuantity,
        description: values.description,
        file: fileObj,
      },
      {
        onSuccess: (data) => {
          message.success(data.message || "Thêm thuốc thành công");
          onCloseAddModal();
        },
      },
    );
  };

  const onDeleteMedicine = (medicineId: string) => {
    deleteMedicineMutate.mutate(
      medicineId,
      {
        onSuccess: (data) => {
          message.success(data.message || "Xóa thuốc thành công!");
        }
      },
    );
  };

  const onOpenUpdateModal = (values: any) => {
    setIsOpenUpdate(true);
    setMedicineUpdate(values);
    setMedicineId(values.medicineId);
  };

  const onUpdateMedicine = (values: any) => {
    if (Number(values.originalPrice) > Number(values.sellingPrice)) {
      message.error("Giá nhập không được lớn hơn giá bán!");
      return;
    }

    const fileObj = values.image
      ? values.image[0]?.originFileObj
      : undefined;

    updateMedicineMutate.mutate(
      {
        categoryId: values.categoryId,
        medicineId: medicineId,
        medicineName: values.medicineName,
        originalPrice: values.originalPrice,
        sellingPrice: values.sellingPrice,
        stockQuantity: values.stockQuantity,
        unit: values.unit,
        description: values.description,
        file: fileObj,
      },
      {
        onSuccess: (data) => {
          message.success(data.message || "Cập nhật thuốc thành công!");
          onCloseUpdateModal();
        },
      },
    );
  };

  const onCloseUpdateModal = () => {
    setIsOpenUpdate(false);
    setMedicineUpdate(undefined);
  };

  const columns = getMedicineColumns({
    onDelete: onDeleteMedicine,
    onEdit: onOpenUpdateModal,
  });

  return (
    <div className="px-5 mt-5">
      <MedicineToolbar
        search={search}
        setSearch={setSearch}
        setSelectedCategory={setSelectedCategory}
        onOpenAddModal={onOpenAddModal}
      />

      <BaseTable
        loading={
          isLoading ||
          deleteMedicineMutate.isPending ||
          addMedicineMutate.isPending ||
          updateMedicineMutate.isPending
        }
        columns={columns}
        dataSource={medicines}
        pagination={{
          current: pagination.current + 1,
          pageSize: pagination.pageSize,
          total: data?.data?.totalElements || 0,

          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],

          onChange: (page, pageSize) => {
            setPagination({
              current: page - 1,
              pageSize: pageSize,
            });
          },
        }}
      />

      <MedicineModal
        title="Thêm thuốc"
        okText="Thêm"
        cancelText="Hủy"
        isOpen={isOpenAdd}
        onClose={onCloseAddModal}
        onSubmit={onAddMedicine}
        loading={addMedicineMutate.isPending}
      />

      <MedicineModal
        title="Cập nhật thuốc"
        okText="Cập nhật"
        cancelText="Hủy"
        isOpen={isOpenUpdate}
        onClose={onCloseUpdateModal}
        onSubmit={onUpdateMedicine}
        loading={updateMedicineMutate.isPending}
        initialValues={medicineUpdate}
      />
    </div>
  );
};
