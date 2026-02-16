export class ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: unknown;
  timestamp: string;

  private constructor(
    success: boolean,
    message: string,
    data: T | null,
    errors?: unknown,
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
    this.timestamp = new Date().toISOString();
  }

  static ok<T>(message: string, data: T): ApiResponse<T> {
    return new ApiResponse<T>(true, message, data);
  }

  static fail(message: string, errors?: unknown): ApiResponse<null> {
    return new ApiResponse<null>(false, message, null, errors);
  }
}
