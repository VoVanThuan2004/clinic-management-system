import { useState } from "react";
import { BaseTable } from "../../components/Table";
import { CategoryToolbar } from "./CategoryToolbar";
import { getCategoriesColumns } from "./get-categories-columns";
import { useDebounce } from "use-debounce";
import { CategoryModal } from "./CategoryModal";
import { useCategoriesPagination } from "../../hooks/category/useCategoriesPagination";
import { useDeleteCategory } from "../../hooks/category/useDeleteCategory";
import { message } from "antd";
import { useUpdateCategory } from "../../hooks/category/useUpdateCategory";
import { useAddCategory } from "../../hooks/category/useAddCategory";

export const CategoryPage = () => {
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  // Gọi hook api lấy danh sách categories
  const { data: categories, isLoading } = useCategoriesPagination({
    page: pagination.current,
    pageSize: pagination.pageSize,
    search: debouncedSearch,
  });

  const deleteCategoryMutate = useDeleteCategory();
  const updateCategoryMutate = useUpdateCategory();

  // Gọi hook api thêm danh mục
  const addCategoryMutate = useAddCategory();

  const onAddCategory = (values: any) => {
    addCategoryMutate.mutate(values, {
      onSuccess: () => {
        message.success("Thêm danh mục thành công");
        onCloseAddModal();
      },
      onError: () => {
        message.error("Lỗi khi thêm danh mục");
      },
    });
  };

  const onShowAddModal = () => {
    setIsOpenAdd(true);
  };

  const onCloseAddModal = () => {
    setIsOpenAdd(false);
  };

  const onDeleteCategory = (categoryId: string) => {
    deleteCategoryMutate.mutate(categoryId, {
      onError: (error: any) => {
        if (error.message === "CATEGORY_HAS_MEDICINES") {
          message.error("Danh mục đang có thuốc tồn tại, không thể xóa!");
        } else {
          message.error("Lỗi hệ thống khi xóa danh mục");
        }
      },
    });
  };

  const onShowUpdateModal = (categoryId: string, categoryName: string) => {
    setCategoryId(categoryId);
    setCategoryName(categoryName);
    setIsOpenUpdate(true);
  };

  const onCloseUpdateModal = () => {
    setIsOpenUpdate(false);
    setCategoryId("");
    setCategoryName("");
  };

  const onUpdateCategory = (values: any) => {
    updateCategoryMutate.mutate(
      {
        categoryId,
        categoryName: values.category_name,
      },
      {
        onSuccess: () => {
          message.success("Cập nhật danh mục thành công");
          onCloseUpdateModal();
        },
        onError: () => {
          message.error("Lỗi khi cập nhật danh mục");
        },
      },
    );
  };

  const columns = getCategoriesColumns({
    onDelete: onDeleteCategory,
    onEdit: onShowUpdateModal,
  });

  return (
    <div className="px-5 mt-5">
      <CategoryToolbar
        search={search}
        setSearch={setSearch}
        onShowAddModal={onShowAddModal}
      />

      <BaseTable
        loading={
          isLoading ||
          deleteCategoryMutate.isPending ||
          updateCategoryMutate.isPending
        }
        columns={columns}
        dataSource={categories?.data || []}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: categories?.count || 0,

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

      <CategoryModal
        title="Thêm danh mục"
        okText="Thêm"
        cancelText="Hủy"
        isOpen={isOpenAdd}
        onClose={onCloseAddModal}
        onSubmit={onAddCategory}
        loading={addCategoryMutate.isPending}
      />

      <CategoryModal
        title="Cập nhật danh mục"
        okText="Cập nhật"
        cancelText="Hủy"
        isOpen={isOpenUpdate}
        onClose={onCloseUpdateModal}
        categoryId={categoryId}
        initialValues={categoryName}
        onSubmit={onUpdateCategory}
        loading={updateCategoryMutate.isPending}
      />
    </div>
  );
};
