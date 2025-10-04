import Textarea from "@/components/common/textarea";
import { useState } from "react";

export default function Main() {
  const [controlledValue, setControlledValue] = useState("");

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Textarea 데모</h1>

      {/* 기본: minRows=2, maxRows=6 (언컨트롤드) */}
      <section className="space-y-2">
        <h2 className="text-lg font-medium">기본 (minRows=3, maxRows=6)</h2>
        <Textarea
          minRows={3}
          maxRows={6}
          placeholder="여기에 입력해보세요"
          defaultValue={"기본 예시입니다.\n줄을 늘려보세요."}
        />
      </section>

      {/* 무제한 확장: maxRows 미지정 */}
      <section className="space-y-2">
        <h2 className="text-lg font-medium">무제한 확장 (maxRows 없음)</h2>
        <Textarea
          minRows={1}
          placeholder="길게 입력해도 계속 늘어납니다"
        />
      </section>

      {/* 작은 상한선: 스크롤 생김 */}
      <section className="space-y-2">
        <h2 className="text-lg font-medium">작은 상한선 (minRows=1, maxRows=3)</h2>
        <Textarea
          minRows={1}
          maxRows={3}
          placeholder="3줄까지만 늘어나고, 넘치면 스크롤됩니다"
        />
      </section>

      {/* 컨트롤드: 글자수 카운터 */}
      <section className="space-y-2">
        <h2 className="text-lg font-medium">컨트롤드 + 글자수</h2>
        <Textarea
          minRows={2}
          maxRows={8}
          value={controlledValue}
          onChange={(e) => setControlledValue(e.target.value)}
          placeholder="상태로 제어되는 텍스트에리아"
        />
        <div className="text-sm text-gray-500">글자수: {controlledValue.length}</div>
      </section>
    </div>
  );
}
