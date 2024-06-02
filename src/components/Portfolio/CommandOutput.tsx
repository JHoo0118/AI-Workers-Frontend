"use client";

import { cn } from "@/lib/utils/utils";

interface CommandOutputProps {
  command: string;
  color?: string;
}

const CommandOutput: React.FC<CommandOutputProps> = ({
  command,
  color,
}: CommandOutputProps) => {
  return (
    <div className="flex">
      <span
        className={cn("text-lg sm:text-2xl", color ? color : "text-gray-300")}
      >
        {command}
      </span>
    </div>
  );
};

export default CommandOutput;
