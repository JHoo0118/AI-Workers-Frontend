import { TASK_LABEL, TASK_ROUTE_PATH } from "@/const/const";
import { SSETaskType } from "@/types/sse-types";

export function getTaskTypeLabel(taskType: SSETaskType): string {
  return TASK_LABEL[taskType];
}

export function getRoutePathByTaskType(
  locale: string,
  taskType: SSETaskType,
): string {
  return `/${locale}/${TASK_ROUTE_PATH[taskType]}`;
}
