import { Context } from "hono";
import { ApiResponse } from "@jerseyflow/types";

export function formatSuccessResponse<T>(data: T, message = "Success", meta: Record<string, any> = {}): ApiResponse<T> {
  const requestId = `req_${Math.random().toString(36).substring(2, 10)}`;
  return {
    success: true,
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
      ...meta,
    },
    errors: null,
  };
}

export function formatErrorResponse(message: string, errors: Array<{ field?: string; message: string }> | null = null): ApiResponse<null> {
  const requestId = `req_${Math.random().toString(36).substring(2, 10)}`;
  return {
    success: false,
    message,
    data: null,
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
    },
    errors: errors || [{ message }],
  };
}

export async function errorHandler(err: Error, c: Context) {
  console.error("❌ API Worker Unhandled Error:", err);
  return c.json(formatErrorResponse(err.message || "Internal Server Error"), 500);
}
