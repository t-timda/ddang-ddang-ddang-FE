import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { firstTrialApi } from "@/apis/firstTrial/firstTrialApi";

export const useCreateFirstCaseMutation = () =>
  useMutation({ mutationFn: firstTrialApi.postFirstTrialCreate });

export const useFirstCaseDetailQuery = (caseId?: number) =>
  useQuery({
    queryKey: ["first-trial", "case", caseId],
    queryFn: () => firstTrialApi.getFirstTrialDetail(caseId as number),
    enabled: !!caseId,
  });

export const useFirstJudgmentQuery = (
  caseId?: number,
  refetchInterval?: number
) =>
  useQuery({
    queryKey: ["first-trial", "case", caseId, "judgment"],
    queryFn: () => firstTrialApi.getFirstTrialJudgment(caseId as number),
    enabled: !!caseId,
    refetchInterval,
  });

export const usePatchFirstCaseDone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ caseId }: { caseId: number }) =>
      firstTrialApi.patchFirstTrialStatus(caseId, { status: "DONE" }),
    onSuccess: (_d, v) => {
      qc.invalidateQueries({ queryKey: ["first-trial", "case", v.caseId] });
    },
  });
};
