import { api } from "@/lib/axios-instance/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type RateType = "quiz" | "content";

interface RateParams {
  id: string;
  slug: string;
  rating: number;
}

export const useRate = (type: RateType) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, rating }: RateParams) => {
      if (type === "quiz")
        return api.patch(`/quizzes/${id}/rates`, { rating });
      if (type === "content")
        return api.patch(`/contents/${id}/rates`, { rating });
    },
    onSuccess: (_, { id, slug }) => {
      if (type === "quiz")
        queryClient.invalidateQueries({
          queryKey: ["quizzes", id],
        });
      if (type === "content")
        queryClient.invalidateQueries({ queryKey: ["contents", slug] });
    },
  });
};
