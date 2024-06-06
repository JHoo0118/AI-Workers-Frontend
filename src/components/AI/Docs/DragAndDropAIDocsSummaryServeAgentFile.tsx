"use client";
import Loading from "@/components/Loading/Loading";
import MarkdownRenderer from "@/components/Markdown/MarkdownRenderer";
import PdfRenderer from "@/components/Pdf/PdfRenderer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TASK_AI_DOCS_SUMMARY_SERVE } from "@/const/const";
import { AcceptedFile } from "@/hoc/withDragAndDropFiles";
import useManageTaskEventSource from "@/hooks/useManageTaskEventSource";
import { useThrottle } from "@/hooks/useThrottle";
import { cn } from "@/lib/utils/utils";
import { docsServeSummaryEmbed } from "@/service/ai/docs/summary";
import { sseEmit } from "@/service/sse/sse";
import { useTaskListStore } from "@/store/useTaskListStore";
import useUserStore from "@/store/userStore";
import { DocsServeAgentResponse } from "@/types/ai-types";
import { SSEEmitInputs } from "@/types/sse-types";
import { Message } from "ai/react";
import { BotIcon, CopyIcon, DownloadIcon, WorkflowIcon } from "lucide-react";
import { DragEvent, RefObject, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

interface DragAndDropAIDocsSummaryServeAgentFileProps {
  title: string;
  openFileExplorer: () => void;
  dragActive: boolean;
  inputRef: RefObject<HTMLInputElement>;
  files: AcceptedFile[];
  setFiles: (files: AcceptedFile[]) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleDrop: (e: DragEvent<HTMLFormElement>) => Promise<void>;
  handleDragLeave: (e: React.SyntheticEvent) => void;
  handleDragOver: (e: React.SyntheticEvent) => void;
  handleDragEnter: (e: React.SyntheticEvent) => void;
  removeFile: (id: string) => void;
  sideBarContent?: React.ReactNode;
  acceptedFileType: string;
  messages: Message[];
}

function DragAndDropAIDocsSummaryServeAgentFile({
  title,
  openFileExplorer,
  dragActive,
  inputRef,
  files,
  setFiles,
  handleChange,
  handleDrop,
  handleDragLeave,
  handleDragOver,
  handleDragEnter,
  sideBarContent,
  acceptedFileType,
  messages: initialMessages,
}: DragAndDropAIDocsSummaryServeAgentFileProps) {
  const {
    taskList,
    setTaskList,
    getTaskByTaskType,
    checkNotCompletedTaskByTaskType,
    removeBackupDataByTaskType,
    removeTaskByTaskType,
    setBackupData,
    getBackupData,
    removeEventSource,
    removeBackupData,
  } = useTaskListStore();
  const [taskId, setTaskId] = useState<string>("");
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [inputPageNumber, setInputPageNumber] = useState<string>("1");
  const [loading, setLoading] = useState<boolean>(false);
  const [content, setContent] = useState<
    DocsServeAgentResponse[] | undefined | null
  >(undefined);
  const throttledShowToast = useThrottle((message: string) => {
    toast.error(message);
  }, 1000);

  const { user, recalculateRemainCount } = useUserStore((state) => ({
    user: state.user,
    recalculateRemainCount: state.recalculateRemainCount,
  }));

  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmitAIDocsSummary(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!user || user?.remainCount <= 0) {
      throttledShowToast("잔여 횟수가 없습니다.");
      return;
    }
    if (numPages > 5) {
      throttledShowToast(
        "현재 요약 기능은 총 5페이지 이하의 PDF 파일만 가능합니다.",
      );
      return;
    }
    const taskId = uuidv4();
    const formData = new FormData();
    formData.append("file", files[0].file);
    toast.success(() => <b>잠시만 기다려주세요...작업을 준비합니다.</b>);
    const { path } = await docsServeSummaryEmbed(files[0].file);
    removeCache();
    recalculateRemainCount();
    const task: SSEEmitInputs = {
      taskId: taskId,
      taskType: TASK_AI_DOCS_SUMMARY_SERVE,
      message: "START",
      createdAt: new Date(),
      completed: false,
      requestBody: JSON.stringify({ path }),
    };
    sseEmit(task);
    setTaskList([
      task,
      ...taskList.filter(
        (task) => task.taskType !== TASK_AI_DOCS_SUMMARY_SERVE,
      ),
    ]);
    setTaskId(taskId);
    setBackupData(taskId, files);

    toast(
      (t) => (
        <div>
          작업을 진행합니다. 우측
          <Button
            variant="secondary"
            size="icon"
            className="mx-2 cursor-default rounded-full"
          >
            <WorkflowIcon className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Toggle Workflow</span>
          </Button>
          아이콘을 통해 작업 현황을 확인할 수 있습니다. 이제 현재 페이지를
          벗어나셔도 됩니다.
        </div>
      ),
      { duration: 5000 },
    );
    setLoading(true);
  }

  useEffect(() => {
    const task = getTaskByTaskType(TASK_AI_DOCS_SUMMARY_SERVE);
    if (task && task.completed && !!task.result) {
      const content = JSON.parse(task.result!);
      setContent(content);
    }
  }, [files, taskList, getTaskByTaskType]);

  useEffect(() => {
    if (checkNotCompletedTaskByTaskType(TASK_AI_DOCS_SUMMARY_SERVE)) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [taskId, taskList, checkNotCompletedTaskByTaskType]);

  useEffect(() => {
    const task = getTaskByTaskType(TASK_AI_DOCS_SUMMARY_SERVE);
    if (!task) {
      return;
    }
    const taskId = task!.taskId;
    const files = getBackupData(taskId);
    if (!!files) {
      setFiles(files);
    }
  }, [getBackupData, getTaskByTaskType, setFiles]);

  useManageTaskEventSource(taskId);

  const handlePageInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputPageNumber(event.target.value);
  };

  const handlePageChange = () => {
    let page = parseInt(inputPageNumber, 10);
    page = page > numPages ? numPages : page === 0 ? 1 : page;
    setInputPageNumber(`${page}`);
    if (page >= 1 && page <= (numPages || 0)) {
      setPageNumber(page);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handlePageChange();
    }
  };

  function removeCache() {
    setContent(undefined);
    const task = getTaskByTaskType(TASK_AI_DOCS_SUMMARY_SERVE);
    if (task) {
      removeTaskByTaskType(TASK_AI_DOCS_SUMMARY_SERVE);
      removeEventSource(task.taskId);
    }
    removeBackupData(taskId);
    removeBackupDataByTaskType(TASK_AI_DOCS_SUMMARY_SERVE);
    setTaskId("");
  }

  function onClickCopy(value: string) {
    navigator.clipboard.writeText(value);
    toast.success("성공적으로 복사되었습니다.");
  }

  function onSaveDocument(page: number, value: string) {
    const blob = new Blob([value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${files[0].file.name}_${page}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div
        className={cn(
          "absolute inset-0 h-full w-full flex-col items-center rounded-lg text-center",
          files?.length > 0 ? "block" : "hidden",
        )}
      >
        {files?.length > 0 && (
          <div className="relative h-full overflow-y-auto lg:flex lg:flex-row lg:overflow-y-hidden">
            <div className="h-auto w-full flex-1 bg-gray-300 dark:bg-secondary lg:h-full lg:max-h-none lg:w-1/2">
              <div className="flex items-center justify-center space-x-4 px-2 py-2 lg:px-3 lg:py-3">
                <Button
                  disabled={pageNumber <= 1}
                  size="sm"
                  onClick={() => setPageNumber(pageNumber - 1)}
                  className="disabled:opacity-50"
                >
                  이전
                </Button>
                <p className="px-4 text-xs lg:text-lg">
                  Page {pageNumber} of {numPages}
                </p>
                <Button
                  disabled={pageNumber >= numPages}
                  size="sm"
                  onClick={() => setPageNumber(pageNumber + 1)}
                  className="disabled:opacity-50"
                >
                  다음
                </Button>
                <Input
                  className="w-[80px]"
                  type="number"
                  value={inputPageNumber}
                  min="1"
                  max={numPages || 1}
                  onChange={handlePageInputChange}
                  onKeyDown={handleKeyPress}
                />
                <Button
                  className="bg-blue-500 hover:bg-blue-600"
                  size="sm"
                  onClick={handlePageChange}
                >
                  이동
                </Button>
              </div>
              <PdfRenderer
                acceptedFile={files[0]}
                numPages={numPages}
                setNumPages={setNumPages}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                inputPageNumber={inputPageNumber}
                setInputPageNumber={setInputPageNumber}
              />
            </div>
            <div className="h-1/2 w-full border-l-2 lg:h-full lg:w-1/2">
              <div className="flex w-full flex-col justify-between lg:h-full">
                <div className="flex flex-col">
                  <div className="mx-auto w-full">
                    <h1 className="px-2 py-2 text-3xl lg:px-4 lg:py-4">
                      {title}
                    </h1>
                    <Card className="rounded-none">
                      <CardContent
                        className={cn(
                          "p-5",
                          !loading ? "cursor-pointer" : "cursor-default",
                        )}
                        onClick={() => {
                          if (!loading) {
                            openFileExplorer();
                          }
                        }}
                      >
                        {files[0].file.name}
                      </CardContent>
                    </Card>
                    <input
                      placeholder="fileInput"
                      className="hidden"
                      ref={inputRef}
                      type="file"
                      multiple={false}
                      onChange={(e) => {
                        handleChange(e);
                        removeCache();
                      }}
                      accept={acceptedFileType}
                    />
                  </div>
                </div>
                <div className="flex min-h-[200px] w-full flex-col items-center justify-center overflow-y-auto bg-gray-100 dark:bg-neutral-800 lg:h-full lg:min-h-0">
                  {!content ? (
                    loading ? (
                      <>
                        <Loading message="요약 중입니다." />
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-2">
                        <div className="mb-2 lg:mb-4">
                          <BotIcon className="h-12 w-12 lg:h-24 lg:w-24" />
                        </div>
                        <h1 className="text-sm lg:text-2xl">
                          문서를 요약해 보세요
                        </h1>
                      </div>
                    )
                  ) : (
                    <div className="mx-auto flex h-full w-full flex-col justify-between rounded-lg bg-gray-100 dark:bg-neutral-800">
                      <div className="h-full px-4">
                        <Accordion type="single" collapsible>
                          {content.map((data: DocsServeAgentResponse) => (
                            <AccordionItem
                              key={data.page}
                              value={data.page}
                              onClick={() => {
                                setPageNumber(parseInt(data.page) + 1);
                              }}
                            >
                              <AccordionTrigger>
                                페이지 {parseInt(data.page) + 1}
                              </AccordionTrigger>
                              <AccordionContent className="text-start">
                                <MarkdownRenderer content={data.summary} />
                                <div className="mt-4 flex space-x-4">
                                  <Button
                                    onClick={() => onClickCopy(data.summary)}
                                    type="button"
                                    variant="default"
                                    size="icon-sm"
                                  >
                                    <CopyIcon className="h-5 w-5" />
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      onSaveDocument(
                                        parseInt(data.page) + 1,
                                        data.summary,
                                      )
                                    }
                                    type="button"
                                    variant="default"
                                    size="icon-sm"
                                  >
                                    <DownloadIcon className="h-5 w-5" />
                                  </Button>
                                </div>
                                {/* <div className="mt-3 space-x-2">
                                  {!!data.keyword ? (
                                    data.keyword
                                      .split(",")
                                      .map((key: string) => (
                                        <span
                                          key={key.trim()}
                                          className="rounded bg-blue-500 px-2 py-1"
                                        >
                                          {key.trim()}
                                        </span>
                                      ))
                                  ) : (
                                    <></>
                                  )}
                                </div> */}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  className={cn("", content ? "block" : "hidden")}
                  variant="ghost"
                  onClick={removeCache}
                >
                  초기화
                </Button>
                <form
                  onSubmit={handleSubmitAIDocsSummary}
                  className="flex w-full items-center justify-center"
                >
                  <Button
                    className={cn("w-full")}
                    type="submit"
                    disabled={loading}
                  >
                    전체 페이지 요약하기
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      {files?.length === 0 && (
        <form
          className="absolute inset-0 h-full w-full flex-col items-center rounded-lg text-center"
          onDragEnter={handleDragEnter}
          onSubmit={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
        >
          <input
            placeholder="fileInput"
            className="hidden"
            ref={inputRef}
            type="file"
            multiple={false}
            onChange={handleChange}
            accept={acceptedFileType}
          />

          {dragActive && files && files.length === 0 && (
            <div className="pointer-events-none absolute inset-0 h-full w-full bg-black/80"></div>
          )}
        </form>
      )}
    </>
  );
}

export default DragAndDropAIDocsSummaryServeAgentFile;
