import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PATHS } from "@/constants";
import PasswordIcon from "@/assets/svgs/password.svg?react";
import Logo from "@/assets/svgs/logo.svg?react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [pw, setPw] = useState("");
  const [emailLocal, setEmailLocal] = useState("");
  const [emailDomain, setEmailDomain] = useState(""); // placeholder 상태
  const [code, setCode] = useState("");
  const [showPw, setShowPw] = useState(false);
  const nav = useNavigate();

  const email = useMemo(
    () =>
      emailLocal && emailDomain !== "" ? `${emailLocal}@${emailDomain}` : "",
    [emailLocal, emailDomain]
  );
  const canSendCode = useMemo(
    () => emailLocal.trim().length > 0 && emailDomain !== "",
    [emailLocal, emailDomain]
  );
  const canSubmit = useMemo(
    () => !!(name && userId && pw && code.trim().length > 0),
    [name, userId, pw, code]
  );

  const handleSendCode = () => {
    if (!canSendCode) return;
    const rand = String(Math.floor(100000 + Math.random() * 900000));
    alert(`인증코드가 전송되었습니다: ${rand}`);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    console.log({ name, userId, pw, email });
    alert("회원가입 완료!");
    nav(PATHS.LOGIN);
  };

  return (
    <main className="min-h-screen w-full bg-white">
      <section className="mt-[160px] mb-[160px] flex w-full justify-center">
        <div className="flex w-[860px] flex-col items-stretch rounded-[30px] px-[60px] py-[60px] bg-main">
          {/* 로고 */}
          <div className="flex w-full justify-center">
            <Logo className="h-auto w-[380px] rotate-[1.317deg]" />
          </div>
          <div className="h-[56px]" />

          <form onSubmit={onSubmit} className="w-full space-y-6">
            <Field
              label="닉네임"
              placeholder="닉네임을 입력해주세요"
              value={name}
              onChange={setName}
            />
            <Field
              label="아이디"
              placeholder="아이디를 입력해주세요"
              value={userId}
              onChange={setUserId}
            />

            {/* 비밀번호 */}
            <div className="flex flex-col gap-2">
              <Label>비밀번호</Label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="비밀번호를 입력해주세요"
                  className="
                    h-[64px] w-full rounded-[10px]
                    bg-main-bright px-[20px] pr-[52px]
                    text-[16px] text-main outline-none
                    placeholder:text-main
                    focus:ring-2 focus:ring-main-medium
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보기"}
                >
                  <PasswordIcon className="h-[20px] w-[20px] opacity-80" />
                </button>
              </div>
            </div>

            {/* 이메일 */}
            <div className="flex flex-col gap-2">
              <Label>이메일</Label>

              <div className="grid grid-cols-[1fr_1fr_0.8fr] gap-[24px]">
                <input
                  type="text"
                  value={emailLocal}
                  onChange={(e) => setEmailLocal(e.target.value)}
                  placeholder="이메일을 입력해주세요"
                  aria-label="이메일 아이디"
                  className="
                    h-[56px] min-w-0 rounded-[15px] px-[20px]
                    bg-main-bright text-[16px] text-main outline-none
                    placeholder:text-main-medium
                    focus:ring-2 focus:ring-main-medium
                  "
                />

                <div className="relative min-w-0">
                  <select
                    value={emailDomain}
                    onChange={(e) => setEmailDomain(e.target.value)}
                    aria-label="이메일 도메인 선택"
                    className={`
                      h-[56px] w-full appearance-none rounded-[15px]
                      pl-[20px] pr-[38px] text-[16px] outline-none
                      bg-main-bright focus:ring-2 focus:ring-main-medium
                      ${emailDomain === "" ? "text-main-medium" : "text-main"}
                    `}
                  >
                    <option value="" disabled hidden>
                      이메일 주소 선택
                    </option>
                    <option value="naver.com">@naver.com</option>
                    <option value="gmail.com">@gmail.com</option>
                    <option value="daum.net">@daum.net</option>
                  </select>

                  <svg
                    className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-main-medium"
                    />
                  </svg>
                </div>

                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={!canSendCode}
                  aria-label="인증코드 보내기"
                  className={`
                    h-[56px] rounded-[15px] px-[16px]
                    bg-white text-main font-bold transition-opacity duration-100
                    ${
                      canSendCode
                        ? "hover:opacity-90"
                        : "cursor-not-allowed opacity-50"
                    }
                  `}
                >
                  인증코드 보내기
                </button>
              </div>
            </div>

            <Field
              label="이메일 인증코드"
              placeholder="이메일로 전송된 인증 코드를 입력해주세요"
              value={code}
              onChange={setCode}
            />

            <div className="flex items-start justify-between pt-2">
              <Link to={PATHS.LOGIN} className="text-[16px] text-main-bright">
                로그인
              </Link>

              <button
                type="submit"
                disabled={!canSubmit}
                className={`
                  rounded-[10px] bg-white px-6 py-3
                  ${
                    canSubmit
                      ? "hover:opacity-90"
                      : "cursor-not-allowed opacity-50"
                  }
                `}
              >
                <span className="text-[20px] font-bold leading-[150%] text-main">
                  회원가입하기
                </span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-[14px] text-main-bright">{children}</span>;
}

function Field({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          h-[56px] w-full rounded-[10px]
          bg-main-bright px-[16px]
          text-[16px] text-main outline-none
          placeholder:text-main
          focus:ring-2 focus:ring-main-medium
        "
      />
    </div>
  );
}
