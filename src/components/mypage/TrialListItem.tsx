import React from 'react';
import Button from '@/components/common/Button';

// 재판 결과 상태 타입
export type TrialStatus = '승리' | '패배' | '진행중';

// 재판 데이터 타입
export type TrialData = {
    id: number;
    title: string;
    mySide: string; // 내가 주장한 의견 (예: '짬뽕', '찍먹', '안된다')
    status: TrialStatus; // 결과 상태
    currentRound?: string; // 진행중일 경우 라운드 정보
};

type TrialListItemProps = {
    trial: TrialData;
};

const TrialListItem = ({ trial }: TrialListItemProps) => {
    
    // ChevronRight를 대체하는 인라인 SVG 컴포넌트
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
    
    const statusText = trial.status === '진행중' 
        ? trial.currentRound || '진행중' 
        : trial.status;

    // 상태별 배경색 및 텍스트 스타일 정의
    const getStatusClasses = (status: TrialStatus) => {
        switch (status) {
            case '승리':
                // 승리: 진한 메인 색상 배경
                return 'bg-main-medium text-white';
            case '패배':
                // 패배: 빨간색 배경
                return 'bg-main-red text-white';
            case '진행중':
                // 진행중: 중간 메인 색상 배경
                return 'bg-gray-400 text-white';
            default:
                return 'bg-main text-white';
        }
    };

    return (
        <div className="flex justify-between items-center py-4 border-b border-main hover:bg-gray-50 transition-colors duration-150">
            <div className="flex-1 min-w-0">
                <p className="text-lg font-bold text-main truncate">{trial.title}</p>
                <p className="text-sm text-main mt-1">{trial.mySide}</p>
            </div>
            
            <div
                className={
                    'flex px-3 py-1 rounded-[10px] font-size-[16px] font-semibold whitespace-nowrap ' + 
                    getStatusClasses(trial.status)
                }
            >
                <span>{statusText}</span>
                <RightArrowIcon size={12} />
            </div>
        </div>
    );
};

export default TrialListItem;