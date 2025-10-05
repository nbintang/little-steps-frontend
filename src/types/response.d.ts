export interface BaseResponse {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: Record<string, any>;
  timestamp?: string;
  path?: string;
}

export interface SuccessResponse<T = any> extends BaseResponse {
  success: true;
  data?: T;
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
