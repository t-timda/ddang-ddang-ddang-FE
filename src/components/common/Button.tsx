import clsx from "clsx";

// Button 컴포넌트의 props 타입 정의
type ButtonProps = {
  children: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "third"
    | "navbar"
    | "ghost"
    | "trialStart"
    | "white"
    | "bright_main";
  size?: "sm" | "md" | "lg"; // 버튼 크기
  isLoading?: boolean; // 로딩 상태
  className?: string; // 추가적인 클래스네임(승찬이형 pr 반영)
} & React.ComponentPropsWithoutRef<"button">; // 기본 button 속성들 포함

// Button 컴포넌트 정의
const Button = ({
  // Button 컴포넌트의 props (디폴트 값 포함)
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "", // className prop의 기본값 설정
  ...rest // 나머지 button 속성들 (onClick, disabled 등)
}: ButtonProps) => {
  const baseStyles =
    "transition-colors flex items-center justify-center text-center font-[Pretendard]"; // 공통 스타일만 남김

  const variantStyles = {
    // primary와 secondary 스타일 정의 -> 와이어프레임 나오면 그거에 맞게 색상 수정해야 할 것 같습니다.
    // primary와 secondary에 패딩, 폰트 굵기, 둥근 모서리 스타일 포함 (승찬이형 pr 반영)
    primary:
      "bg-main hover:opacity-90 text-white font-bold py-2 px-4 rounded", // 🔹 기본 버튼 (예: 공통 테스트용) + main으로 색 변경 및 text 화이트

    // 솔로모드 버튼
    secondary:
      "bg-[#809AD2] text-white text-[36px] font-normal rounded-[15px] hover:opacity-90 leading-none whitespace-nowrap", // FirstTrialStart 솔로모드 버튼

    // VS모드 버튼
    third:
      "bg-[#EB9292] text-white text-[36px] font-normal rounded-[15px] hover:opacity-90 leading-none whitespace-nowrap", // FirstTrialStart VS모드 버튼

    // 재판 시작하기 버튼
    trialStart:
      "bg-[#203C77] text-white text-[36px] font-bold rounded-[15px] hover:opacity-90 leading-none whitespace-nowrap", // FirstTrialStart 재판 시작하기 버튼

    white:
      "bg-white text-main font-bold font-[Pretendard] py-2 px-4 hover:bg-gray-100", // 흰색 배경 버튼
   
    bright_main:
      "bg-[#C0DCFF] text-main font-bold font-[Pretendard] py-2 px-4 rounded-3xl hover:opacity-90", // Main 페이지의 중간색 버튼

    // Navbar의 LOGIN 버튼
    navbar:
      "box-border px-[37px] py-[10px] rounded-[33px] bg-[#FFFFFF] text-[#000000] font-[Pretendard] text-[20px] font-normal leading-normal hover:bg-gray-100", // Navbar 로그인 버튼

    ghost:
      "bg-transparent text-black hover:bg-gray-200 font-bold py-2 px-4 rounded",
  };

  const sizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const finalClassName = clsx(
    // 클래스네임 조합(base, variant, size, 로딩 상태, 추가 클래스네임)
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    isLoading && "opacity-50 cursor-not-allowed",
    className
  );

  return (
    <button
      {...rest}
      className={finalClassName}
      disabled={isLoading || rest.disabled}
    >
      {/* 로딩 중이면 스피너 또는 텍스트 표시, 아니면 원래 children 표시 */}
      {isLoading ? (
        <>
          {/* 간단한 로딩 스피너 예시 (Tailwind 애니메이션 사용) */}
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          처리 중...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
