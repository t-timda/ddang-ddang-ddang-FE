import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import { PATHS } from "@/constants";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-[#000000] px-6 text-center">
      <h1 className="text-5xl font-bold mb-6">404</h1>
      <p className="text-xl mb-10">
        요청하신 페이지를 찾을 수 없습니다.
      </p>
      <Button variant="secondary" onClick={() => navigate(PATHS.ROOT)}>
        홈으로 돌아가기
      </Button>
    </div>
  );
}
