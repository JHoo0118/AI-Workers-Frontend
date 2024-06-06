import { fetchInterceptors } from "@/lib/utils/fetch";
import {
  DocsServeAgentEmbedOutputs,
  DocsServeAgentOutputs,
} from "@/types/ai-types";

export async function docsSummary(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return fetchInterceptors({
    url: "/py-api/ai/docs/summary",
    options: {
      method: "POST",
      body: formData,
    },
    isMultipart: true,
    isRequiredAccessToken: true,
  });
}

export async function docsSummaryAgent(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return fetchInterceptors({
    url: "/py-api/ai/docs/summary/agent",
    options: {
      method: "POST",
      body: formData,
    },
    isMultipart: true,
    isRequiredAccessToken: true,
  });
}
export async function docsServeSummaryEmbed(
  file: File,
): Promise<DocsServeAgentEmbedOutputs> {
  const formData = new FormData();
  formData.append("file", file);

  return fetchInterceptors({
    url: "/py-api/ai/docs/summary/embed-serve",
    options: {
      method: "POST",
      body: formData,
    },
    isMultipart: true,
    isRequiredAccessToken: true,
  });
}

export async function docsServeAgent(
  file: File,
): Promise<DocsServeAgentOutputs> {
  const formData = new FormData();
  formData.append("file", file);

  return fetchInterceptors({
    url: "/py-api/ai/docs/ask/serve",
    options: {
      method: "POST",
      body: formData,
    },
    isMultipart: true,
    isRequiredAccessToken: true,
  });
}
