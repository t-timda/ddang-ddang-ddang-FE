import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "@/components/common/Button";
import Logo from "@/assets/svgs/logo.svg?react"; // svgr 컴포넌트 사용
import { HIDE_NAV_STEPS_BY_PATH, PATHS } from "@/constants";
import { useThirdTrialStore } from "@/stores/thirdTrialStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useVsModeStore } from "@/stores/vsModeStore";

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isLogin } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 경로와 스텝에 따라 네브바 노출 제어
  let hide = false;
  const step = useThirdTrialStore((s) => s.step);
  
  if (pathname === PATHS.THIRD_TRIAL) {
    const hiddenSet = HIDE_NAV_STEPS_BY_PATH[PATHS.THIRD_TRIAL];
    hide = hiddenSet?.has(step) ?? false;
  }

  if (hide) return null;

  const handleVsModeClick = () => {
    useVsModeStore.getState().reset(); // VS 모드 초기화
    navigate("/vs-mode");
  };

  const handleMenuItemClick = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false); // 메뉴 아이템 클릭 시 패널 닫기
  };

  return (
    <>
      <nav
        className="flex items-center justify-between w-full h-[98px] bg-[#203C77]
                      px-6 sm:px-10 md:px-[40px] lg:px-[60px]"
      >
        {/* 로고 */}
        <button
          type="button"
          onClick={() => navigate(PATHS.ROOT)}
          className="inline-flex items-center"
        >
          <Logo
            className="h-[40px] sm:h-[46.88px] w-auto"
            title="땅!땅!땅! 로고"
          />
        </button>

        {/* 데스크톱 메뉴 (md 이상에서만 표시) */}
        {isLogin ? (
          <div className="hidden md:flex gap-8">
            <Button
              variant="none"
              onClick={() => navigate(PATHS.TRIAL_ARCHIVE)}
              className="text-white text-xl"
            >
              재판 아카이브
            </Button>
            <Button
              variant="none"
              onClick={handleVsModeClick}
              className="text-white text-xl"
            >
              재판 매칭
            </Button>
            <Button
              variant="none"
              onClick={() => navigate(PATHS.MY_PAGE)}
              className="text-white text-xl"
            >
              마이페이지
            </Button>
            <Button
              variant="navbar"
              onClick={() => {useAuthStore.getState().setLogout(); navigate(PATHS.ROOT);}}
              className="h-[40px] sm:h-[44px] px-[30px] sm:px-[37px]"
            >
              LOGOUT
            </Button>
          </div>
        ) : (
          <div className="hidden md:flex gap-8">
            <Button
              variant="none"
              onClick={() => navigate(PATHS.TRIAL_ARCHIVE)}
              className="text-white text-xl"
            >
              재판 아카이브
            </Button>
            <Button
              variant="none"
              onClick={handleVsModeClick}
              className="text-white text-xl"
            >
              재판 매칭
            </Button>
            <Button
              variant="navbar"
              onClick={() => navigate(PATHS.LOGIN)}
              className="h-[40px] sm:h-[44px] px-[30px] sm:px-[37px]"
            >
              LOGIN
            </Button>
          </div>
        )}

        {/* 햄버거 버튼 (md 미만에서만 표시) */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex flex-col gap-[5px] w-8 h-8 justify-center items-center relative z-[60]"
          aria-label="메뉴 열기"
        >
          <span className={`w-7 h-[3px] bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`} />
          <span className={`w-7 h-[3px] bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-7 h-[3px] bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
        </button>
      </nav>

      {/* 모바일 슬라이드 패널 */}
      <div
        className={`fixed top-[98px] right-0 h-[calc(100vh-98px)] w-72 bg-main
                    border-l-4 border-main-medium shadow-[-8px_0_24px_rgba(0,0,0,0.2)]
                    transform transition-all duration-300 ease-in-out md:hidden z-50
                    ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col p-6 gap-2">
          {isLogin ? (
            <>
              <Button
                variant="none"
                onClick={() => handleMenuItemClick(() => navigate(PATHS.TRIAL_ARCHIVE))}
                className="text-white text-lg text-left py-4 px-4 rounded-lg hover:bg-main-medium/30 transition-colors"
              >
                재판 아카이브
              </Button>
              <Button
                variant="none"
                onClick={() => handleMenuItemClick(handleVsModeClick)}
                className="text-white text-lg text-left py-4 px-4 rounded-lg hover:bg-main-medium/30 transition-colors"
              >
                재판 매칭
              </Button>
              <Button
                variant="none"
                onClick={() => handleMenuItemClick(() => navigate(PATHS.MY_PAGE))}
                className="text-white text-lg text-left py-4 px-4 rounded-lg hover:bg-main-medium/30 transition-colors"
              >
                마이페이지
              </Button>
              <div className="border-t border-main-medium/30 my-3" />
              <Button
                variant="navbar"
                onClick={() => handleMenuItemClick(() => {
                  useAuthStore.getState().setLogout();
                  navigate(PATHS.ROOT);
                })}
                className="h-[48px] px-[30px] w-full hover:bg-gray-100 transition-colors"
              >
                LOGOUT
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="none"
                onClick={() => handleMenuItemClick(() => navigate(PATHS.TRIAL_ARCHIVE))}
                className="text-white text-lg text-left py-4 px-4 rounded-lg hover:bg-main-medium/30 transition-colors"
              >
                재판 아카이브
              </Button>
              <Button
                variant="none"
                onClick={() => handleMenuItemClick(handleVsModeClick)}
                className="text-white text-lg text-left py-4 px-4 rounded-lg hover:bg-main-medium/30 transition-colors"
              >
                재판 매칭
              </Button>
              <div className="border-t border-main-medium/30 my-3" />
              <Button
                variant="navbar"
                onClick={() => handleMenuItemClick(() => navigate(PATHS.LOGIN))}
                className="h-[48px] px-[30px] w-full hover:bg-gray-100 transition-colors"
              >
                LOGIN
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 모바일 오버레이 (패널 외부 클릭 시 닫기) */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-main/60 backdrop-blur-sm md:hidden z-40 top-[98px]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
