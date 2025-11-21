// src/types/apis/report.ts
export type ReportContentType = "DEFENSE" | "REBUTTAL";

export type ReportReason = 
  | "PROFANITY"      // 욕설
  | "SPAM"           // 스팸
  | "HARASSMENT"     // 괴롭힘
  | "INAPPROPRIATE"  // 부적절한 콘텐츠
  | "OTHER";         // 기타

export interface ReportRequest {
  contentId: number;
  contentType: ReportContentType;
  reason: ReportReason;
  customReason?: string;
  content?: string; // 신고 대상 콘텐츠 내용 추가
}

export interface ReportResponse {
  reportId?: number;
}