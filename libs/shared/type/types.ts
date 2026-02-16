export interface AshiaErrorPayload {
  errorCode: string;
  message: string;
  details?: unknown;
}
export interface PrismaErrorMeta {
  target?: string | string[];
}
export interface HttpExceptionPayload {
  message?: string | string[];
}

export type ValidationErrorItem = {
  message: string;
};
