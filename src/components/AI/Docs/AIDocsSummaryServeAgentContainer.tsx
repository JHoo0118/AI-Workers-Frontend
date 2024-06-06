"use client";
import { Button } from "@/components/ui/button";
import withDragAndDropFiles, {
  DragAndDropFilesComponentProps,
  DragAndDropFilesWrappedProps,
} from "@/hoc/withDragAndDropFiles";
import useMenu from "@/hooks/useMenu";
import { cn } from "@/lib/utils/utils";
import { useTaskListStore } from "@/store/useTaskListStore";
import { Message } from "ai/react";
import { useState } from "react";
import DragAndDropAIDocsSummaryServeAgentFile from "./DragAndDropAIDocsSummaryServeAgentFile";

interface AIDocsSummaryServeAgentContainerProps
  extends DragAndDropFilesWrappedProps,
    DragAndDropFilesComponentProps {
  url: string;
}

function AIDocsSummaryServeAgentContainer({
  url,
  dragActive,
  inputRef,
  files,
  setFiles,
  openFileExplorer,
  handleChange,
  handleDrop,
  handleDragLeave,
  handleDragOver,
  handleDragEnter,
  removeFile,
  acceptedFileType,
  multiple = true,
}: AIDocsSummaryServeAgentContainerProps) {
  const { title, content } = useMenu(url);
  const [messages, setMessages] = useState<Message[]>([]);
  const { getTaskByTaskType, checkNotCompletedTaskByTaskType, getBackupData } =
    useTaskListStore();

  // useEffect(() => {
  //   const task = getTaskByTaskType(TASK_AI_DOCS_SUMMARY_SERVE);
  //   const taskId = task!.taskId;
  //   const files = getBackupData(taskId);
  //   if (files) {
  //     console.log(files);
  //     setFiles(files);
  //   }
  // }, [
  //   getBackupData,
  //   getTaskByTaskType,
  //   setFiles,
  //   checkNotCompletedTaskByTaskType,
  // ]);

  return (
    <div className="relative flex h-full justify-center px-4">
      {files?.length === 0 && (
        <div className="flex flex-col items-center overflow-x-hidden py-10">
          <h1 className="text-4xl">{title}</h1>
          <p className="leading-7 [&:not(:first-child)]:mt-6">{content}</p>
          <Button
            className={cn("mt-4 min-w-80", !dragActive && "z-10")}
            type="button"
            size="2xl"
            onClick={openFileExplorer}
            variant="default"
          >
            PDF 파일 선택
          </Button>
          <h3 className="mt-4 text-sm">또는 파일을 여기에 두기</h3>
        </div>
      )}
      <DragAndDropAIDocsSummaryServeAgentFile
        title={title}
        openFileExplorer={openFileExplorer}
        dragActive={dragActive}
        inputRef={inputRef}
        files={files}
        setFiles={setFiles}
        handleChange={handleChange}
        handleDrop={handleDrop}
        handleDragLeave={handleDragLeave}
        handleDragOver={handleDragOver}
        handleDragEnter={handleDragEnter}
        removeFile={removeFile}
        acceptedFileType={acceptedFileType}
        messages={messages}
      />

      {dragActive && files && files.length === 0 && (
        <h1 className="pointer-events-none absolute z-10 flex h-full items-center justify-center text-7xl text-white">
          파일을 여기에 두세요.
        </h1>
      )}
    </div>
  );
}

export default withDragAndDropFiles(AIDocsSummaryServeAgentContainer);
