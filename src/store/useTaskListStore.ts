import { SSETask, SSETaskType } from "@/types/sse-types";
import { create } from "zustand";

// type EventSourceWithTask = Record<string, EventSource>;
type EventSourceWithTask = Record<string, ReadableStream<Uint8Array>>;

type TaskListState = {
  taskList: SSETask[];
  eventSources: EventSourceWithTask;
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
};

export const useTaskListStore = create<TaskListState>((set, get) => ({
  taskList: [],
  eventSources: {},
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
  removeEventSource: (taskId: string) =>
    set((state) => {
      const { [taskId]: _, ...remainingSources } = state.eventSources;
      return { ...state, eventSources: remainingSources };
    }),
}));
