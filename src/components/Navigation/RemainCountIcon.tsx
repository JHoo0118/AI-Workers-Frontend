"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/utils";
import { GemIcon } from "lucide-react";

interface RemainCountIconProps {
  remainCount: number;
  className?: string | undefined;
}

export default function RemainCountIcon({
  remainCount,
  className,
}: RemainCountIconProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            className={cn(
              "mr-4 flex items-center justify-center",
              className && className,
            )}
          >
            <GemIcon className="mr-2 h-6 w-6 text-blue-400" />
            <span className="text-blue-400">{remainCount}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-80">
            현재 <span className="text-blue-500">{remainCount}</span>번 AI
            Agent의 도움을 받을 수 있습니다. PDF 서비스는 잔여 횟수와 관계없이
            이용 가능합니다.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
