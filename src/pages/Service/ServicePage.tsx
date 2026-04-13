import { Input, message } from "antd";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { SearchOutlined } from "@ant-design/icons";
import { PlusIcon } from "lucide-react";
import { useServices } from "../../hooks/medical-service/useServices";
import { BaseTable } from "../../components/Table";
import { getServiceColumns } from "./get-service-columns";
import { ServiceModal } from "./ServiceModal";
import { useAddService } from "../../hooks/medical-service/useAddService";
import { useDeleteService } from "../../hooks/medical-service/useDeleteService";
import { useUpdateService } from "../../hooks/medical-service/useUpdateService";

export const ServicePage = () => {
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  // Gọi hook api lấy danh sách dịch vụ
  const { data: services, isLoading } = useServices({
    page: pagination.current,
    pageSize: pagination.pageSize,
    search: debouncedSearch,
  });

  const addServiceMutate = useAddService();
  const deleteServiceMutate = useDeleteService();
  const updateServiceMutate = useUpdateService();

  // === Add ===
  const onShowAddModal = () => {
    setIsOpenAdd(true);
  };

  const onCloseAddModal = () => {
    setIsOpenAdd(false);
  };

  const onAddService = (values: any) => {
    addServiceMutate.mutate(
      {
        service_name: values.service_name,
        price: values.price,
        description: values.description,
      },
      {
        onSuccess: () => {
          message.success("Thêm dịch vụ khám thành công");
          onCloseAddModal();
        },
        onError: () => {
          message.error("Lỗi khi thêm dịch vụ khám, vui lòng thử lại sau!");
        },
      },
    );
  };

  // === Delete ===
  const onDeleteService = (serviceId: string) => {
    if (!serviceId) return;

    deleteServiceMutate.mutate(serviceId, {
      onError: () => {
        message.error("Lỗi hệ thống khi xóa dịch vụ, vui lòng thử lại sau!");
      },
    });
  };

  // === Update ===
  const onShowUpdateModal = (
    serviceId: string,
    serviceName: string,
    price: number,
    description: string,
  ) => {
    setServiceId(serviceId);
    setServiceName(serviceName);
    setPrice(price);
    setDescription(description);
    setIsOpenUpdate(true);
  };

  const onCloseUpdateModal = () => {
    setIsOpenUpdate(false);
    setServiceId("");
    setServiceName("");
    setPrice(0);
    setDescription("");
  };

  const onUpdateService = (values: any) => {
    updateServiceMutate.mutate(
      {
        service_id: serviceId,
        service_name: values.service_name,
        price: values.price,
        description: values.description,
      },
      {
        onSuccess: () => {
          message.success("Cập nhật dịch vụ thành công");
          onCloseUpdateModal();
        },
        onError: () => {
          message.error("Lỗi khi cập nhật dịch vụ, vui lòng thử lại sau!");
        },
      },
    );
  };

  const columns = getServiceColumns({
    onEdit: onShowUpdateModal,
    onDelete: onDeleteService,
  });

  return (
    <div className="px-5 mt-5">
      <div className="flex items-center justify-between gap-3">
        {/* Ô tìm kiếm bên trái */}
        <div className="w-full sm:min-w-[200px] sm:flex-1 lg:max-w-[500px]">
          <Input
            placeholder="Tìm theo tên dịch vụ..."
            prefix={<SearchOutlined />}
            allowClear
            className="h-[42px] text-[15px] rounded-lg w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Nút thêm danh mục bên phải */}
        <button
          className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 transition py-3.5 px-3 rounded-xl cursor-pointer"
          onClick={() => onShowAddModal()}
        >
          <PlusIcon className="text-white" size={18} />
          <p className="hidden md:block text-white">Thêm dịch vụ</p>
        </button>
      </div>

      <BaseTable
        loading={
          isLoading ||
          addServiceMutate.isPending ||
          deleteServiceMutate.isPending ||
          updateServiceMutate.isPending
        }
        columns={columns}
        dataSource={services?.data || []}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: services?.count || 0,

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

      <ServiceModal
        title="Thêm dịch vụ"
        okText="Thêm"
        cancelText="Hủy"
        isOpen={isOpenAdd}
        onClose={onCloseAddModal}
        onSubmit={onAddService}
        loading={addServiceMutate.isPending}
      />

      <ServiceModal
        title="Cập nhật dịch vụ"
        okText="Cập nhật"
        cancelText="Hủy"
        isOpen={isOpenUpdate}
        onClose={onCloseUpdateModal}
        serviceId={serviceId}
        initialValues={{
          service_name: serviceName,
          price: price,
          description: description,
        }}
        onSubmit={onUpdateService}
        loading={updateServiceMutate.isPending}
      />
    </div>
  );
};
