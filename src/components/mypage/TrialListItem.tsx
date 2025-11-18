import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import { PATHS } from '@/constants';

// API에서 받는 실제 타입
export type CaseStatus = "DONE" | "SECOND" | "PENDING" | "FIRST";
export type CaseResult = "WIN" | "LOSE" | "PENDING";

// 재판 데이터 타입 (API 응답 구조 그대로)
export type TrialData = {
    id: number;
    title: string;
    mySide: string; // mainArguments[0]
    status: CaseStatus; // 재판 단계
    caseResult: CaseResult; // 승패 결과
};

type TrialListItemProps = {
    trial: TrialData;
};

const TrialListItem = ({ trial }: TrialListItemProps) => {
    const navigate = useNavigate();
    
    const RightArrowIcon: React.FC<{ size: number }> = ({ size }) => (
        <svg 
            className={`w-[${size}px] h-[${size}px]`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
    );
    
    // 표시할 텍스트와 스타일 결정
    const getDisplayInfo = () => {
        // 종료된 재판
        if (trial.status === "DONE") {
            if (trial.caseResult === "WIN") {
                return { 
                    text: "승리", 
                    bgClass: "bg-main-medium text-white",
                    isOngoing: false,
                    roundText: null
                };
            }
            if (trial.caseResult === "LOSE") {
                return { 
                    text: "패배", 
                    bgClass: "bg-main-red text-white",
                    isOngoing: false,
                    roundText: null
                };
            }
            // DONE인데 PENDING인 경우 (드물지만)
            return { 
                text: "종료", 
                bgClass: "bg-gray-400 text-white",
                isOngoing: false,
                roundText: null
            };
        }
        
        // 진행중인 재판
        if (trial.status === "SECOND") {
            return { 
                text: "진행중", 
                bgClass: "bg-gray-400 text-white",
                isOngoing: true,
                roundText: "2차 재판 진행중"
            };
        }
        
        // 1차 또는 PENDING
        return { 
            text: "진행중", 
            bgClass: "bg-gray-400 text-white",
            isOngoing: true,
            roundText: "1차 재판 진행중"
        };
    };

    const displayInfo = getDisplayInfo();

    // 진행중인 재판 클릭 핸들러
    const handleClick = () => {
        if (!displayInfo.isOngoing) return;

        // 재판 단계에 따라 적절한 페이지로 이동
        if (trial.status === "SECOND") {
            // 2차 재판 진행중 -> 2차 재판 라운드1 페이지
            navigate(`${PATHS.SECOND_TRIAL_ROUND_ONE}/${trial.id}`);
        } else {
            // 1차 재판 진행중 -> 1차 재판 페이지
            navigate(`${PATHS.FIRST_TRIAL}?caseId=${trial.id}`);
        }
    };

    return (
        <div 
            className={`flex justify-between items-start py-4 border-b border-main transition-colors duration-150 ${
                displayInfo.isOngoing ? 'hover:bg-gray-50 cursor-pointer' : ''
            }`}
            onClick={handleClick}
        >
            <div className="flex-1 min-w-0">
                <p className="text-lg font-bold text-main truncate">{trial.title}</p>
                <p className="text-sm text-main mt-1">{trial.mySide}</p>
            </div>
            
            <div className="flex flex-col items-end gap-1 ml-4">
                {/* 진행중일 때만 재판 단계 표시 */}
                {displayInfo.isOngoing && displayInfo.roundText && (
                    <span className="text-sm text-main font-medium">
                        {displayInfo.roundText}
                    </span>
                )}
                
                {/* 상태 배지 */}
                <div
                    className={
                        'flex items-center gap-1 px-3 py-1 rounded-[10px] text-[16px] font-semibold whitespace-nowrap ' + 
                        displayInfo.bgClass
                    }
                >
                    <span>{displayInfo.text}</span>
                    <RightArrowIcon size={12} />
                </div>
            </div>
        </div>
    );
};

export default TrialListItem;