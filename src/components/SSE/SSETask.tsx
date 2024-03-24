"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { TASK_LABEL } from "@/const/const";
import { formatDateTime } from "@/lib/utils/dateUtils";
import { useTaskListStore } from "@/store/useTaskListStore";
import { SSEEmitOutputs, SSETaskType } from "@/types/sse-types";
import { CheckCircle, Loader, XCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";

interface SSETaskProps {
  taskId: string;
}

export default function SSETask({ taskId }: SSETaskProps) {
  const { updateTask } = useTaskListStore();
  const task = useTaskListStore((state) =>
    state.taskList.find((t) => t.taskId === taskId),
  )!;

  const prevTaskRef = useRef(task);
  console.log(process.env.NODE_ENV === "development");

  useEffect(() => {
    if (!!prevTaskRef.current) {
      const eventSource = new EventSource(
        // `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/sse/stream/${prevTaskRef.current.taskId}`,
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/sse/stream/${prevTaskRef.current.taskId}`,
        {
          withCredentials: true,
        },
      );

      eventSource.onmessage = (event: MessageEvent<SSEEmitOutputs>) => {
        const data = JSON.parse(event.data) as SSEEmitOutputs;
        console.log(data);
        if (!!data.completed) {
          updateTask(data);
          alert("Long-running API request finished");
          eventSource.close();
        }
      };

      eventSource.onerror = (event) => {};

      // return () => {
      //   eventSource.close();
      // };
    }
    // prevTaskRef.current = task;
  }, [updateTask]);

  function getTaskTypeLabel(taskType: SSETaskType): string {
    return TASK_LABEL[taskType];
  }

  return (
    <TableRow key={task.taskId}>
      <TableCell className="font-medium">
        {getTaskTypeLabel(task.taskType)}
      </TableCell>
      {task.error ? (
        <TableCell>
          <XCircle className="text-red-500" />
        </TableCell>
      ) : task.completed ? (
        <TableCell>
          <CheckCircle className="text-green-500" />
        </TableCell>
      ) : (
        <TableCell>
          <Loader className="animate-spin text-blue-500" />
        </TableCell>
      )}
      <TableCell>{formatDateTime(task.createdAt!)}</TableCell>
      <TableCell>
        {task.completedAt ? formatDateTime(task.completedAt) : "-"}
      </TableCell>
      <TableCell>
        <Button type="button" disabled={!task.completed}>
          확인 →
        </Button>
      </TableCell>
    </TableRow>
  );
}
