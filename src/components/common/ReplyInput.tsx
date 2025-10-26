import React, { useState } from 'react';
import { Textarea } from './textarea'; // Textarea 컴포넌트 임포트
import Button from './Button';     // Button 컴포넌트 임포트

// 대댓글 제출 시 필요한 데이터 타입 (백엔드 전송용)
type ReplyPayload = {
  parentId: number; // 부모 논거의 ID
  replyContent: string; // 사용자가 입력한 대댓글 내용
  // TODO: userId 등 추가 정보 필요
};

type ReplyInputProps = {
  /** 대댓글을 작성할 부모 논거의 ID */
  parentId: number;
  /** 대댓글을 제출할 때 상위 컴포넌트에서 실행할 함수 */
  onSubmitReply: (payload: ReplyPayload) => void;
  // isReplyable prop 제거 (부모 ArgumentCard에서 렌더링을 제어함)
  /** 부모 논거 작성자의 닉네임 (placeholder에 사용) */
  parentNickname: string;
};

const ReplyInput = ({ parentId, onSubmitReply, parentNickname }: ReplyInputProps) => {
  const [showInput, setShowInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  // 입력창 토글 (열기/닫기)
  const handleToggle = () => {
    // 닫을 때 내용 초기화
    if (showInput) {
      setReplyContent('');
    }
    setShowInput(prev => !prev);
  };
  
  // 대댓글 제출 처리
  const handleSubmit = () => {
    if (!replyContent.trim()) {
        console.error("대댓글 내용을 입력해야 합니다.");
        return;
    }

    const payload: ReplyPayload = {
        parentId: parentId,
        replyContent: replyContent,
    };

    onSubmitReply(payload);
    
    // 제출 후 상태 초기화
    setReplyContent('');
    setShowInput(false);
  };

  // 이 컴포넌트가 렌더링되면 항상 대댓글 작성이 가능하다고 간주합니다.
  
  return (
    <div className="mt-3 flex justify-start w-full">
      
      {/* 1. 대댓글 작성 버튼 (showInput이 false일 때만 표시) */}
      {!showInput && (
        <Button 
          onClick={handleToggle} 
          variant="ghost" 
          className="text-sm text-black hover:text-gray-700 font-medium p-0 h-auto"
        >
          대댓글 작성
        </Button>
      )}

      {/* 2. 대댓글 입력 창 (showInput이 true일 때만 표시) */}
      {showInput && (
        <div className="w-full mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <Textarea 
            // 부모 닉네임을 사용하여 누구에게 다는 댓글인지 명시
            placeholder={`${parentNickname} 님에게 대댓글을 작성하세요...`}
            minRows={2}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="mb-2"
          />
          <div className="flex justify-end space-x-2">
            {/* 취소 버튼 */}
            <Button 
              onClick={handleToggle} 
              variant="secondary"
              size="sm"
            >
              취소
            </Button>
            {/* 제출 버튼 */}
            <Button 
              onClick={handleSubmit} 
              variant="primary" 
              size="sm"
              disabled={!replyContent.trim()} // 내용이 없으면 버튼 비활성화
            >
              제출
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReplyInput;