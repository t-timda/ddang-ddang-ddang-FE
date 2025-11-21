// src/hooks/report/useReport.ts
import { useMutation } from "@tanstack/react-query";
import { reportApi } from "@/apis/report/reportApi";
import type { ReportRequest } from "@/types/apis/report";

/**
 * 신고 제출 훅
 * 사용 예: 
 * const reportMutation = usePostReportMutation();
 * reportMutation.mutate({ contentId: 123, contentType: "DEFENSE", reason: "PROFANITY" });
 */
export const usePostReportMutation = () => {
  return useMutation({
    mutationFn: (body: ReportRequest) => reportApi.postReport(body),
  });
};