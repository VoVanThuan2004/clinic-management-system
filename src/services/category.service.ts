import { axiosClient } from "../api/axios-client";
import { supabase } from "../lib/supabase";
import type { ApiResponse, PageResponse } from "../types/api.response";
import type { CategoryOption, CategoryResponse } from "../types/category.type";

type Props = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export const getCategories = async (props: Props) => {
  const { page, pageSize, search } = props;

  const queryParams: Record<string, any> = {
    page,
    size: pageSize,
  };

  if (search) queryParams.search = search;

  const res = await axiosClient.get<ApiResponse<PageResponse<CategoryResponse>>>(
    "/v1/categories",
    {
      params: queryParams
    }
  );
  return res.data;
};

export const getCategoriesOptionApi = async () => {
  const res = await axiosClient.get<ApiResponse<CategoryOption[]>>("/v1/categories/options");
  return res.data;
}

// Thêm danh mục
export const addCategory = async (categoryName: string) => {
  const res = await axiosClient.post<ApiResponse>(
    "/v1/categories",
    {
      categoryName,
    }
  );
  return res.data;
};

// Xóa danh mục
export const deleteCategory = async (categoryId: string) => {
  const res = await axiosClient.delete<ApiResponse>(
    `/v1/categories/${categoryId}`
  );
  return res.data;
};

// Cập nhật danh mục
export const updateCategory = async ({
  categoryId,
  categoryName,
}: {
  categoryId: string;
  categoryName: string;
}) => {
  const res = await axiosClient.put<ApiResponse>(
    `/v1/categories/${categoryId}`,
    {
      categoryName,
    }
  );
  return res.data;
};

export const getCategoriesOption = async (search?: string) => {
  let query = supabase
    .from("category")
    .select(
      `
      category_id,
      category_name  
    `,
    )
    .limit(15);

  if (search) {
    query = query.or(`category_name.ilike.%${search}%`);
  }

  return await query;
};
