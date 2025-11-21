// src/components/mypage/DefenseListItem.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MyDefenseItem } from '@/types/apis/home';
import { PATHS } from '@/constants';
import ThumbUpIcon from '@/assets/svgs/thumbs-up.svg?react';
import Button from '@/components/common/Button';
import { useQuery } from '@tanstack/react-query';
import instance from '@/apis/instance';

type DefenseListItemProps = {
    defense: MyDefenseItem;
};

const DefenseListItem = ({ defense }: DefenseListItemProps) => {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);
    
    // title이 없으면 API로 재판 정보 가져오기
    const { data: caseData } = useQuery({
        queryKey: ['caseTitle', defense.caseId],
        queryFn: async () => {
            const { data } = await instance.get(`/api/v1/cases/${defense.caseId}`);
            return data.result;
        },
        enabled: !defense.title,
    });

    const displayTitle = defense.title || caseData?.title || '재판 제목 로딩중...';
    
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

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const handleNavigate = () => {
        navigate(`${PATHS.SECOND_TRIAL_ROUND_ONE}/${defense.caseId}`);
    };

    const sideBgClass = defense.debateSide === "A" ? "bg-main-medium" : "bg-main-red";

    return (
        <div className="border-b border-main">
            {/* 메인 아이템 */}
            <div 
                className="flex justify-between items-start py-4 transition-colors duration-150 cursor-pointer hover:bg-gray-50"
                onClick={toggleExpanded}
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="text-lg font-bold text-main truncate">{displayTitle}</p>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold text-white whitespace-nowrap ${sideBgClass}`}>
                            {defense.debateSide} 의견
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{defense.content}</p>
                </div>
                
                <div className="flex items-center gap-3 ml-4">
                    {/* 좋아요 수 */}
                    <div className="flex items-center gap-1">
                        <ThumbUpIcon className="w-5 h-5 text-main" />
                        <span className="text-sm text-main font-medium">{defense.likeCount}</span>
                    </div>

                    {/* 펼치기/접기 아이콘 */}
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

            {/* 펼쳐진 상세 정보 */}
            {isExpanded && (
                <div className="bg-main-bright px-6 py-4 mb-2 rounded-md">
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <span className="font-semibold text-main w-28">재판 제목:</span>
                            <span className="text-main">{displayTitle}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-semibold text-main w-28">내 진영:</span>
                            <span className={`font-bold px-3 py-1 rounded-xl text-white ${sideBgClass}`}>
                                {defense.debateSide} 의견
                            </span>
                        </div>
                        <div className="flex items-start">
                            <span className="font-semibold text-main w-28">변론 내용:</span>
                            <span className="text-main flex-1 whitespace-pre-wrap">{defense.content}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="font-semibold text-main w-28">좋아요:</span>
                            <div className="flex items-center gap-2">
                                <ThumbUpIcon className="w-5 h-5 text-main" />
                                <span className="text-main font-medium">{defense.likeCount}명이 찬성합니다</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                        <Button
                            variant="primary"
                            size="md"
                            onClick={handleNavigate}
                        >
                            재판 보러가기
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DefenseListItem;