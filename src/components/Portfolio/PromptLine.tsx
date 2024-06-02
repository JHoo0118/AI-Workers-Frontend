"use client";

interface PromptLineProps {
  directory: string;
}

const PromptLine: React.FC<PromptLineProps> = ({ directory }) => {
  return (
    <div className="flex">
      <span className="text-lg font-bold text-green-400 sm:text-2xl">
        {directory}
      </span>
      <span className="mx-1 text-lg text-gray-500 sm:text-2xl">❯</span>
    </div>
  );
};

export default PromptLine;
