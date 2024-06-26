"use client";
import ChatMessage from "@/components/ChatMessage/ChatMessage";
import ChatMessageLoading from "@/components/ChatMessage/ChatMessageLoading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ACCESS_TOKEN } from "@/const/const";
import { AcceptedFile } from "@/hoc/withDragAndDropFiles";
import { isAuthenticated } from "@/lib/utils/auth";
import { cn } from "@/lib/utils/utils";
import { refreshTokens } from "@/service/auth/auth";
import useUserStore from "@/store/userStore";
import { ChatRequestOptions } from "ai";
import { Message, useChat } from "ai/react";
import { getCookie } from "cookies-next";
import { BotIcon, StopCircleIcon } from "lucide-react";
import { DragEvent, RefObject, useEffect, useRef, useState } from "react";

interface DragAndDropAIDocsSummaryFileProps {
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
  completedFile: boolean;
  setCompletedFile: (completedFile: boolean) => void;
  messages: Message[];
}

function DragAndDropAIDocsSummaryFile({
  dragActive,
  inputRef,
  files,
  handleChange,
  handleDrop,
  handleDragLeave,
  handleDragOver,
  handleDragEnter,
  sideBarContent,
  acceptedFileType,
  completedFile,
  messages: initialMessages,
}: DragAndDropAIDocsSummaryFileProps) {
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);
  const { recalculateRemainCount } = useUserStore();

  async function handleSubmitWrapper(
    e: React.FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions,
  ) {
    e.preventDefault();
    setHasUserScrolled(false);
    const ok: boolean = await isAuthenticated();
    try {
      if (ok) {
        setIsStreaming(true);
        handleSubmit(e, {
          options: {
            headers: {
              Connection: "keep-alive",
              "Cache-Control": "no-cache, no-transform",
              Authorization: `Bearer ${getCookie(ACCESS_TOKEN) ?? ""}`,
            },
          },
        });
        recalculateRemainCount();
      } else {
        throw error?.message || "오류가 발생했습니다.";
      }
    } catch (error: any) {}
  }

  function onStop() {
    setIsStreaming(false);
    stop();
  }

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
    stop,
    reload,
  } = useChat({
    api: `/py-api/ai/docs/ask/${files[0]?.file.name}`,
    headers: {
      Authorization: `Bearer ${getCookie(ACCESS_TOKEN) ?? ""}`,
    },
    onError: (error: Error) => {
      setIsStreaming(false);
    },
    onResponse: async (response) => {
      if (response.status === 409) {
        try {
          await refreshTokens();
          return;
        } catch {}
      }
    },
    onFinish: (message: Message) => {
      setIsStreaming(false);
    },
  });

  useEffect(() => {
    const handleUserScroll = () => {
      if (!hasUserScrolled && scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        if (scrollTop + clientHeight < scrollHeight) {
          setHasUserScrolled(true);
        }
      }
    };

    const currentScrollRef = scrollRef.current;
    if (currentScrollRef) {
      currentScrollRef.addEventListener("scroll", handleUserScroll);

      return () => {
        currentScrollRef.removeEventListener("scroll", handleUserScroll);
      };
    }
  }, [hasUserScrolled]);

  useEffect(() => {
    if (!hasUserScrolled && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, hasUserScrolled]);

  useEffect(() => {
    if (completedFile) {
      setMessages(initialMessages);
    }
  }, [completedFile, initialMessages, setMessages]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";

  return (
    <>
      <div
        className={cn(
          "absolute inset-0 h-full w-full flex-col items-center rounded-lg text-center",
          files?.length > 0 ? "block" : "hidden",
        )}
      >
        <div className="flex h-full flex-col justify-between sm:flex-row">
          {completedFile ? (
            <div className="my-0 w-full xl:my-10">
              <div className="mx-auto flex max-h-full min-h-full w-full max-w-[120rem] flex-col justify-between rounded-lg bg-gray-100 dark:bg-neutral-800 sm:w-full md:w-full lg:w-full xl:w-9/12">
                <div ref={scrollRef} className="relative overflow-y-auto">
                  {messages.map((message) => (
                    <ChatMessage message={message} key={message.id} />
                  ))}
                  {isLoading && lastMessageIsUser && <ChatMessageLoading />}
                  {error && (
                    <ChatMessage
                      message={{
                        role: "assistant",
                        content:
                          error && error.message
                            ? JSON.parse(error!.message).detail
                            : "오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
                      }}
                      // isError={
                      //   <Button
                      //     className="bg-gray-600 hover:bg-gray-700"
                      //     onClick={() => reload()}
                      //   >
                      //     <RefreshCwIcon className="mr-2 h-6 w-6" /> 재전송
                      //   </Button>
                      // }
                    />
                  )}
                </div>
                <div className="flex items-center p-6">
                  <form
                    onSubmit={handleSubmitWrapper}
                    className="flex w-full items-center justify-center space-x-2"
                  >
                    <Input
                      className="focus-visible:ring-1"
                      value={input}
                      onChange={handleInputChange}
                      placeholder="메시지를 입력해 주세요."
                      readOnly={!!!completedFile}
                      disabled={!!!completedFile}
                    />

                    <Button
                      className={cn("", isStreaming && "hidden")}
                      type="submit"
                      disabled={
                        isStreaming ||
                        isLoading ||
                        !completedFile ||
                        input?.length === 0
                      }
                    >
                      보내기
                    </Button>
                    <Button
                      className={cn(
                        "bg-gray-600 text-white hover:bg-gray-700",
                        !isStreaming && "hidden",
                      )}
                      onClick={onStop}
                      disabled={!isStreaming}
                      type="button"
                      variant="ghost"
                    >
                      <StopCircleIcon className="h-6 w-6" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex w-full flex-col items-center justify-center">
              <div className="mb-4">
                <BotIcon className="h-24 w-24" />
              </div>
              <h1 className="text-2xl">문서를 요약하고 질문해 보세요.</h1>
            </div>
          )}

          {sideBarContent && (
            <div className="h-full w-full border-l-2 sm:w-[30rem]">
              {sideBarContent}
            </div>
          )}
        </div>
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

export default DragAndDropAIDocsSummaryFile;
