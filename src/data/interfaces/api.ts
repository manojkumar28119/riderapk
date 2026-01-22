import type { AxiosError } from "axios";

export interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
  response?:{
    data?: {
      message?: string;
    }
  }
}

// helper type alias (optional)
export type AxiosApiError = AxiosError<ApiError>;
