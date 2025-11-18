import instance from "@/apis/instance";
import type { ApiResponse } from "@/types/common/api";
import type { LikeRequest } from "@/types/apis/secondTrial";

// 좋아요 토글 (방어변론/반론 공통)
const postLike = async (body: LikeRequest): Promise<ApiResponse<boolean>> => {
  const { data } = await instance.post<ApiResponse<boolean>>(
    `/api/likes`,
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

// Like 토글: DEFENSE/REBUTTAL 모두 here
export const toggleLike = postLike;