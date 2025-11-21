import { useEffect } from "react";
import FileIcon from "@/assets/svgs/VsLoading.svg?react";
import { useVsModeStore } from "@/stores/vsModeStore";

export default function VsLoading() {
  const { next } = useVsModeStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      next(); // result로 이동
    }, 3000);

    return () => clearTimeout(timer);
  }, [next]);

  return (
    <div className="flex flex-col items-center bg-white mx-auto w-full max-w-[1440px] pb-[80px] min-h-screen text-[#203C77] font-[Pretendard]">
      <h1 className="text-[38px] font-bold text-center mt-[78px] leading-[150%]">
        초심
      </h1>

      <div className="flex flex-col items-center justify-center mt-[100px] w-[833px] h-[548px] rounded-[100px] bg-main-medium/20">
        <FileIcon
          className="w-[448px] h-[448px] mb-[4px]"
          title="로딩 아이콘"
        />
        <p className="text-[36px] font-bold leading-tight">입장문 제출중...</p>
      </div>
    </div>
  );
}
