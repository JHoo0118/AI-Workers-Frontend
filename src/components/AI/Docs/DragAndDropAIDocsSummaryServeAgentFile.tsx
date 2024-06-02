"use client";
import Loading from "@/components/Loading/Loading";
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
import { cn } from "@/lib/utils/utils";
import { docsServeSummaryEmbed } from "@/service/ai/docs/summary";
import { sseEmit } from "@/service/sse/sse";
import { useTaskListStore } from "@/store/useTaskListStore";
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

  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmitAIDocsSummary(e: React.SyntheticEvent) {
    e.preventDefault();
    if (numPages > 10) {
      toast.error("현재 요약 기능은 총 10페이지 이하의 PDF 파일만 가능합니다.");
      return;
    }
    const taskId = uuidv4();
    const formData = new FormData();
    formData.append("file", files[0].file);
    toast.success(() => <b>잠시만 기다려주세요...작업을 준비합니다.</b>);
    const { path } = await docsServeSummaryEmbed(files[0].file);
    removeCache();
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

    toast((t) => (
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
    ));
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
    const page = parseInt(inputPageNumber, 10);
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
          <div className="flex h-full flex-col sm:flex-row">
            <div className="w-1/2 flex-1 bg-gray-300 dark:bg-secondary">
              <div className="flex justify-center space-x-4 px-4 py-4">
                <Button
                  disabled={pageNumber <= 1}
                  onClick={() => setPageNumber(pageNumber - 1)}
                  className="disabled:opacity-50"
                >
                  이전
                </Button>
                <p className="px-4 py-2">
                  Page {pageNumber} of {numPages}
                </p>
                <Button
                  disabled={pageNumber >= numPages}
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
              />
            </div>
            <div className="w-1/2 border-l-2">
              <div className="flex h-full w-full flex-col justify-between">
                <div className="flex flex-col">
                  <div className="mx-auto w-full">
                    <h1 className="mb-2 mt-2 text-3xl">{title}</h1>
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
                      }}
                      accept={acceptedFileType}
                    />
                  </div>
                </div>
                <div className="flex h-full w-full flex-col items-center justify-center overflow-y-auto bg-gray-100 dark:bg-neutral-800">
                  {!content ? (
                    loading ? (
                      <>
                        <Loading message="요약 중입니다." />
                      </>
                    ) : (
                      <>
                        <div className="mb-4">
                          <BotIcon className="h-24 w-24" />
                        </div>
                        <h1 className="text-2xl">문서를 요약해 보세요</h1>
                      </>
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
                                <span>{data.summary}</span>
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
                    페이지 요약하기
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
