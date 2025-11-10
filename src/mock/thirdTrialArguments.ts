import type { ArgumentData } from "@/components/common/ArgumentCard";
import type { ThirdTrialSide } from "@/types/thirdTrial";

export const THIRD_TRIAL_ARGUMENTS: Record<ThirdTrialSide, ArgumentData[]> = {
  first: [
    {
      id: 1,
      userNickname: "청룡검사",
      userDgree: "베테랑",
      content:
        "피고는 사건 당시 긴급 피난 상황에 처해 있었으며, 이는 전원 증언으로 입증됩니다. 해당 정황을 고려하면 현재의 처벌 강도는 과도합니다.",
      likes: 128,
      isBest: false,
      isReplyable: false,
    },
    {
      id: 3,
      userNickname: "정의구현",
      userDgree: "중급 변호사",
      content:
        "피해자의 치료 경과를 살펴보면 고의성 여부는 여전히 논란입니다. 단, 합의 의사가 존재했는지 추가 확인이 필요합니다.",
      likes: 76,
      isBest: false,
      isReplyable: false,
    },
  ],
  second: [
    {
      id: 2,
      userNickname: "법꾸라",
      userDgree: "초보 변호사",
      content:
        "긴급 피난이라 주장하지만, 피고가 선제적으로 상황을 악화시킨 점이 명백합니다. 증거 영상 3분 24초 지점에서 해당 장면이 확인됩니다.",
      likes: 94,
      isBest: false,
      isReplyable: false,
    },
    {
      id: 4,
      userNickname: "철벽수비",
      userDgree: "시니어 변호사",
      content:
        "피고 측 증언은 일관성이 없으며, 피해자 진술과 충돌합니다. 특히 2차 조서에서는 진술이 상당 부분 번복되었습니다.",
      likes: 112,
      isBest: false,
      isReplyable: false,
    },
  ],
};
