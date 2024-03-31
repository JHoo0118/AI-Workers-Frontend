import { fetchInterceptors } from "@/lib/utils/fetch";
import {
  AlgorithmAdviceGenerateSchema,
  algorithmAdviceGenerateSchema,
} from "@/lib/validation/ai/code/algorithm/algorithmAdviceSchema";
import { SqlToEntityOutputs } from "@/types/ai-types";

export async function algorithmAdviceGenerate(
  algorithmAdviceGenerateSchemaInputs: AlgorithmAdviceGenerateSchema,
): Promise<SqlToEntityOutputs> {
  const parseResult = algorithmAdviceGenerateSchema.safeParse(
    algorithmAdviceGenerateSchemaInputs,
  );

  if (!parseResult.success) {
    console.error(parseResult.error);
    throw new Error(parseResult.error.toString());
  }

  return fetchInterceptors({
    url: "/py-api/ai/code/algorithm/generate",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parseResult.data),
    },
    isRequiredAccessToken: true,
  });
}
