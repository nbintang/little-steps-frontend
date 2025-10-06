export interface BaseResponse {
  statusCode?: number;
  success?: boolean;
  message?: string;
  meta?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  timestamp?: string;
  path?: string;
}

export interface SuccessResponse<T = any> extends BaseResponse {
  success?: true;
  data?: T;
}
export interface SuccessResponsePaginated<T = any> extends BaseResponse {
  success?: true;
  data?: T;
  meta?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface ErrorField {
  field: string;
  message: string;
}

export interface ErrorResponse extends BaseResponse {
  success: false;
  message: string;
  errorMessages?: ErrorField[];
}
