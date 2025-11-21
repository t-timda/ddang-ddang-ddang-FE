// dev/src/types/apis/notification.ts
export type NotificationType = 
  | "PARTY_JOINED"      // 파티 모드 입장
  | "DEFENSE_REPLIED"   // 내 변론에 반론
  | "REBUTTAL_REPLIED"  // 내 반론에 대댓글
  | "JUDGMENT_COMPLETE" // 최종 판결 완료
  | "JUDGMENT_ERROR";   // 판결 실패

export interface NotificationData {
  type: NotificationType;
  message: string;
  caseId?: number;
  defenseId?: number;
  rebuttalId?: number;
  judgmentId?: number;
  timestamp: number;
}