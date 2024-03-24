import { fetchInterceptors } from "@/lib/utils/fetch";
import { SSEEmitInputs } from "@/types/sse-types";

export async function sseEmit(sseEmitInputs: SSEEmitInputs): Promise<any> {
  return fetchInterceptors({
    url: "/py-api/sse/emit",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sseEmitInputs),
    },
    isRequiredAccessToken: true,
  });
}
