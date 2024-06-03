import { cn } from "@/lib/utils/utils";
import { Message } from "ai/react";

import { BotIcon, UserIcon } from "lucide-react";
import MarkdownRenderer from "../Markdown/MarkdownRenderer";

export default function ChatMessage({
  message: { role, content },
  isError,
}: {
  message: Pick<Message, "role" | "content">;
  isError?: React.ReactNode;
}) {
  const isAiMessage = role === "assistant";

  return (
    <div
      className={cn(
        "w-full items-start gap-3 overflow-x-auto py-8 pl-6 pr-10 text-sm",
        isAiMessage
          ? "bg-gray-300 dark:bg-secondary"
          : "bg-gray-200 dark:bg-card",
      )}
    >
      {!!isError ? (
        <div className="flex flex-row">
          <div className="mr-4 flex flex-col items-start justify-start">
            <span className="block font-bold">
              {isAiMessage ? "AI WORKERS 봇" : "나"}
            </span>
            <p className="whitespace-pre-line break-all text-left">{content}</p>
          </div>
          {isError}
        </div>
      ) : (
        <div className="flex flex-col items-start justify-start">
          <div className="flex items-center space-x-2 lg:space-x-4">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border p-2 lg:h-10 lg:w-10",
                isAiMessage ? "bg-gray-100 dark:bg-card" : "bg-primary",
              )}
            >
              {isAiMessage ? (
                <BotIcon className="h-5 w-5 lg:h-6 lg:w-6" />
              ) : (
                <UserIcon className="h-5 w-5 lg:h-6 lg:w-6" />
              )}
            </div>
            <span className="block font-bold">
              {isAiMessage ? "AI WORKERS 봇" : "나"}
            </span>
          </div>
          <p className="whitespace-pre-line break-all pl-10 text-left lg:pl-14">
            <MarkdownRenderer content={content} />
          </p>
        </div>
      )}
    </div>
  );
}
