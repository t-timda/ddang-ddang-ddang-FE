import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/common/Button";
import { PATHS } from "@/constants";
import ScaleIcon from "@/assets/svgs/Scale.svg?react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-98px)] bg-white px-6 text-center">
      {/* 애니메이션 아이콘 */}
      <motion.div
        initial={{ rotate: -20, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-8"
      >
        <ScaleIcon className="w-[120px] h-[120px] md:w-[180px] md:h-[180px] text-main-medium" />
      </motion.div>

      {/* 404 텍스트 */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-6xl md:text-8xl font-bold text-main mb-4"
        style={{ fontFamily: "Pretendard" }}
      >
        404
      </motion.h1>

      {/* 설명 텍스트 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-10"
      >
        <p className="text-xl md:text-2xl font-bold text-main mb-2">
          페이지를 찾을 수 없습니다
        </p>
        <p className="text-sm md:text-base text-gray-600">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
      </motion.div>

      {/* 버튼 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate(PATHS.ROOT)}
          className="px-8 py-4 text-lg font-semibold"
        >
          홈으로 돌아가기
        </Button>
      </motion.div>
    </div>
  );
}
