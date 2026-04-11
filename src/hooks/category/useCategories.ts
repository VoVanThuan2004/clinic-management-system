import { useEffect, useState } from "react";
import { getCategories } from "../../services/category.service";
import type { Category } from "../../types/category.type";


export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const { data } = await getCategories({});
        setCategories(data || []);
      } catch (error) {
        setError("Failed to fetch categories");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
};
