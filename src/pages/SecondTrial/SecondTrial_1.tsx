import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import Textarea from '@/components/common/textarea';
import ArgumentCard from '@/components/common/ArgumentCard';
import clsx from 'clsx';
import { PATHS } from '@/constants';
import {
  useSecondTrialDetailsQuery,
  usePostDefenseMutation,
  usePostVoteMutation
} from '@/hooks/secondTrial/useSecondTrial';
import type { DefenseRequest, VoteRequest } from '@/types/apis/secondTrial';
import { parseLocalDateTimeArray, formatDateTime, isDeadlinePassed } from '@/utils/dateUtils';
import { useToast } from '@/hooks/useToast';
import { motion } from 'framer-motion';

// 탭 상태 타입
type Tab = 'all' | 'A' | 'B';

const SecondTrial_1 = () => {
    const { caseId: caseIdParam } = useParams<{ caseId: string }>();
    const caseId = caseIdParam ? Number(caseIdParam) : undefined;
    const navigate = useNavigate();
    const { showSuccess, showError, showWarning } = useToast();

    // API 훅 - 2차 재판 상세 정보 (argumentA, argumentB, defenses 모두 포함)
    const { data: detailsRes, isLoading: isDetailsLoading } = useSecondTrialDetailsQuery(caseId);
    const details = detailsRes?.result;

    // defenses는 details에 포함됨
    const defenses = details?.defenses ?? [];

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

    // deadline 파싱 및 투표 가능 여부 판단
    const deadlineDate = details?.deadline ? parseLocalDateTimeArray(details.deadline) : null;
    const isVoteTime = deadlineDate && details?.deadline ? !isDeadlinePassed(details.deadline) : false;

    // 투표 처리
    const handleVote = async () => {
        if (!isVoteTime) {
            showWarning('투표 시간이 마감되었습니다.');
            return;
        }
        if (!selectedSide || !caseId) {
          showWarning('A 의견 또는 B 의견 중 하나를 먼저 선택해 주세요.');
          return;
        }

        try {
            const body: VoteRequest = { choice: selectedSide };
            await postVoteMutation.mutateAsync({ caseId, body });
            setIsVoted(true);
            showSuccess(`투표가 반영되었습니다. (마감 전까지 재투표 가능)`);
        } catch (err) {
            console.error('투표 실패:', err);
            showError('투표에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    // 새 논거 제출
    const handleSubmitArgument = async () => {
        if (!newArgument.trim()) {
            showWarning('변론 내용을 입력해 주세요.');
            return;
        }
        if (newArgumentSide === '') {
            showWarning('논거 제출 입장을 선택해 주세요.');
            return;
        }
        if (!caseId) {
            showError('케이스 ID가 없습니다.');
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
            showSuccess('변론이 성공적으로 제출되었습니다!');
        } catch (err) {
            console.error('변론 제출 실패:', err);
            showError('변론 제출에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    // 로딩 상태
    if (isDetailsLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-main font-bold">로딩 중...</p>
            </div>
        );
    }

    // 데이터 로드 실패
    if (!details) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen px-4">
                <p className="text-main-red font-bold text-lg md:text-xl mb-4 text-center">데이터를 받아오지 못했습니다</p>
                <Button variant="primary" onClick={() => navigate(-1)}>
                    이전 페이지로
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-[calc(100vh-98px)] pt-6 md:pt-12 pb-12 md:pb-20">
            <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-4">
                
                {/* 1. 헤더 및 타이머 */}
                <div className="flex flex-col md:flex-row items-center gap-2 pb-4 mb-4 md:mb-6">
                  <div className='flex items-center gap-2'>
                    <h1 className="text-3xl font-bold text-main">2차 재판</h1>
                    <Button
                      variant="primary"
                      size="sm"
                      className="h-[32px] px-3 rounded-[8px] text-xs font-semibold"
                      onClick={() => navigate(`/first-trial/${caseId}?step=judge`)}
                    >
                      1차 판결문 보기
                    </Button>
                  </div>
                  <span className="ml-auto bg-main-bright px-3 py-2 md:p-4 rounded-lg text-sm md:text-md font-medium text-main whitespace-nowrap">
                    {deadlineDate
                      ? `마감: ${formatDateTime(deadlineDate)}`
                      : '마감 시간 정보 없음'}
                  </span>
                </div>

                {/* 2. 상황 설명 */}
                <p className="font-medium mb-6 md:mb-8 text-main text-sm md:text-base">
                    {details.caseTitle}
                </p>

                {/* 3. 주장 선택 카드 */}
                <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8 lg:justify-between mb-8 md:mb-12">
                    {/* A. 찬성 블록 */}
                    <motion.div
                        initial={{ opacity: 0, x: -80 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                        onClick={() => isVoteTime && setSelectedSide('A')}
                        className={clsx(
                            "w-full lg:w-[513px]",
                            // ↓ 높이 줄이기
                            "h-[220px] sm:h-[260px] md:h-[300px] lg:h-[340px]",
                            "bg-main-medium rounded-[20px] md:rounded-[30px]",
                            "pt-[3px] pb-[16px] md:pt-[4px] md:pb-[24px] px-[4px] md:px-[6px]",
                            isVoteTime ? 'cursor-pointer' : 'cursor-default',
                            selectedSide === 'A' ? 'shadow-2xl scale-[1.02]' : '',
                            !isVoteTime && 'opacity-70'
                        )}
                    >
                        <div
                          className={clsx(
                            "w-full h-full bg-[#94B0EB] rounded-[17px] md:rounded-[26px]",
                            "flex justify-center items-center flex-col transition-all px-4 md:px-8 lg:px-12 py-6 md:py-8",
                            selectedSide === 'A' && 'shadow-inner'
                          )}
                        >
                          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-white mb-2 md:mb-4">
                            {details.argumentA.mainArgument}
                          </h2>
                          <div
                            className="scrollbar-hidden overflow-y-auto text-sm md:text-base text-white text-center leading-relaxed w-full max-h-[90px] md:max-h-[140px] lg:max-h-[180px]"
                            style={{ wordBreak: "break-word" }}
                          >
                            {details.argumentA.reasoning}
                          </div>
                        </div>
                    </motion.div>

                    {/* B. 반대 블록 */}
                    <motion.div
                        initial={{ opacity: 0, x: 80 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                        onClick={() => isVoteTime && setSelectedSide('B')}
                        className={clsx(
                            "w-full lg:w-[513px]",
                            "h-[220px] sm:h-[260px] md:h-[300px] lg:h-[340px]",
                            "bg-main-red rounded-[20px] md:rounded-[30px]",
                            "pt-[3px] pb-[16px] md:pt-[4px] md:pb-[24px] px-[4px] md:px-[6px]",
                            isVoteTime ? 'cursor-pointer' : 'cursor-default',
                            selectedSide === 'B' ? 'shadow-2xl scale-[1.02]' : '',
                            !isVoteTime && 'opacity-70'
                        )}
                    >
                        <div
                          className={clsx(
                            "w-full h-full bg-[#FFA7A7] rounded-[17px] md:rounded-[26px]",
                            "flex justify-center items-center flex-col transition-all px-4 md:px-8 lg:px-12 py-6 md:py-8",
                            selectedSide === 'B' && 'shadow-inner'
                          )}
                        >
                          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-white mb-2 md:mb-4">
                            {details.argumentB.mainArgument}
                          </h2>
                          <div
                            className="scrollbar-hidden overflow-y-auto text-sm md:text-base text-white text-center leading-relaxed w-full max-h-[90px] md:max-h-[140px] lg:max-h-[180px]"
                            style={{ wordBreak: "break-word" }}
                          >
                            {details.argumentB.reasoning}
                          </div>
                        </div>
                    </motion.div>
                </div>

                {/* 4. 투표하기 버튼 */}
                <div className="flex justify-center mb-8 md:mb-12">
                  {isVoteTime ? (
                    <Button
                      variant="trialStart"
                      size="lg"
                      onClick={handleVote}
                      disabled={!selectedSide || postVoteMutation.isPending}
                      className="w-full max-w-[585px] h-[80px] md:h-[100px] lg:h-[123px] rounded-[20px] md:rounded-[30px] text-base"
                    >
                      {postVoteMutation.isPending
                        ? '투표 중...'
                        : (details.userVote ? '재투표하기' : '투표하기')}
                    </Button>
                  ) : (
                    <Button
                      variant="trialStart"
                      size="lg"
                      className="w-full max-w-[585px] h-[80px] md:h-[100px] lg:h-[123px] rounded-[20px] md:rounded-[30px] text-base"
                      onClick={() => navigate(`${PATHS.SECOND_TRIAL_FINAL}/${caseId}`)}
                    >
                      투표 결과보기
                    </Button>
                  )}
                </div>

                {/* 광고 섹션 */}
                {details.isAd && details.adImageUrl && (
                  <div className="mb-8 md:mb-12">
                    <div className="relative rounded-lg overflow-hidden">
                      <img
                        src={details.adImageUrl}
                        alt="광고"
                        className="w-full h-auto object-cover"
                      />
                      {details.adLink && (
                        <div className="mt-4 flex justify-center">
                          <a
                            href={details.adLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-6 py-3 bg-main text-white font-semibold rounded-lg hover:bg-main-medium transition-colors"
                          >
                            자세히 보기
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 5. 변론 입력 섹션 */}
                <>
                    <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 border-t border-main pt-6 md:pt-8 text-main">변호</h2>
                    <div className="bg-main-bright p-4 md:p-6 rounded-lg mb-6 md:mb-8"> 
                        <div className="flex items-start space-x-4 mb-4">
                            <div className="flex flex-col w-full space-y-3 md:space-y-4"> 
                                <select
                                    id="argumentSideSelect"
                                    value={newArgumentSide}
                                    onChange={(e) => setNewArgumentSide(e.target.value as 'A' | 'B')}
                                    className="
                                    w-full sm:w-40 p-2 md:p-3 border border-main-medium rounded-md bg-white 
                                    flex items-center justify-center 
                                    text-center text-main text-sm md:text-base
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
                                    className="w-full bg-white border-main-medium text-sm md:text-base"
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end">
                            <Button 
                                variant="primary" 
                                className="mt-2 text-sm md:text-base"
                                onClick={handleSubmitArgument}
                                disabled={!newArgument.trim() || postDefenseMutation.isPending}
                            >
                                {postDefenseMutation.isPending ? '등록 중...' : '등록하기'}
                            </Button>
                        </div>
                    </div>
                </>
                
                {/* 탭 네비게이션 */}
                <div className="flex flex-wrap gap-2 mb-4 md:mb-6 pb-2">
                    {(['all', 'A', 'B'] as const).map((tab) => (
                        <Button 
                            key={tab}
                            variant={currentTab === tab ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setCurrentTab(tab as Tab)}
                            className={clsx(
                                "min-w-[70px] md:min-w-[80px] text-xs md:text-sm",
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
                                authorRank={arg.authorRank}
                                side={arg.side}
                                content={arg.content}
                                likesCount={arg.likesCount}
                                isLikedByMe={arg.isLikedByMe}
                            />
                        ))
                    ) : (
                        <p className="text-center text-main py-8 md:py-10 bg-gray-50 rounded-lg text-sm md:text-base">
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