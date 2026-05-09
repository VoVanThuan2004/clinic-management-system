export type ApiResponse<T = any> = {
  status: "success" | "error";
  code: number;
  message: string;
  data?: T;
};

export type PageResponse<T = any> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  page: number;
};
