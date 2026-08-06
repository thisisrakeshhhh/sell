export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  meta: {
    timestamp: string;
    requestId?: string;
  };
  errors: Array<{ field?: string; message: string }> | null;
}
