import React from "react";
import { Textarea } from "./textarea"; // Textarea 컴포넌트 import
import ReplyInput from "./ReplyInput"; // ReplyInput 컴포넌트 import
import ThumbUpIcon from "@/assets/svgs/thumbs-up.svg?react"; // 추천 아이콘 import

// 변론 논거 데이터 타입 정의 (최소한의 정보만 유지)
export type ArgumentData = {
  id: number;
  userNickname: string; // 작성자 닉네임
  userDgree: string; // 작성자 등급 (예: "초보 변호사" 등)
  content: string; // 변론 내용
  likes: number; // 추천 수
  isBest: boolean; // 베스트 논거 여부 -> 3차 재판 페이지에서 사용 예정
  isReplyable: boolean; // 대댓글 허용 여부 -> 3차 재판 페이지에서 사용 예정
  side?: 'A' | 'B'; // 찬성(A) 또는 반대(B) 측 논거 구분
  // 논쟁의 제목은 이 카드의 부모(2차 재판 페이지)에서 관리합니다.
};

// 대댓글 제출 시 필요한 데이터 타입 (ReplyInput과 동일)
type ReplyPayload = {
  parentId: number; // 부모 논거의 ID
  replyContent: string; // 사용자가 입력한 대댓글 내용
  // TODO: userId 등 추가 정보 필요
};

type ArgumentCardProps = {
  argument: ArgumentData;
  /**
   * 상위 컴포넌트에서 대댓글 제출을 처리할 함수를 prop으로 정의
   * 이 부분이 누락되어 'onSubmitReply'를 찾을 수 없다는 에러 발생
   */
  onSubmitReply: (payload: ReplyPayload) => void;
};

// ArgumentCard 컴포넌트의 props로 onSubmitReply를 구조 분해 할당
const ArgumentCard = ({ argument, onSubmitReply }: ArgumentCardProps) => {
  const { id, userNickname, userDgree, content, likes, isReplyable, side } = argument;
    
  // ArgumentCard는 투표 가능(추천) 버튼을 가지고 있습니다.
  const handleLikeClick = () => {
      console.log(`논거 ID ${id} 에 추천했습니다.`);
      // 추후 API 호출 로직 구현
  };

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-4">
      
      {/* 닉네임, 등급, 추천 섹션 */}
      <div className="flex justify-between items-center mb-2">
        {/* 닉네임과 등급 */}
        <div className="flex items-center space-x-3">
          <span className="font-bold text-gray-900">{argument.userNickname}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold bg-[#E8E8E8]`}>
            {argument.userDgree}
          </span>
        </div>
        
        {/* 추천 버튼 */}
        <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors">
          <ThumbUpIcon className="w-4 h-4"/>
          <span className="text-sm font-medium">{argument.likes}명이 이 의견에 찬성합니다</span>
        </button>
      </div>
      
      <div className="text-sm font-semibold text-gray-700 mb-2">
        {side} 의견
      </div>

      {/* 변론 내용 (Textarea readOnly 유지) */}
      <Textarea
        value={argument.content}
        readOnly // 읽기 전용으로 설정
        minRows={1}
        className="mt-2 text-gray-700 bg-transparent border-none p-0 cursor-default focus:ring-0"
      />
      
      {/* 대댓글 영역은 제거하고, 나중에 이 위치에 컴포넌트를 추가할 예정 */}
      <div className="mt-3 flex justify-start w-full">
          {isReplyable ? (
              // 재판 가능 시간일 경우, ReplyInput 컴포넌트를 표시
              // onSubmitReply 함수를 prop으로 전달
              <ReplyInput 
                parentId={id}
                onSubmitReply={onSubmitReply} 
                parentNickname={userNickname}
              />
          ) : (
              // 재판 불가능 시간일 경우, 마감 메시지만 표시
              <span className="text-sm text-gray-500">변론 마감</span>
          )}
      </div>
    </div>
  );
};

export default ArgumentCard;
