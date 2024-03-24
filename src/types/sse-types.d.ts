export type SSETask = {
  taskId: string;
  taskType: SSETaskType;
  result?: string;
  message?: string;
  completed: boolean;
  error?: boolean;
  createdAt?: Date;
  completedAt?: Date;
};

export type SSETaskType = "TASK_AI_API_GEN";

export type SSEEmitInputs = SSETask & {
  requestBody: any;
};

export type SSEEmitOutputs = SSETask;
