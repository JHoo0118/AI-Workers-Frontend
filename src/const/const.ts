import { SSETaskType } from "@/types/sse-types";

export const REFRESH_TOKEN = "refreshToken";
export const SHOULD_ADD_ACCESS_TOKEN = "shouldAddAccessToken";
export const ACCESS_TOKEN = "accessToken";
export const USER = "user";
export const FORWARD_URL = "forwardUrl";
export const LOCALE = "locale";

export const EVENT_SOURCE_CONNECTION_LIMIT = 2;

export const TASK_LABEL: Record<SSETaskType, string> = {
  TASK_AI_API_GEN: "AI Backend Code 생성",
};

export const TASK_ROUTE_PATH: Record<SSETaskType, string> = {
  TASK_AI_API_GEN: "/ai/code/apigen",
};
