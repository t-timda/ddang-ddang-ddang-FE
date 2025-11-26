import React from "react";
import { useFinalJudgmentHistoryQuery } from "@/hooks/cases/useCases";
import Button from "@/components/common/Button";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

type JudgmentHistoryModalProps = {
  caseId: number;
  onClose: () => void;
};

const JudgmentHistoryModal: React.FC<JudgmentHistoryModalProps> = ({
  caseId,
  onClose,
}) => {
  const navigate = useNavigate();

  // 선택된 케이스의 판결 히스토리 조회
  const { data: historyRes, isLoading: isHistoryLoading } = useFinalJudgmentHistoryQuery(caseId);
  const judgmentHistory = historyRes?.result ?? [];

  const getTrialLabel = (index: number, totalLength: number) => {
    // 역순이므로 마지막 항목이 1차 재판
    if (index === totalLength - 1) {
      return "1차 재판 (초심)";
    }
    return "3차 재판 (최종심)";
  };

  return (
    <>
    <div className="fixed inset-0 bg-gray-700 opacity-50"></div>
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    > 
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="sticky top-0 bg-white border-b-2 border-main-bright p-6 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-main">
            사건 #{caseId} 재판 히스토리
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-main text-3xl font-bold"
          >
            ×
          </button>
        </div>

        {/* 모달 내용 */}
        <div className="p-6 bg-white">
          {isHistoryLoading ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-main font-bold">로딩 중...</p>
            </div>
          ) : judgmentHistory.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-gray-500">판결 히스토리가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {[...judgmentHistory].reverse().map((judgment, index) => (
                <div
                  key={index}
                  className={clsx(
                    "border-2 rounded-xl p-6",
                    index === 0
                      ? "border-yellow-400 bg-yellow-50"
                      : "border-gray-300 bg-gray-50"
                  )}
                >
                  {/* 재판 단계 */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-main">
                      {getTrialLabel(index, judgmentHistory.length)}
                    </h3>
                    {index === 0 && (
                      <span className="bg-yellow-400 text-white text-sm px-3 py-1 rounded-full font-semibold">
                        최근 판결
                      </span>
                    )}
                  </div>

                  {/* 승률 바 */}
                  <div className="mb-4">
                    <div className="relative w-full h-10 bg-red-200 rounded-full overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full bg-blue-500 rounded-full"
                        style={{ width: `${judgment.ratioA ?? 50}%` }}
                      ></div>
                      <div className="absolute inset-0 flex justify-between items-center px-4 text-white font-bold text-sm">
                        <span>A {judgment.ratioA ?? 0}%</span>
                        <span>B {judgment.ratioB ?? 0}%</span>
                      </div>
                    </div>
                  </div>

                  {/* 판결문 */}
                  {judgment.verdict && (
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-main mb-2">
                        판결문
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {judgment.verdict}
                      </p>
                    </div>
                  )}

                  {/* 우측 하단 재판 참여하기 버튼 */}
                  <div className="flex justify-end mt-8">
                    <button
                      className="bg-main text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-main-medium transition"
                      onClick={() => navigate(`/secondtrial/1/${caseId}`)}
                    >
                      재판 참여하기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        
      </div>
    </div>
    </>
  );
};

export default JudgmentHistoryModal;
