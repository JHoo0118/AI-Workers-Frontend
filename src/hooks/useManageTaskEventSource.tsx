"use client";
import { Button } from "@/components/ui/button";
import { ACCESS_TOKEN } from "@/const/const";
import { getRoutePathByTaskType } from "@/lib/utils/sseTaskUtils";
import { refreshTokens } from "@/service/auth/auth";
import { useTaskListStore } from "@/store/useTaskListStore";
import { SSEEmitOutputs } from "@/types/sse-types";
import { getCookie } from "cookies-next";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

/**
 * Custom hook to manage an EventSource connection for a specific task.
 * It establishes the connection when the task is active and cleans up on unmount or when the task is no longer active.
 *
 * @param {string} taskId - The ID of the task for which to manage the EventSource.
 */

let refreshTokenPromise: Promise<any> | null = null;

const useManageTaskEventSource = (taskId: string) => {
  const locale = useLocale();
  const router = useRouter();
  const { updateTask, addEventSource, removeEventSource, getTask } =
    useTaskListStore();

  useEffect(() => {
    const task = getTask(taskId);
    let headers = {
      Authorization: `Bearer ${getCookie(ACCESS_TOKEN)}`,
    };

    if (task && !task.completed) {
      const eventSourceUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/sse/stream/${taskId}`;

      (async () => {
        let response = await fetch(eventSourceUrl, {
          headers,
        });

        if (response.status === 409) {
          if (!refreshTokenPromise) {
            refreshTokenPromise = refreshTokens();
            await refreshTokenPromise;
            refreshTokenPromise = null;
          }

          headers = {
            Authorization: `Bearer ${getCookie(ACCESS_TOKEN)}`,
          };

          response = await fetch(eventSourceUrl, { headers });
        }

        if (!response.ok) {
          const errorResp = await response.json();
          if (errorResp.hasOwnProperty("detail")) {
            throw new Error(
              typeof errorResp["detail"] === "string"
                ? errorResp["detail"]
                : "오류가 발생했습니다.",
            );
          }
          throw new Error(`HTTP error, status = ${response.status}`);
        }

        if (response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let accumulatedData = "";

          addEventSource(taskId, response.body);

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              accumulatedData += decoder.decode(value, { stream: true });

              let lineEndIndex;
              while ((lineEndIndex = accumulatedData.indexOf("\n")) !== -1) {
                const line = accumulatedData.substring(0, lineEndIndex).trim();
                accumulatedData = accumulatedData.substring(lineEndIndex + 1);

                if (line.startsWith("data:")) {
                  try {
                    const data: SSEEmitOutputs = JSON.parse(
                      line.substring(5),
                    ) as SSEEmitOutputs;
                    if (data.completed) {
                      updateTask(data);
                      toast((t) => (
                        <span>
                          진행 중인 작업이 완료되었습니다.
                          <Button
                            variant="secondary"
                            size="sm"
                            className="ml-2"
                            onClick={() => {
                              toast.dismiss(t.id);
                              const targetPath = getRoutePathByTaskType(
                                locale,
                                data.taskType,
                              );
                              router.push(targetPath);
                            }}
                          >
                            이동하기
                          </Button>
                        </span>
                      ));
                      reader.cancel();
                      removeEventSource(taskId);
                    }
                  } catch (error) {
                    throw Error(error?.toString());
                  }
                } else if (line.startsWith(":")) {
                  // keep-alive or heartbeat message from the server.
                  // ignore
                  console.log("Received keep-alive ping");
                }
              }
            }
          } catch (error) {
            updateTask({
              ...task,
              completed: false,
              error: true,
            });
            reader.cancel();
            console.error("Error reading the stream", error);
            toast.error("진행 중인 작업에 오류가 발생했습니다.");
            removeEventSource(taskId);
          }
        }
      })();

      return () => {};
    }
  }, [
    taskId,
    getTask,
    updateTask,
    addEventSource,
    removeEventSource,
    locale,
    router,
  ]);

  // EventSource
  // useEffect(() => {
  //   const task = getTask(taskId);

  //   if (!!task && !task.completed) {
  //     const eventSourceUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/sse/stream/${taskId}`;
  //     const eventSource = new EventSource(eventSourceUrl);

  //     addEventSource(taskId, eventSource);

  //     eventSource.onmessage = (event: MessageEvent<SSEEmitOutputs>) => {
  //       const data = JSON.parse(event.data) as SSEEmitOutputs;
  //       console.log(data);
  //       if (!!data.completed) {
  //         updateTask(data);
  //         toast.success("진행 중인 작업이 완료되었습니다.");
  //         eventSource.close();
  //         removeEventSource(taskId);
  //       }
  //     };

  //     eventSource.onerror = (event) => {
  //       updateTask({ ...task, error: true });
  //       toast.error("진행 중인 작업에 오류가 발생했습니다.");
  //       eventSource.close();
  //       removeEventSource(taskId);
  //     };

  //     return () => {
  //       // eventSource.close();
  //       // removeEventSource(taskId);
  //     };
  //   }
  // }, [updateTask, addEventSource, getTask, removeEventSource, taskId]);
};

export default useManageTaskEventSource;
