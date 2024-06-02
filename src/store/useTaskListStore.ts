import { SSETask, SSETaskType } from "@/types/sse-types";
import { create } from "zustand";

// type EventSourceWithTask = Record<string, EventSource>;
type EventSourceWithTask = Record<string, ReadableStream<Uint8Array>>;

type TaskListState = {
  taskList: SSETask[];
  eventSources: EventSourceWithTask;
  backupData: Record<string, any>;
  setTaskList: (tasks: SSETask[]) => void;
  updateTask: (task: Partial<SSETask>) => void;
  getTask: (taskId: string) => SSETask | undefined;
  getTaskByTaskType: (taskType: SSETaskType) => SSETask | undefined;
  removeTaskByTaskType: (taskType: SSETaskType) => void;
  checkNotCompletedTaskByTaskType: (taskType: SSETaskType) => boolean;
  // addEventSource: (taskId: string, eventSource: EventSource) => void;
  addEventSource: (
    taskId: string,
    eventSource: ReadableStream<Uint8Array>,
  ) => void;
  removeEventSource: (taskId: string) => void;
  setBackupData: (taskId: string, data: any) => any;
  getBackupData: (taskId: string) => any;
  removeBackupData: (taskId: string) => void;
  removeBackupDataByTaskType: (taskType: SSETaskType) => void;
};

export const useTaskListStore = create<TaskListState>((set, get) => ({
  taskList: [],
  eventSources: {},
  backupData: {},
  setTaskList: (tasks) => set({ taskList: tasks }),
  updateTask: (updatedTaskData: Partial<SSETask>) =>
    set((state) => ({
      taskList: state.taskList.map((task) =>
        task.taskId === updatedTaskData.taskId
          ? { ...task, ...updatedTaskData }
          : task,
      ),
    })),
  getTask: (taskId: string) => {
    const state = get();
    return state.taskList.find((task) => task.taskId === taskId);
  },
  getTaskByTaskType: (taskType: SSETaskType) => {
    const state = get();
    return state.taskList.find((task) => task.taskType === taskType);
  },
  removeTaskByTaskType: (taskType: SSETaskType) =>
    set((state) => ({
      taskList: state.taskList.filter((task) => task.taskType !== taskType),
    })),
  checkNotCompletedTaskByTaskType: (taskType: SSETaskType) => {
    const state = get();
    return !!state.taskList.find(
      (task) => task.taskType === taskType && !task.completed && !task.error,
    )
      ? true
      : false;
  },
  // addEventSource: (taskId: string, eventSource: EventSource) =>
  addEventSource: (taskId: string, eventSource: ReadableStream<Uint8Array>) =>
    set((state) => ({
      ...state,
      eventSources: { ...state.eventSources, [taskId]: eventSource },
    })),
  setBackupData: (taskId: string, data: any) =>
    set((state) => ({
      ...state,
      backupData: { ...state.backupData, [taskId]: data },
    })),
  getBackupData: (taskId: string) => {
    const state = get();
    return state.backupData[taskId];
  },
  removeEventSource: (taskId: string) =>
    set((state) => {
      const { [taskId]: _, ...remainingSources } = state.eventSources;
      return { ...state, eventSources: remainingSources };
    }),
  removeBackupData: (taskId: string) =>
    set((state) => {
      if (state.backupData.hasOwnProperty(taskId)) {
        delete state.backupData[taskId];
      }
      return { ...state };
    }),
  removeBackupDataByTaskType: (taskType: SSETaskType) =>
    set((state) => {
      const task = state.getTaskByTaskType(taskType);
      if (task) {
        state.removeBackupData(task.taskId);
      }
      return { ...state };
    }),
}));
