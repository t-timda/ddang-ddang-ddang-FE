import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import Logo from "@/assets/svgs/logo.svg"; // 로고는 우선 svg로 받아왔는데 로고 확정되면 수정 예정

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav
      className="flex items-center justify-between w-full h-[98px] bg-[#203C77] 
                    px-6 sm:px-10 md:px-[40px] lg:px-[60px]"
    >
      {/* 로고 */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="inline-flex items-center"
      >
        <img
          src={Logo}
          alt="땅!땅!땅! 로고"
          className="h-[40px] sm:h-[46.88px] w-auto"
        />
      </button>

      {/* 로그인 버튼 */}
      <Button
        variant="navbar"
        onClick={() => navigate("/login")}
        className="h-[40px] sm:h-[44px] px-[30px] sm:px-[37px]"
      >
        LOGIN
      </Button>
    </nav>
  );
}
