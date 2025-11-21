import { useMutation } from "@tanstack/react-query";
import { postVsArgument } from "@/apis/vsMode/vsModeApi";

export const useSubmitVsArgument = () =>
  useMutation({
    mutationFn: postVsArgument,
  });
