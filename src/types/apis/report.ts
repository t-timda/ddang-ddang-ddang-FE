// src/types/apis/report.ts
export type ReportContentType = "DEFENSE" | "REBUTTAL";

export type ReportReason =
  | "PROFANITY"      // 욕설/비하 발언
  | "SLANDER"        // 인신공격/명예훼손
  | "SPAM"           // 도배/스팸
  | "ADVERTISEMENT"  // 상업적 광고
  | "OBSCENE"        // 음란성/부적절한 홍보
  | "OTHER";         // 기타

export interface ReportRequest {
  contentId: number;
  contentType: ReportContentType;
  reason: ReportReason;
  customReason?: string;
}

export interface ReportResponse {
  reportId?: number;
}