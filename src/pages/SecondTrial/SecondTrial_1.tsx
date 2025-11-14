import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import Textarea from '@/components/common/textarea';
import ArgumentCard, { ArgumentData } from '@/components/common/ArgumentCard';
import clsx from 'clsx'; 
import { PATHS } from '@/constants';
import ReplyInput from '@/components/common/ReplyInput'; 

// 더미 데이터 및 상수
const MOCK_DEBATE_DATA = {
  id: 1,
  timeLimit: '마감까지 남은 시간 : 1시간',
  situation: '깻잎 논쟁: 내 연인이 친구의 깻잎을 떼어주는 것을 허용해야 하는가?',
  argumentA: '연인을 배려하는 행동이며, 사소한 일에 질투하는 것은 속이 좁은 것이다.',
  argumentB: '연인과 친구 사이에 무의식적인 친밀감을 형성하는 행동이며, 오해의 소지가 있다.',
  isArgumentTime: false, // ⭐️ [추가] 변론/대댓글 가능 시간 여부 (true = 마감 전)
  isVoteTime: false,       // ⭐️ [추가] 투표 가능 시간 여부 (true = 마감 전)
};

// 변론 목록 더미 데이터
const DUMMY_ARGUMENTS: ArgumentData[] = [
    { id: 101, userNickname: "배심원_철수", userDgree: "초보 변호사", content: "깻잎 논쟁은 단순한 질투가 아니라, 상대방의 경계선을 존중하는 문제로 봐야 합니다. A의 행동은 무의식적인 선 넘기입니다.", likes: 45, isBest: false, isReplyable: MOCK_DEBATE_DATA.isArgumentTime, side: 'B' },
    { id: 102, userNickname: "공감_영희", userDgree: "숙련 변호사", content: "A의 의견에 찬성합니다. 연인 관계에서 그 정도의 배려를 막는 것은 소유욕으로 비춰질 수 있습니다. 믿음이 중요합니다.", likes: 88, isBest: true, isReplyable: MOCK_DEBATE_DATA.isArgumentTime, side: 'A' },
    { id: 103, userNickname: "변호사_김", userDgree: "인증 변호사", content: "법적 관점에서 깻잎 논쟁은 당사자 간의 합의 영역입니다. 합의되지 않은 행위는 오해를 낳을 수 있지만, 법적 문제는 아닙니다. 하지만 관계적 문제는 심각합니다.", likes: 120, isBest: false, isReplyable: false, side: 'B' }, // 마감된 상태 논거
];


// 탭 상태 타입
type Tab = 'all' | 'A' | 'B';

// 새로운 논거 제출 시 ArgumentCardProps에서 사용할 onSubmitReply 함수 정의
const handleSubmitReply = (payload: any) => {
    // TODO: 실제 API 호출 로직을 여기서 구현합니다. (SecondTrial_1 컴포넌트 레벨)
    console.log('[대댓글 제출 완료]', payload);
    alert(`대댓글이 제출되었습니다. 부모 ID: ${payload.parentId}`);
};


const SecondTrial_1 = () => {
    const { debateId } = useParams<{ debateId: string }>(); 
    const navigate = useNavigate();
    // 투표 상태는 이제 API를 통해 가져와야 하지만, 재투표 로직을 위해 로컬 상태를 유지합니다.
    const [selectedSide, setSelectedSide] = useState<'A' | 'B' | null>(null);
    const [isVoted, setIsVoted] = useState(false); // 투표 기록 유무 상태
    
    // 변론 입력 상태
    const [newArgument, setNewArgument] = useState('');
    const [newArgumentSide, setNewArgumentSide] = useState<'' | 'A' | 'B'>('');
    const [currentTab, setCurrentTab] = useState<Tab>('all'); // 댓글 탭 필터 상태

    // 탭 필터링 로직
    const filteredArguments = useMemo(() => {
        if (currentTab === 'A') return DUMMY_ARGUMENTS.filter(arg => arg.side === 'A');
        if (currentTab === 'B') return DUMMY_ARGUMENTS.filter(arg => arg.side === 'B');
        return DUMMY_ARGUMENTS;
    }, [currentTab]);
    
    // ⭐️ 투표 처리 함수 (재투표 허용 로직 포함)
    const handleVote = () => {
        if (!MOCK_DEBATE_DATA.isVoteTime) {
            alert('투표 시간이 마감되었습니다.');
            return;
        }
        if (!selectedSide) {
          alert('A 의견 또는 B 의견 중 하나를 먼저 선택해 주세요.');
          return;
        }
        
        // 투표 API 호출 (재투표 시에도 동일 로직)
        console.log(`[투표 제출/재투표] 논쟁 ID ${debateId}: ${selectedSide} 의견으로 투표 완료`);
        setIsVoted(true); // 투표 기록만 남깁니다.
        alert(`투표가 반영되었습니다. (마감 전까지 재투표 가능)`);
    };

    // 새 논거 제출 처리 함수
    const handleSubmitArgument = () => {
        if (!newArgument.trim()) {
            alert('변론 내용을 입력해 주세요.');
            return;
        }
        // ⭐️ '입장 선택'이 기본값인 경우 제출 방지
        if (newArgumentSide === '') {
            alert('논거 제출 입장을 선택해 주세요.');
            return;
        }
        
        console.log(`[변론 제출] 진영: ${newArgumentSide}, 내용: ${newArgument}`);
        // TODO: 새 논거 API 호출 로직 구현
        setNewArgument(''); // 입력 필드 초기화
        setNewArgumentSide(''); // ⭐️ 입장 선택 초기화
        alert('변론이 성공적으로 제출되었습니다!');
    };


    return (
        <div className="bg-white min-h-screen pt-12 pb-20">
            <div className="max-w-6xl mx-auto px-4">
                
                {/* 1. 헤더 및 타이머 */}
                <div className="flex justify-between items-center pb-4 mb-6">
                    <h1 className="text-3xl font-bold text-main">2차 재판</h1>
                    <span className="bg-main-bright p-4 rounded-lg text-md font-medium text-main">{MOCK_DEBATE_DATA.timeLimit}</span>
                </div>

                {/* 2. 상황 설명 */}
                <p className="font-medium mb-8 text-main">{MOCK_DEBATE_DATA.situation}</p>

                {/* 3. 주장 선택 카드 */}
                <div className="flex space-x-8 justify-center mb-12">
                    {/* A. 찬성 블록 */}
                    <div 
                        // ⭐️ 마감 전일 때만 클릭 가능
                        onClick={() => MOCK_DEBATE_DATA.isVoteTime && setSelectedSide('A')}
                        className={clsx(
                            "w-[513px] h-[447px] bg-main-medium rounded-[30px] flex justify-center items-center flex-col",
                            MOCK_DEBATE_DATA.isVoteTime ? 'cursor-pointer' : 'cursor-default', // 마감 후 커서 변경
                            selectedSide === 'A' ? 'border-blue-500 shadow-lg scale-[1.02]' : 'border-gray-300 hover:border-blue-500',
                            // 마감 후 비활성화 스타일
                            !MOCK_DEBATE_DATA.isVoteTime && 'opacity-70' 
                        )}
                    >
                        <h2 className="text-2xl font-bold text-center text-white">A측 입장</h2>
                        <p className="px-20 py-10 text-white">{MOCK_DEBATE_DATA.argumentA}</p>
                    </div>
                    
                    {/* B. 반대 블록 */}
                    <div 
                        // ⭐️ 마감 전일 때만 클릭 가능
                        onClick={() => MOCK_DEBATE_DATA.isVoteTime && setSelectedSide('B')}
                        className={clsx(
                            "w-[513px] h-[447px] bg-main-red rounded-[30px] flex justify-center items-center flex-col",
                            MOCK_DEBATE_DATA.isVoteTime ? 'cursor-pointer' : 'cursor-default', // 마감 후 커서 변경
                            selectedSide === 'B' ? 'border-red-500 shadow-lg scale-[1.02]' : 'border-gray-300 hover:border-red-500',
                            // 마감 후 비활성화 스타일
                            !MOCK_DEBATE_DATA.isVoteTime && 'opacity-70'
                        )}
                    >
                        <h2 className="text-2xl font-bold text-center text-white">B측 입장</h2>
                        <p className="px-20 py-10 text-white">{MOCK_DEBATE_DATA.argumentB}</p>
                    </div>
                </div>

                {/* 4. 투표하기 버튼 */}
                <div className="flex justify-center mb-12">
                    {MOCK_DEBATE_DATA.isVoteTime ? (
                        <Button 
                            variant="trialStart" 
                            size="lg" 
                            onClick={handleVote}
                            disabled={!selectedSide} 
                            className="w-[585px] h-[123px] rounded-[30px]"
                        >
                            {isVoted ? '재투표하기' : '투표하기'}
                        </Button>
                    ) : (
                        // ⭐️ 투표 마감 시 버튼 역할 변경
                        <Button 
                            variant="trialStart" 
                            size="lg" 
                            className="w-[585px] h-[123px] rounded-[30px]"
                            onClick={() => navigate(PATHS.SECOND_TRIAL_FINAL)} // ⭐️ 최종 페이지 이동 함수 연결
                        >
                            투표 결과보기
                        </Button>
                    )}
                </div>
                
                {/* 5. 변론 입력 섹션 (마감 시간 후 숨김) */}
                {MOCK_DEBATE_DATA.isArgumentTime && (
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
                                        className="w-full bg-white border-main-medium" // w-full 명시적 적용
                                    />
                                </div>
                            </div>
                            
                            <div className="flex justify-end">
                                <Button 
                                    variant="primary" 
                                    className="mt-2"
                                    onClick={handleSubmitArgument}
                                    disabled={!newArgument.trim()}
                                >
                                    등록하기
                                </Button>
                            </div>
                        </div>
                    </>
                )}
                
                {/* 탭 네비게이션 */}
                <div className="flex space-x-2 mb-6 pb-2">
                    {['all', 'A', 'B'].map((tab) => (
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
                            {tab === 'all' ? `전체 (${DUMMY_ARGUMENTS.length})` : tab === 'A' ? `A 의견 (${DUMMY_ARGUMENTS.filter(a => a.side === 'A').length})` : `B 의견 (${DUMMY_ARGUMENTS.filter(a => a.side === 'B').length})`}
                        </Button>
                    ))}
                </div>

                {/* 논거 목록 */}
                <div>
                    {filteredArguments.length > 0 ? (
                        filteredArguments.map(arg => (
                            <ArgumentCard 
                                key={arg.id} 
                                argument={arg}
                                onSubmitReply={handleSubmitReply} // 대댓글 제출 함수 전달
                            />
                        ))
                    ) : (
                        <p className="text-center text-main py-10 bg-gray-50 rounded-lg">
                            제출된 변론 논거가 없습니다. 첫 논거를 작성해 보세요!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SecondTrial_1;