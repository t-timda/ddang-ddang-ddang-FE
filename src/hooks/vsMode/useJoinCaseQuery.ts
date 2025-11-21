import { useQuery } from "@tanstack/react-query";
import { getVsCaseDetail } from "@/apis/vsMode/vsModeApi";

export const useJoinCaseQuery = (caseId: number | null) =>
  useQuery({
    queryKey: ["vsCaseDetail", caseId],
    queryFn: () => getVsCaseDetail(caseId!),
    enabled: !!caseId,
  });
