import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PATHS } from "@/constants";
import PasswordIcon from "@/assets/svgs/password.svg?react";
import Logo from "@/assets/svgs/logo.svg?react";
import {
  useSendEmailCodeMutation,
  useVerifyEmailCodeMutation,
  usePostSignupMutation,
} from "@/hooks/auth/useAuthMutations";
import { isAxiosError } from "axios";

const EMAIL_DOMAIN_OPTIONS = ["naver.com", "gmail.com", "daum.net"];

function getErrorMessage(e: unknown) {
  if (isAxiosError(e)) {
    return e.response?.data?.message || e.message || "요청에 실패했습니다.";
  }
  if (e instanceof Error) return e.message;
  try {
    return JSON.stringify(e);
  } catch {
    return "알 수 없는 오류가 발생했습니다.";
  }
}

export default function SignupPage() {
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [emailLocal, setEmailLocal] = useState("");
  const [emailDomain, setEmailDomain] = useState(""); // placeholder 상태
  const [code, setCode] = useState("");
  const [showPw, setShowPw] = useState(false);
  const nav = useNavigate();
  const emailLocalRef = useRef<HTMLInputElement | null>(null);
  const emailDomainRef = useRef<HTMLSelectElement | null>(null);

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
    () => !!(name && pw && code.trim().length > 0),
    [name, pw, code]
  );

  const sendCodeMut = useSendEmailCodeMutation();
  const verifyCodeMut = useVerifyEmailCodeMutation();
  const signupMut = usePostSignupMutation();

  const handleSendCode = async () => {
    if (!canSendCode || !email) return;
    try {
      await sendCodeMut.mutateAsync({ email });
      alert("인증코드가 이메일로 전송되었습니다.");
    } catch (e: unknown) {
      alert(getErrorMessage(e));
    }
  };

  const handleEmailLocalChange = (rawValue: string) => {
    const atIndex = rawValue.indexOf("@");

    if (atIndex >= 0) {
      const localPart = rawValue.slice(0, atIndex);
      const domainPart = rawValue.slice(atIndex + 1).trim();
      const isSupportedDomain = !!(
        domainPart && EMAIL_DOMAIN_OPTIONS.includes(domainPart)
      );

      setEmailLocal(localPart);

      if (domainPart) {
        if (isSupportedDomain && emailDomain !== domainPart) {
          setEmailDomain(domainPart);
        } else if (!isSupportedDomain && emailDomain !== "") {
          setEmailDomain("");
        }
      } else if (emailDomain !== "") {
        setEmailDomain("");
      }

      emailDomainRef.current?.focus();
      return;
    }

    setEmailLocal(rawValue);
  };

  const handleEmailLocalKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "@") {
      e.preventDefault();
      emailDomainRef.current?.focus();
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !email) return;

    try {
      await verifyCodeMut.mutateAsync({ email, code });
      await signupMut.mutateAsync({ nickname: name, email, password: pw });

      alert("회원가입 완료!");
      nav(PATHS.LOGIN);
    } catch (e: unknown) {
      alert(getErrorMessage(e));
    }
  };

  return (
    <main className="min-h-full w-full bg-white flex flex-col justify-center my-10">
      <section className="flex w-full justify-center">
        <div className="flex flex-col gap-6 items-stretch rounded-[30px] px-20 py-[40px] bg-main">
          {/* 로고 */}
          <div className="flex w-full justify-center">
            <Logo className="h-auto w-[380px] rotate-[1.317deg]" />
          </div>

          {/* 이메일 */}
            <div className="flex flex-col gap-2">
              <Label>이메일</Label>

              <div className="grid grid-cols-[1fr_1fr_0.8fr] gap-[24px]">
                <input
                  ref={emailLocalRef}
                  type="text"
                  value={emailLocal}
                  onChange={(e) => handleEmailLocalChange(e.target.value)}
                  onKeyDown={handleEmailLocalKeyDown}
                  placeholder="이메일을 입력해주세요"
                  aria-label="이메일 아이디"
                  name="email"
                  autoComplete="email"
                  className="
                    h-[56px] min-w-0 rounded-[15px] px-[20px]
                    bg-main-bright text-[16px] text-main outline-none
                    placeholder:text-main-medium
                    focus:ring-2 focus:ring-main-medium
                  "
                />

                <div className="relative min-w-0">
                  <select
                    ref={emailDomainRef}
                    value={emailDomain}
                    onChange={(e) => setEmailDomain(e.target.value)}
                    aria-label="이메일 도메인 선택"
                    name="email-domain"
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
                    {EMAIL_DOMAIN_OPTIONS.map((domain) => (
                      <option key={domain} value={domain}>
                        @{domain}
                      </option>
                    ))}
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
                  disabled={!canSendCode || sendCodeMut.isPending}
                  aria-label="인증코드 보내기"
                  className={`
                    h-[56px] rounded-[15px] px-[16px]
                    bg-white text-main font-bold transition-opacity duration-100
                    ${
                      canSendCode && !sendCodeMut.isPending
                        ? "hover:opacity-90"
                        : "cursor-not-allowed opacity-50"
                    }
                  `}
                >
                  {sendCodeMut.isPending ? "전송중..." : "인증코드 보내기"}
                </button>
              </div>
            </div>

            <Field
              label="이메일 인증코드"
              placeholder="이메일로 전송된 인증 코드를 입력해주세요"
              value={code}
              onChange={setCode}
              name="email-code"
              autoComplete="one-time-code"
            />

          <form onSubmit={onSubmit} className="w-full space-y-6">
            <Field
              label="닉네임"
              placeholder="닉네임을 입력해주세요"
              value={name}
              onChange={setName}
              name="nickname"
              autoComplete="nickname"
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
                  name="password"
                  autoComplete="new-password"
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

            <div className="flex items-start justify-between pt-2">
              <Link to={PATHS.LOGIN}>
                <div
                className="text-[20px] font-bold leading-[150%] bg-main rounded-[10px] text-white px-6 py-3">
                  로그인
                </div>
              </Link>

              <button
                type="submit"
                disabled={
                  !canSubmit || verifyCodeMut.isPending || signupMut.isPending
                }
                className={`
                  rounded-[10px] bg-white px-6 py-3
                  ${
                    canSubmit &&
                    !verifyCodeMut.isPending &&
                    !signupMut.isPending
                      ? "hover:opacity-90"
                      : "cursor-not-allowed opacity-50"
                  }
                `}
              >
                <span className="text-[20px] font-bold leading-[150%] text-main">
                  {verifyCodeMut.isPending || signupMut.isPending
                    ? "처리중..."
                    : "회원가입하기"}
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
  name,
  type = "text",
  autoComplete,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  name?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
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
