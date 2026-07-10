/** Standard API response envelope (see CLAUDE.md — API Standard). */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export function ok<T>(data: T, status = 200): ApiResponse<T> {
  return { data, error: null, status };
}

export function fail<T = never>(
  code: string,
  message: string,
  status = 400,
  details?: Record<string, string[]>
): ApiResponse<T> {
  return { data: null, error: { code, message, details }, status };
}
