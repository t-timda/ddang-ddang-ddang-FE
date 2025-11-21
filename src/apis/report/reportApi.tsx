// src/apis/report/reportApi.ts
import instance from "@/apis/instance";
import type { ApiResponse } from "@/types/common/api";
import type { ReportRequest, ReportResponse } from "@/types/apis/report";

/**
 * 신고 제출
 * POST /api/v1/reports
 */
const postReport = async (body: ReportRequest): Promise<ApiResponse<ReportResponse>> => {
  const { data } = await instance.post<ApiResponse<ReportResponse>>(
    `/api/v1/reports`,
    body,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken") ?? ""}`,
      },
      withCredentials: true,
    }
  );
  return data;
};

export const reportApi = {
  postReport,
} as const;

export type ReportApi = typeof reportApi;