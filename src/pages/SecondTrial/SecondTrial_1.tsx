import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import Textarea from '@/components/common/textarea';
import ArgumentCard from '@/components/common/ArgumentCard';
import clsx from 'clsx'; 
import { PATHS } from '@/constants';
import { 
  useSecondTrialDetailsQuery, 
  useDefensesQuery, 
  usePostDefenseMutation, 
  usePostVoteMutation 
} from '@/hooks/secondTrial/useSecondTrial';
import { useFirstCaseDetailQuery } from '@/hooks/firstTrial/useFirstTrial';
import type { DefenseRequest, VoteRequest } from '@/types/apis/secondTrial';

// 탭 상태 타입
type Tab = 'all' | 'A' | 'B';

const SecondTrial_1 = () => {
    const { caseId: caseIdParam } = useParams<{ caseId: string }>(); 
    const caseId = caseIdParam ? Number(caseIdParam) : undefined;
    const navigate = useNavigate();

    // API 훅들
    const { data: detailsRes, isLoading: isDetailsLoading } = useSecondTrialDetailsQuery(caseId);
    const details = detailsRes?.result;
    
    const { data: defensesRes, isLoading: isDefensesLoading } = useDefensesQuery(caseId);
    const defenses = defensesRes?.result ?? [];

    // 1차 재판 정보 (A/B 입장)
    const { data: caseDetailRes, isLoading: isCaseDetailLoading } = useFirstCaseDetailQuery(caseId);
    const caseDetail = caseDetailRes?.result;

    const postDefenseMutation = usePostDefenseMutation();
    const postVoteMutation = usePostVoteMutation();

    // 투표 상태
    const [selectedSide, setSelectedSide] = useState<'A' | 'B' | null>(null);
    const [isVoted, setIsVoted] = useState(false);
    
    // 변론 입력 상태
    const [newArgument, setNewArgument] = useState('');
    const [newArgumentSide, setNewArgumentSide] = useState<'' | 'A' | 'B'>('');
    const [currentTab, setCurrentTab] = useState<Tab>('all');

    // 탭 필터링 로직
    const filteredArguments = useMemo(() => {
        if (currentTab === 'A') return defenses.filter(arg => arg.side === 'A');
        if (currentTab === 'B') return defenses.filter(arg => arg.side === 'B');
        return defenses;
    }, [currentTab, defenses]);

    // 투표 가능 여부 판단 (deadline 기준)
    const isVoteTime = details?.deadline ? new Date(details.deadline) > new Date() : false;
    {/*
    // 변론 가능 여부에 대한 시간제한은 빼기로 했음.
    const isArgumentTime = isVoteTime; // 변론도 동일 조건으로 가정
    */}

    // 투표 처리
    const handleVote = async () => {
        if (!isVoteTime) {
            alert('투표 시간이 마감되었습니다.');
            return;
        }
        if (!selectedSide || !caseId) {
          alert('A 의견 또는 B 의견 중 하나를 먼저 선택해 주세요.');
          return;
        }
        
        try {
            const body: VoteRequest = { choice: selectedSide };
            await postVoteMutation.mutateAsync({ caseId, body });
            setIsVoted(true);
            alert(`투표가 반영되었습니다. (마감 전까지 재투표 가능)`);
        } catch (err) {
            console.error('투표 실패:', err);
            alert('투표에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    // 새 논거 제출
    const handleSubmitArgument = async () => {
        if (!newArgument.trim()) {
            alert('변론 내용을 입력해 주세요.');
            return;
        }
        if (newArgumentSide === '') {
            alert('논거 제출 입장을 선택해 주세요.');
            return;
        }
        if (!caseId) {
            alert('케이스 ID가 없습니다.');
            return;
        }
        
        try {
            const body: DefenseRequest = {
                side: newArgumentSide,
                content: newArgument.trim(),
            };
            await postDefenseMutation.mutateAsync({ caseId, body });
            setNewArgument('');
            setNewArgumentSide('');
            alert('변론이 성공적으로 제출되었습니다!');
        } catch (err) {
            console.error('변론 제출 실패:', err);
            alert('변론 제출에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    // 로딩 상태
    if (isDetailsLoading || isDefensesLoading || isCaseDetailLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-main font-bold">로딩 중...</p>
            </div>
        );
    }

    // 데이터 로드 실패
    if (!caseDetail || !details) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen">
                <p className="text-main-red font-bold text-xl mb-4">데이터를 받아오지 못했습니다</p>
                <Button variant="primary" onClick={() => navigate(-1)}>
                    이전 페이지로
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pt-12 pb-20">
            <div className="max-w-6xl mx-auto px-4">
                
                {/* 1. 헤더 및 타이머 */}
                <div className="flex justify-between items-center pb-4 mb-6">
                    <h1 className="text-3xl font-bold text-main">2차 재판</h1>
                    <span className="bg-main-bright p-4 rounded-lg text-md font-medium text-main">
                        {details.deadline 
                            ? `마감: ${new Date(details.deadline).toLocaleString()}` 
                            : '마감 시간 정보 없음'}
                    </span>
                </div>

                {/* 2. 상황 설명 */}
                <p className="font-medium mb-8 text-main">
                    {caseDetail.title}
                </p>

                {/* 3. 주장 선택 카드 */}
                <div className="flex space-x-8 justify-center mb-12">
                    {/* A. 찬성 블록 */}
                    <div 
                        onClick={() => isVoteTime && setSelectedSide('A')}
                        className={clsx(
                            "w-[513px] h-[447px] bg-main-medium rounded-[30px] flex justify-center items-center flex-col",
                            isVoteTime ? 'cursor-pointer' : 'cursor-default',
                            selectedSide === 'A' ? 'border-4 border-blue-500 shadow-lg scale-[1.02]' : 'border-4 border-transparent hover:border-blue-400',
                            !isVoteTime && 'opacity-70' 
                        )}
                    >
                        <h2 className="text-2xl font-bold text-center text-white mb-4">{caseDetail.argumentA.mainArgument}</h2>
                        <p className="px-20 py-10 text-white text-center">
                            {caseDetail.argumentA.reasoning}
                        </p>
                    </div>
                    
                    {/* B. 반대 블록 */}
                    <div 
                        onClick={() => isVoteTime && setSelectedSide('B')}
                        className={clsx(
                            "w-[513px] h-[447px] bg-main-red rounded-[30px] flex justify-center items-center flex-col",
                            isVoteTime ? 'cursor-pointer' : 'cursor-default',
                            selectedSide === 'B' ? 'border-4 border-red-500 shadow-lg scale-[1.02]' : 'border-4 border-transparent hover:border-red-400',
                            !isVoteTime && 'opacity-70'
                        )}
                    >
                        <h2 className="text-2xl font-bold text-center text-white mb-4">{caseDetail.argumentB.mainArgument}</h2>
                        <p className="px-20 py-10 text-white text-center">
                            {caseDetail.argumentB.reasoning}
                        </p>
                    </div>
                </div>

                {/* 4. 투표하기 버튼 */}
                <div className="flex justify-center mb-12">
                    {isVoteTime ? (
                        <Button 
                            variant="trialStart" 
                            size="lg" 
                            onClick={handleVote}
                            disabled={!selectedSide || postVoteMutation.isPending} 
                            className="w-[585px] h-[123px] rounded-[30px]"
                        >
                            {postVoteMutation.isPending ? '투표 중...' : (isVoted ? '재투표하기' : '투표하기')}
                        </Button>
                    ) : (
                        <Button 
                            variant="trialStart" 
                            size="lg" 
                            className="w-[585px] h-[123px] rounded-[30px]"
                            onClick={() => navigate(`${PATHS.SECOND_TRIAL_FINAL}/${caseId}`)}
                        >
                            투표 결과보기
                        </Button>
                    )}
                </div>
                
                {/* 5. 변론 입력 섹션 (마감 시간 전에만 표시) */}
                { (
                    <>
                        <h2 className="text-2xl font-bold mb-4 border-t border-main pt-8 text-main">변호</h2>
                        <div className="bg-main-bright p-6 rounded-lg mb-8"> 
                            <div className="flex items-start space-x-4 mb-4">
                                <div className="flex flex-col w-full space-y-4"> 
                                    <select
                                        id="argumentSideSelect"
                                        value={newArgumentSide}
                                        onChange={(e) => setNewArgumentSide(e.target.value as 'A' | 'B')}
                                        className="
                                        w-40 p-3 border border-main-medium rounded-md bg-white 
                                        flex items-center justify-center 
                                        text-center text-main
                                        appearance-auto
                                        focus:outline-none focus:ring-2 focus:ring-main-medium
                                        "
                                    >
                                        <option value="">입장 선택</option>
                                        <option value="A">A 의견</option>
                                        <option value="B">B 의견</option>
                                    </select>
                                    
                                    <Textarea 
                                        placeholder="선택한 입장의 변호의견을 제시해주세요." 
                                        minRows={3} 
                                        maxRows={6} 
                                        value={newArgument}
                                        onChange={(e) => setNewArgument(e.target.value)}
                                        className="w-full bg-white border-main-medium"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex justify-end">
                                <Button 
                                    variant="primary" 
                                    className="mt-2"
                                    onClick={handleSubmitArgument}
                                    disabled={!newArgument.trim() || postDefenseMutation.isPending}
                                >
                                    {postDefenseMutation.isPending ? '등록 중...' : '등록하기'}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
                
                {/* 탭 네비게이션 */}
                <div className="flex space-x-2 mb-6 pb-2">
                    {(['all', 'A', 'B'] as const).map((tab) => (
                        <Button 
                            key={tab}
                            variant={currentTab === tab ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setCurrentTab(tab as Tab)}
                            className={clsx(
                                "min-w-[80px]",
                                currentTab !== tab && 'text-main hover:bg-gray-300'
                            )}
                        >
                            {tab === 'all' ? `전체 (${defenses.length})` : tab === 'A' ? `A 의견 (${defenses.filter(a => a.side === 'A').length})` : `B 의견 (${defenses.filter(a => a.side === 'B').length})`}
                        </Button>
                    ))}
                </div>

                {/* 논거 목록 */}
                <div>
                    {filteredArguments.length > 0 ? (
                        filteredArguments.map(arg => (
                            <ArgumentCard 
                                key={arg.defenseId} 
                                caseId={caseId!}
                                defenseId={arg.defenseId}
                                authorNickname={arg.authorNickname}
                                side={arg.side}
                                content={arg.content}
                                likesCount={arg.likesCount}
                                isLikedByMe={arg.isLikedByMe}
                            />
                        ))
                    ) : (
                        <p className="text-center text-main py-10 bg-gray-50 rounded-lg">
                            {currentTab === 'all' 
                                ? '제출된 변론 논거가 없습니다.' 
                                : `${currentTab}측 변론 논거가 없습니다.`}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SecondTrial_1;