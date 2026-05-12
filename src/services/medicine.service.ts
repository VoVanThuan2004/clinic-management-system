import { axiosClient } from "../api/axios-client";
import type { ApiResponse, PageResponse } from "../types/api.response";
import type {
  AddMedicineParams,
  Medicine,
  UpdateMedicineParams,
} from "../types/medicine.type";

type Props = {
  search?: string;
  category_id: string;
  page: number;
  pageSize: number;
};

export const getMedicinesByCategory = async (props: Props) => {
  const { category_id, page, pageSize, search } = props;

  const queryParams: Record<string, any> = {
    page: page,
    size: pageSize,
  };

  if (category_id !== "all") {
    queryParams.categoryId = category_id;
  }

  if (search) {
    queryParams.search = search;
  }

  const res = await axiosClient.get<ApiResponse<PageResponse<Medicine>>>(
    "/v1/medicines",
    {
      params: queryParams,
    },
  );
  return res.data;
};

// Api thêm thuốc
export const addMedicine = async (medicine: AddMedicineParams) => {
  const {
    categoryId,
    medicineName,
    unit,
    originalPrice,
    sellingPrice,
    stockQuantity,
    description,
    file,
  } = medicine;

  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify({
      categoryId: categoryId,
      medicineName: medicineName,
      originalPrice: originalPrice,
      sellingPrice: sellingPrice,
      stockQuantity: stockQuantity,
      unit: unit,
      description: description,
    })], {
      type: "application/json",
    })
  );
  formData.append("file", file);

  const res = await axiosClient.post<ApiResponse>("/v1/medicines", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const deleteMedicine = async (medicineId: string) => {
  const res = await axiosClient.delete<ApiResponse>(`/v1/medicines/${medicineId}`);
  return res.data;
};

export const updateMedicine = async (medicine: UpdateMedicineParams) => {
  const {
    medicineId,
    categoryId,
    medicineName,
    unit,
    originalPrice,
    sellingPrice,
    stockQuantity,
    description,
    file,
  } = medicine;

  const formData = new FormData();

  formData.append(
    "data",
    new Blob([JSON.stringify({
      categoryId: categoryId,
      medicineName: medicineName,
      originalPrice: originalPrice,
      sellingPrice: sellingPrice,
      stockQuantity: stockQuantity,
      unit: unit,
      description: description,
    })], {
      type: "application/json",
    })
  );

  // CHỈ append nếu có upload file mới
  if (file instanceof File) {
    formData.append("file", file);
  }

  const res = await axiosClient.put<ApiResponse>(`/v1/medicines/${medicineId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
