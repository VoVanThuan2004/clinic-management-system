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
    current: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  // Gọi hook api lấy danh sách categories
  const { data, isLoading } = useCategoriesPagination({
    page: pagination.current,
    pageSize: pagination.pageSize,
    search: debouncedSearch,
  });
  const categories = data?.data?.content || [];

  const deleteCategoryMutate = useDeleteCategory();
  const updateCategoryMutate = useUpdateCategory();

  // Gọi hook api thêm danh mục
  const addCategoryMutate = useAddCategory();

  const onAddCategory = (values: any) => {
    addCategoryMutate.mutate(values.categoryName, {
      onSuccess: (data) => {
        message.success(data.message || "Thêm danh mục thành công");
        onCloseAddModal();
      }
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
      onSuccess: (data) => {
        message.success(data.message || "Xóa danh mục thành công");
      }
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
        categoryName: values.categoryName,
      },
      {
        onSuccess: (data) => {
          message.success(data.message || "Cập nhật danh mục thành công");
          onCloseUpdateModal();
        }
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
        dataSource={categories}
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
