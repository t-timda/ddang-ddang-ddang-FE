import ArgumentCard from "@/components/common/ArgumentCard"

export default function MyPage() {
  // ArgumentData 객체 생성
  const argumentData1 = {
    id: 1,
    userNickname: "timda",
    userDgree: "천원짜리 변호사", 
    content: "변호 시간 남았을때 컴포넌츠입니다. (대댓글 가능)",
    likes: 10,
    isBest: false, // isBest는 boolean 타입이므로 값을 명시해야 함
    isReplyable: true,
    side: 'A' as 'A' | 'B', // side 속성은 'A' 또는 'B' 타입으로 명시
  };
  const argumentData2 = {
    id: 2,
    userNickname: "T.timda",
    userDgree: "만원짜리 변호사",
    content: "변호 시간 넘겼을때 컴포넌츠입니다. (대댓글 불가)",
    likes: 5,
    isBest: true,
    isReplyable: false,
    side: 'B' as 'A' | 'B',
  };

  return (
    <div className="p-10">
      <ArgumentCard
        argument={argumentData1}
        onSubmitReply={(payload) => {
          console.log("대댓글 제출:", payload); 
        }}
      />
      <ArgumentCard
        argument={argumentData2}
        onSubmitReply={(payload) => {
          console.log("대댓글 제출:", payload);
        }}
      />
    </div>
  );
}