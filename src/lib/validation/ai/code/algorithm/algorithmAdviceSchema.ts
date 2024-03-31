import { z } from "zod";

export const algorithmAdviceGenerateSchema = z.object({
  userInput: z.string().min(1, { message: "설명을 적어주세요." }),
  lang: z.string().min(1),
});

export type AlgorithmAdviceGenerateSchema = z.infer<
  typeof algorithmAdviceGenerateSchema
>;
