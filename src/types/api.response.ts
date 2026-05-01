export type ApiResponse<T = void> = {
  status: "success" | "error";
  code: number;
  message: string;
  data?: T;
};

export type PageResponse<T = void> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};
