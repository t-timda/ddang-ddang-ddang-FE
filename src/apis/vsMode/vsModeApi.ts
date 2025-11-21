import instance from "@/apis/instance";

const BASE = "/api/v1/cases";

/* VS 모드 매칭 대기 목록 */
export const getWaitingVsCases = async () => {
  const { data } = await instance.get(`${BASE}/pending`);
  return data;
};

/* VS 모드 사건 상세 조회 */
export const getVsCaseDetail = async (caseId: number) => {
  const { data } = await instance.get(`${BASE}/${caseId}`);
  return data;
};

/* VS 모드 B측 의견 제출 */
export const postVsArgument = async ({
  caseId,
  mainArgument,
  reasoning,
}: {
  caseId: number;
  mainArgument: string;
  reasoning: string;
}) => {
  const { data } = await instance.post(`${BASE}/${caseId}/arguments`, {
    mainArgument,
    reasoning,
  });
  return data;
};
