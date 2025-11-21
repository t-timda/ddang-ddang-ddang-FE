// dev/src/hooks/notification/useSSE.ts
import { useEffect, useRef } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import type { NotificationData, NotificationType } from "@/types/apis/notification";

const SSE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/notifications/subscribe`;

export const useSSE = () => {
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const accessToken = useAuthStore(state => state.accessToken);
  const isLogin = useAuthStore(state => state.isLogin);

  useEffect(() => {
    if (!isLogin || !accessToken) {
      return;
    }

    const connectSSE = () => {
      const token = accessToken;
      
      // JWT 토큰 만료 확인
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        const expired = payload.exp < now;
        
        if (expired) {
          console.error("[SSE] 토큰이 만료되었습니다.");
          return;
        }
      } catch (e) {
        console.error("[SSE] 토큰 파싱 실패:", e);
        return;
      }

      // 기존 연결 정리
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      try {
        const eventSource = new EventSourcePolyfill(SSE_URL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          heartbeatTimeout: 120000,
        });

        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          console.log("[SSE] 연결 성공");
        };

        eventSource.onmessage = (e: any) => {
          const { addNotification, showToast } = useNotificationStore.getState();
          
          try {
            const data = JSON.parse(e.data);

            const notification: NotificationData = {
              type: data.type || detectNotificationType(data.message),
              message: data.message,
              caseId: data.caseId,
              defenseId: data.defenseId,
              rebuttalId: data.rebuttalId,
              judgmentId: data.judgmentId,
              profileImageUrl: data.profileImageUrl,
              authorNickname: data.authorNickname,
              timestamp: Date.now(),
            };

            addNotification(notification);
            showToast(notification);
          } catch (error) {
            const notification: NotificationData = {
              type: detectNotificationType(e.data),
              message: e.data,
              timestamp: Date.now(),
            };

            addNotification(notification);
            showToast(notification);
          }
        };

        eventSource.addEventListener("connect", () => {
          console.log("[SSE] 서버 연결 확인");
        });

        eventSource.addEventListener("notification", (e: any) => {
          const { addNotification, showToast } = useNotificationStore.getState();
          
          try {
            const data = JSON.parse(e.data);

            const notification: NotificationData = {
              type: data.type || detectNotificationType(data.message),
              message: data.message,
              caseId: data.caseId,
              defenseId: data.defenseId,
              rebuttalId: data.rebuttalId,
              judgmentId: data.judgmentId,
              profileImageUrl: data.profileImageUrl,
              authorNickname: data.authorNickname,
              timestamp: Date.now(),
            };

            addNotification(notification);
            showToast(notification);
          } catch (error) {
            const notification: NotificationData = {
              type: detectNotificationType(e.data),
              message: e.data,
              timestamp: Date.now(),
            };

            addNotification(notification);
            showToast(notification);
          }
        });

        eventSource.addEventListener("judgment_complete", (e: any) => {
          const { addNotification, showToast } = useNotificationStore.getState();
          
          try {
            const data = JSON.parse(e.data);

            const notification: NotificationData = {
              type: "JUDGMENT_COMPLETE",
              message: data.message || "최종 판결이 완료되었습니다.",
              judgmentId: data.judgmentId || Number(e.data),
              caseId: data.caseId,
              timestamp: Date.now(),
            };

            addNotification(notification);
            showToast(notification);
          } catch (error) {
            const notification: NotificationData = {
              type: "JUDGMENT_COMPLETE",
              message: "최종 판결이 완료되었습니다.",
              judgmentId: Number(e.data),
              timestamp: Date.now(),
            };

            addNotification(notification);
            showToast(notification);
          }
        });

        eventSource.addEventListener("judgment_error", (e: any) => {
          console.error("[SSE] 판결 오류:", e.data);
          
          const { addNotification, showToast } = useNotificationStore.getState();

          const notification: NotificationData = {
            type: "JUDGMENT_ERROR",
            message: e.data || "판결 생성 중 오류가 발생했습니다.",
            timestamp: Date.now(),
          };

          addNotification(notification);
          showToast(notification);
        });

        eventSource.onerror = () => {
          console.error("[SSE] 연결 오류 발생");
          
          eventSource.close();
          eventSourceRef.current = null;

          const currentIsLogin = useAuthStore.getState().isLogin;
          const currentAccessToken = useAuthStore.getState().accessToken;
          
          if (currentIsLogin && currentAccessToken) {
            console.log("[SSE] 5초 후 재연결 시도...");
            reconnectTimeoutRef.current = setTimeout(() => {
              connectSSE();
            }, 5000);
          }
        };
      } catch (error) {
        console.error("[SSE] 연결 실패:", error);
      }
    };

    connectSSE();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [isLogin, accessToken]);
};

const detectNotificationType = (message: string): NotificationType => {
  if (message.includes("입장")) return "PARTY_JOINED";
  if (message.includes("반론")) return "DEFENSE_REPLIED";
  if (message.includes("대댓글")) return "REBUTTAL_REPLIED";
  return "DEFENSE_REPLIED";
};