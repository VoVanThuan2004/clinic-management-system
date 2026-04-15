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
    current: 1,
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
    category_id: selectedCategory,
  });

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

    // 2. Extract file
    const fileObj = values.image?.fileList?.[0]?.originFileObj;
    const filePath = `medicines/${Date.now()}_${fileObj.name}`;

    addMedicineMutate.mutate(
      {
        category_id: values.category_id,
        medicine_name: values.medicine_name,
        unit: values.unit,
        original_price: values.original_price,
        selling_price: values.selling_price,
        stock_quantity: values.stock_quantity,
        description: values.description,
        fileObj,
        filePath,
      },
      {
        onSuccess: () => {
          message.success("Thêm thuốc thành công");
          onCloseAddModal();
        },
        onError: () => {
          message.error("Lỗi khi thêm thuốc, vui lòng thử lại!");
        },
      },
    );
  };

  const onDeleteMedicine = (medicineId: string, image: string) => {
    deleteMedicineMutate.mutate(
      {
        medicineId,
        fileUrl: image,
      },
      {
        onSuccess: () => {
          message.success("Xóa thuốc thành công!");
        },
        onError: () => {
          message.error("Lỗi khi xóa thuốc, vui lòng thử lại!");
        },
      },
    );
  };

  const onOpenUpdateModal = (values: any) => {
    setIsOpenUpdate(true);
    setMedicineUpdate(values);
    setMedicineId(values.medicine_id);
    console.log(values);
  };

  const onUpdateMedicine = (values: any) => {
    console.log("Values uploaded: ", values);

    let fileObj: File | undefined;
    let imageUrl = medicineUpdate?.image;

    if (values.image?.fileList?.[0]?.originFileObj) {
      // ảnh mới
      fileObj = values.image?.fileList?.[0]?.originFileObj;
    } else if (values.image?.[0].url) {
      // ảnh cũ
      imageUrl = values.image?.[0].url;
    }


    updateMedicineMutate.mutate(
      {
        category_id: values.category_id,
        medicine_id: medicineId,
        medicine_name: values.medicine_name,
        original_price: values.original_price,
        selling_price: values.selling_price,
        stock_quantity: values.stock_quantity,
        unit: values.unit,
        description: values.description,
        image: imageUrl as string,
        fileObj,
      },
      {
        onSuccess: () => {
          message.success("Cập nhật thuốc thành công!");
          onCloseUpdateModal();
        },
        onError: (error) => {
          console.log(error);
          message.error("Lỗi khi cập nhật thuốc, vui lòng thử lại!");
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
          addMedicineMutate.isPending || updateMedicineMutate.isPending
        }
        columns={columns}
        dataSource={data?.data || []}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: data?.count || 0,

          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],

          onChange: (page, pageSize) => {
            setPagination({
              current: page,
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
