import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import { PATHS } from '@/constants';

export type CaseStatus = "DONE" | "SECOND" | "THIRD" | "PENDING" | "FIRST";
export type CaseResult = "WIN" | "LOSE" | "PENDING";

export type TrialData = {
    id: number;
    title: string;
    mySide: string;
    status: CaseStatus;
    caseResult: CaseResult;
};

type TrialListItemProps = {
    trial: TrialData;
};

const TrialListItem = ({ trial }: TrialListItemProps) => {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);
    
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

    const DownArrowIcon: React.FC = () => (
        <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
    );

    const UpArrowIcon: React.FC = () => (
        <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
        </svg>
    );
    
    const getDisplayInfo = () => {
        if (trial.status === "DONE") {
            if (trial.caseResult === "WIN") {
                return { 
                    text: "승리", 
                    bgClass: "bg-main-medium text-white",
                    isOngoing: false,
                    roundText: "최종심 완료"
                };
            }
            if (trial.caseResult === "LOSE") {
                return { 
                    text: "패배", 
                    bgClass: "bg-main-red text-white",
                    isOngoing: false,
                    roundText: "최종심 완료"
                };
            }
            return { 
                text: "종료", 
                bgClass: "bg-gray-400 text-white",
                isOngoing: false,
                roundText: "최종심 완료"
            };
        }
        
        if (trial.status === "SECOND") {
            return {
                text: "진행중",
                bgClass: "bg-gray-400 text-white",
                isOngoing: true,
                roundText: "2차 재판 진행중"
            };
        }

        if (trial.status === "THIRD") {
            return {
                text: "진행중",
                bgClass: "bg-gray-400 text-white",
                isOngoing: true,
                roundText: "최종심 진행중"
            };
        }

        return {
            text: "진행중",
            bgClass: "bg-gray-400 text-white",
            isOngoing: true,
            roundText: "1차 재판 진행중"
        };
    };

    const displayInfo = getDisplayInfo();

    const handleNavigate = () => {
        if (!displayInfo.isOngoing) return;

        if (trial.status === "SECOND") {
            navigate(`${PATHS.SECOND_TRIAL_ROUND_ONE}/${trial.id}`);
        } else if (trial.status === "THIRD") {
            navigate(`${PATHS.THIRD_TRIAL}/${trial.id}`);
        } else {
            navigate(`${PATHS.FIRST_TRIAL}/${trial.id}`);
        }
    };

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="border-b border-main">
            <div 
                className="flex justify-between items-start py-4 transition-colors duration-150 cursor-pointer hover:bg-gray-50"
                onClick={toggleExpanded}
            >
                <div className="flex-1 min-w-0">
                    <p className="text-lg font-bold text-main truncate">{trial.title}</p>
                    <p className="text-sm text-main mt-1">{trial.mySide}</p>
                </div>
                
                <div className="flex items-center gap-3 ml-4">
                    <div
                        className={
                            'flex items-center gap-1 px-3 py-1 rounded-[10px] text-[16px] font-semibold whitespace-nowrap ' + 
                            displayInfo.bgClass
                        }
                    >
                        <span>{displayInfo.text}</span>
                        {displayInfo.isOngoing && <RightArrowIcon size={12} />}
                    </div>

                    <button 
                        className="text-main hover:text-main-medium transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleExpanded();
                        }}
                    >
                        {isExpanded ? <UpArrowIcon /> : <DownArrowIcon />}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="bg-main-bright px-6 py-4 mb-2 rounded-md">
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <span className="font-semibold text-main w-28">재판 제목:</span>
                            <span className="text-main">{trial.title}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-semibold text-main w-28">승패여부:</span>
                            <span className={`font-bold ${
                                trial.caseResult === "WIN" ? "text-main-medium" :
                                trial.caseResult === "LOSE" ? "text-main-red" :
                                "text-gray-600"
                            }`}>
                                {trial.caseResult === "WIN" ? "승리" :
                                 trial.caseResult === "LOSE" ? "패배" :
                                 "진행중"}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-semibold text-main w-28">재판진행도:</span>
                            <span className="text-main">{displayInfo.roundText}</span>
                        </div>
                    </div>
                    
                    {/* 진행중인 재판일 때만 버튼 표시 */}
                    {displayInfo.isOngoing && (
                        <div className="flex justify-end mt-4">
                            <Button
                                variant="primary"
                                size="md"
                                onClick={handleNavigate}
                            >
                                재판 보러가기
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TrialListItem;