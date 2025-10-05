import Textarea from "@/components/common/textarea";
import { useState } from "react";

export default function Main() {
  const [controlledValue, setControlledValue] = useState("");

  return (
    <div>
      {/* 본문 */}
      <div className="text-yellow-400 mt-10 text-center text-2xl">
        Main 페이지입니다.
      </div>
    </div>
  );
}
