"use client";
import { BotIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { BarLoader } from "react-spinners";

export default function ChatMessageLoading({}: {}) {
  const { theme } = useTheme();
  return (
    <div className="flex flex-1 items-start gap-3 bg-gray-300 py-8 pl-6 pr-10 text-sm dark:bg-secondary">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-gray-100 p-2 dark:bg-card">
        <BotIcon className="h-6 w-6" />
      </div>
      <div className="flex flex-col items-start justify-start">
        <span className="block font-bold">AI WORKERS 봇</span>
        <p className="mt-4 break-all text-left">
          {theme === "dark" ? (
            <BarLoader color="#22C55E" />
          ) : (
            <BarLoader color="#16A34A" />
          )}
        </p>
      </div>
    </div>
  );
}
