import { supabase } from "../lib/supabase";

type Props = {
  page?: number;
  pageSize?: number;
  search?: string;
};

export const getCategories = async (props: Props) => {
  const { page, pageSize, search } = props;

  let query = supabase
    .from("category")
    .select("category_id, category_name, created_at, updated_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false });

  if (page && pageSize) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
  }

  if (search) {
    query = query.or(`category_name.ilike.%${search}%`);
  }

  return await query;
};

// Thêm danh mục
export const addCategory = async (category_name: string) => {
  return await supabase.from("category").insert(category_name);
};

// Xóa danh mục
export const deleteCategory = async (categoryId: string) => {
  // check tồn tại medicine
  const { data, error } = await supabase
    .from("medicines")
    .select("medicine_id")
    .eq("category_id", categoryId)
    .limit(1);

  if (error) {
    throw error;
  }

  // nếu có ít nhất 1 record → không cho xóa
  if (data && data.length > 0) {
    throw new Error("CATEGORY_HAS_MEDICINES");
  }

  // tiến hành xóa
  const { error: deleteError } = await supabase
    .from("category")
    .delete()
    .eq("category_id", categoryId);

  if (deleteError) {
    throw deleteError;
  }

  return true;
};

// Cập nhật danh mục
export const updateCategory = async ({
  categoryId,
  categoryName,
}: {
  categoryId: string;
  categoryName: string;
}) => {
  const { error } = await supabase
    .from("category")
    .update({
      category_name: categoryName,
    })
    .eq("category_id", categoryId);

  if (error) {
    throw error;
  }

  return true;
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
