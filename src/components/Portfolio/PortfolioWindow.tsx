"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import MarkdownRenderer from "../Markdown/MarkdownRenderer";
import CommandOutput from "./CommandOutput";
import PromptLine from "./PromptLine";

interface FormData {
  command: string;
}

const animationCommnad: string[] = ["ls", "cat portfolio.md"];

export default function PortfolioWindow() {
  const locale = useLocale();
  const { register, handleSubmit, reset, setValue, control } =
    useForm<FormData>();
  const [directory, setDirectory] = useState("~/Documents/portfolio");
  const [terminalBody, setTerminalBody] = useState<
    {
      directory: string;
      command: string;
      output: string;
      markdown?: boolean;
    }[]
  >([
    {
      directory,
      command: "",
      output: "",
    },
  ]);
  const [isAnimation, setIsAnimation] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [terminalBody]);

  const onSubmit = useCallback(
    (data: FormData) => {
      try {
        const command = data.command.trim();
        if (command === "ls") {
          setTerminalBody((prevBody) => [
            ...prevBody,
            { directory, command, output: "portfolio.md" },
          ]);
        } else {
          setTerminalBody((prevBody) => [
            ...prevBody,
            { directory, command, output: "" },
          ]);
        }
        reset();
      } catch (error) {
        console.error("Invalid command:", error);
      }
    },
    [directory, reset],
  );

  const setSecondAnimationTimer = useCallback(
    ({ text }: { text: string }) => {
      let index = 0;
      const timer = setInterval(() => {
        if (index <= text.length) {
          setTerminalBody((prevBody) => {
            const updatedBody = [...prevBody];
            if (updatedBody.length > 1) {
              updatedBody[1].command = text.slice(0, index);
            } else {
              updatedBody.push({
                directory,
                command: text.slice(0, 1),
                output: "",
                markdown: true,
              });
            }
            return updatedBody;
          });
          index++;
        } else {
          setValue("command", text);
          setIsTyping(false);
          setIsAnimation(false);
          clearInterval(timer);
          setTerminalBody((prevBody) => {
            const updatedBody = [...prevBody];
            updatedBody[1].output =
              //   "-rw-r--r--\t\thoo\t\tstaff\t\t11028  \t\t  1\t\t  1\t\t00:00\t\tportfolio.rtf";
              `
`;
            return updatedBody;
          });
          setValue("command", "");
          return;
        }
      }, 100);
      return timer;
    },
    [directory, setValue],
  );

  const setFirstAnimationTimer = useCallback(
    ({ text }: { text: string }) => {
      let index = 0;
      const timer = setInterval(() => {
        if (index <= text.length) {
          setTerminalBody((prevBody) => {
            const updatedBody = [...prevBody];
            if (updatedBody.length > 0) {
              updatedBody[0].command = text.slice(0, index);
            } else {
              updatedBody.push({
                directory,
                command: text.slice(0, 1),
                output: "",
              });
            }
            return updatedBody;
          });
          index++;
        } else {
          setValue("command", text);
          clearInterval(timer);
          setTerminalBody((prevBody) => {
            const updatedBody = [...prevBody];
            updatedBody[0].output =
              //   "-rw-r--r--\t\thoo\t\tstaff\t\t11028  \t\t  1\t\t  1\t\t00:00\t\tportfolio.rtf";
              "portfolio.md";
            updatedBody.push({
              directory,
              command: "",
              output: "",
              markdown: true,
            });
            return updatedBody;
          });
          setValue("command", "");
          return;
        }
      }, 200);
      return timer;
    },
    [directory, setValue],
  );

  useEffect(() => {
    if (isTyping) {
      const firstTimer = setFirstAnimationTimer({
        text: animationCommnad[0],
      });
      setTimeout(() => {
        const secondTimer = setSecondAnimationTimer({
          text: animationCommnad[1],
        });
      }, 1500);
      return () => {
        clearInterval(firstTimer);
      };
    }
  }, [
    directory,
    handleSubmit,
    onSubmit,
    isTyping,
    setValue,
    setFirstAnimationTimer,
    setSecondAnimationTimer,
  ]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="flex h-screen flex-col justify-between bg-gray-900">
      <div className="flex items-center justify-between rounded-t-lg bg-card p-2">
        <div className="flex items-center space-x-1">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="flex items-center">
            <span className="text-xs font-bold">@portfolio</span>
            <span className="mx-1">|</span>
            <span className="text-xs">~</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-bold text-yellow-400">➜</span>
            <span className="text-sm font-bold text-green-400">JHoo</span>
            <span className="text-sm font-bold">prompt</span>
          </div>
        </div>
      </div>
      <div ref={scrollRef} className="flex h-screen flex-col overflow-y-auto">
        <div className="flex flex-1 flex-col bg-black p-4 text-gray-300">
          <pre className="text-xxs sm:text-xs">
            {`
        ____  __           _          
       / / / / /___  ____ ( )_____  
  __  / / /_/ / __ \\/ __ \\|// ___/  
 / /_/ / __  / /_/ / /_/ / (__  )   
 \\____/_/ /_/\\____/\\____/ /____/    
         ____             __  ____      ___
        / __ \\____  _____/ /_/ __/___  / (_)___
       / /_/ / __ \\/ ___/ __/ /_/ __ \\/ / / __ \\
      / ____/ /_/ / /  / /_/ __/ /_/ / / / /_/ /
     /_/    \\____/_/   \\__/_/  \\____/_/_/\\____/   


`}
          </pre>
          <div className="whitespace-pre-wrap">
            {terminalBody.map(
              ({ directory, command, output, markdown }, index) => (
                <React.Fragment key={index}>
                  <div className="mt-2 flex">
                    <PromptLine directory={directory} />
                    <CommandOutput command={command} />
                  </div>
                  {!markdown ? (
                    <CommandOutput command={output} color="text-blue-400" />
                  ) : (
                    <div className="container my-10 max-w-[768px]">
                      <MarkdownRenderer content={output} />
                    </div>
                  )}
                </React.Fragment>
              ),
            )}
          </div>
          {/* Prompt Line and Command Input */}
          {!isAnimation && (
            <form className="mt-2 flex" onSubmit={handleSubmit(onSubmit)}>
              <PromptLine directory={directory} />
              <Controller
                name="command"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    maxLength={1000}
                    className="h-auto flex-grow resize-none overflow-hidden border-none bg-transparent text-lg text-gray-300 focus:outline-none sm:text-2xl"
                    autoFocus
                    onChange={(e) => {
                      field.onChange(e);
                      e.target.style.height = "auto";
                      e.target.style.height = e.target.scrollHeight + "px";
                    }}
                    onKeyDown={handleKeyPress}
                  />
                )}
              />
            </form>
          )}
        </div>
      </div>
      <div className="rounded-b-lg bg-card p-2">
        <div className="flex items-center justify-center space-x-2 text-sm">
          <Link href={`/${locale}`}>Close</Link>
        </div>
      </div>
    </div>
  );
}

//        ____  __           _
//       / / / / /___  ____ ( )_____
//  __  / / /_/ / __ \/ __ \|// ___/
// / /_/ / __  / /_/ / /_/ / (__  )
// \____/_/ /_/\____/\____/ /____/

//     ____             __  ____      ___
//    / __ \____  _____/ /_/ __/___  / (_)___
//   / /_/ / __ \/ ___/ __/ /_/ __ \/ / / __ \
//  / ____/ /_/ / /  / /_/ __/ /_/ / / / /_/ /
// /_/    \____/_/   \__/_/  \____/_/_/\____/
