import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Logo from "@/assets/svgs/logo.svg?react";
import { PATHS } from "@/constants";
import { usePostLoginMutation } from "@/hooks/auth/useAuthMutations";

export default function LoginPage() {
  // 입력 상태
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const { mutate: postLogin, isPending } = usePostLoginMutation({
    onSuccess: () => {
      setErrorMessage(null);
      navigate(PATHS.ROOT);
    },
    onError: error => {
      setErrorMessage(error.message || "로그인에 실패했습니다.");
    },
  });

  const isSubmitDisabled = !userId || !password || isPending;

  // 폼 제출 핸들러(연동 지점)
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    postLogin({
      email: userId,
      password,
    });
  };

  return (
    <main className="min-h-screen w-full bg-white">
      {/* 로그인 카드 배치 */}
      <section className="mt-[284.5px] flex w-full justify-center">
        {/* 남색 카드 컨테이너 */}
        <div
          className="rounded-[30px] px-[205px] py-[92px] flex flex-col items-center"
          style={{ background: "var(--Main-Main, #203C77)" }}
        >
          {/* 로고 영역 */}
          <div className="w-full flex justify-center">
            <Logo className="w-[380px] h-auto rotate-[1.317deg]" />
          </div>

          {/* 로고와 폼 간 간격 */}
          <div className="h-[56px]" />

          {/* 로그인 폼 */}
          <form onSubmit={onSubmit} className="w-[380px]">
            {/* ID 입력 */}
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="ID"
              className="
                w-full h-[79px] rounded-[10px]
                bg-[var(--main-main-bright,#E8F2FF)]
                px-[57px]
                text-[16px] font-normal text-[color:#203C77]
                outline-none placeholder:text-[color:#203C77]
              "
              style={{ fontFamily: "Pretendard" }}
            />

            {/* ID와 PW 간 간격 */}
            <div className="h-[24px]" />

            {/* Password 입력 */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="
                w-full h-[79px] rounded-[10px]
                bg-[var(--main-main-bright,#E8F2FF)]
                px-[57px]
                text-[16px] font-normal text-[color:#203C77]
                outline-none placeholder:text-[color:#203C77]
              "
              style={{ fontFamily: "Pretendard" }}
            />

            <div className="mt-[18px] flex w-full justify-between items-start">
              {/* 회원가입 링크 텍스트 */}
              <Link
                to={PATHS.SIGNUP}
                className="text-[16px] font-normal leading-[normal]"
                style={{
                  color:
                    "var(--main-main-bright, var(--color-main-bright, #E8F2FF))",
                  fontFamily: "Pretendard",
                }}
              >
                회원가입
              </Link>

            {/* 오류 메시지 */}
            {errorMessage && (
              <p className="mt-2 text-sm text-main-red" role="alert">
                {errorMessage}
              </p>
            )}

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="
                      rounded-[10px] bg-white px-[47px] py-[10px]
                      cursor-pointer
                      transition-opacity duration-100
                      hover:opacity-90
                      focus:outline-none
                    "
                    aria-busy={isPending}
              >
                <span
                  className="font-bold text-[20px] leading-[150%]"
                  style={{ color: "#203C77", fontFamily: "Pretendard" }}
                >
                  {isPending ? "로그인 중..." : "로그인"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
