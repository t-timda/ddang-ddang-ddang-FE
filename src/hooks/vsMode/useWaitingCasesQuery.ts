import { useQuery } from "@tanstack/react-query";
import { getWaitingVsCases } from "@/apis/vsMode/vsModeApi";

export const useWaitingVsCasesQuery = () =>
  useQuery({
    queryKey: ["waitingVsCases"],
    queryFn: getWaitingVsCases,
  });
