export type ApiResponse<Result = null, ErrorDetails = string | null> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Result;
  error: ErrorDetails;
};
