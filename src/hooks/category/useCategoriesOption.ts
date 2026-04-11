import { useEffect, useState } from "react";
import { getCategoriesOption } from "../../services/category.service";
import type { CategoryOption } from "../../types/category.type";

type Props = {
  search?: string;
};

export const useCategoriesOption = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  const { search } = props;

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const res = await getCategoriesOption(search);

        setCategories(res.data as CategoryOption[]);
      } catch (error) {
        console.log(error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [search]);

  return { isLoading, categories };
};
