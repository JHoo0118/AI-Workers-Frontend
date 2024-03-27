"use client";
import CodeEditor from "@/components/AceEditor/CodeEditor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useManageTaskEventSource from "@/hooks/useManageTaskEventSource";
import useMenu from "@/hooks/useMenu";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { framework, getLangByFramework } from "@/lib/data/framework";
import { cn } from "@/lib/utils/utils";
import { apiGenSchema } from "@/lib/validation/ai/code/apiGen/apiGenSchema";
import { sseEmit } from "@/service/sse/sse";
import useDrawerStore from "@/store/useDrawerStore";
import { useTaskListStore } from "@/store/useTaskListStore";
import { SSEEmitInputs } from "@/types/sse-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDownCircleIcon, WorkflowIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HashLoader } from "react-spinners";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

interface AIApiGenContainerProps {}

function AIApiGenContainer({}: AIApiGenContainerProps) {
  const url = "/ai/code/apigen";
  useRequireAuth({ forwardUrl: url });
  const { open, setOpen } = useDrawerStore();
  const {
    taskList,
    setTaskList,
    getTaskByTaskType,
    checkNotCompletedTaskByTaskType,
    removeTaskByTaskType,
  } = useTaskListStore();
  const [taskId, setTaskId] = useState<string>("");
  const { title, content } = useMenu(url);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const form = useForm<z.infer<typeof apiGenSchema>>({
    resolver: zodResolver(apiGenSchema),
    defaultValues: {
      input: "",
      framework: "FastAPI",
    },
  });
  const resultSectionRef = useRef<HTMLDivElement>(null);

  async function onSubmit(data: z.infer<typeof apiGenSchema>) {
    setGeneratedCode("");
    const taskId = uuidv4();
    const task: SSEEmitInputs = {
      taskId: taskId,
      taskType: "TASK_AI_API_GEN",
      message: "START",
      createdAt: new Date(),
      completed: false,
      requestBody: JSON.stringify(data),
    };
    sseEmit(task);
    setTaskList([
      task,
      ...taskList.filter((task) => task.taskType !== "TASK_AI_API_GEN"),
    ]);
    setTaskId(taskId);
    setIsLoading(true);
    // toast.success("작업을 진행합니다.");
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
        아이콘을 통해 작업 현황을 확인할 수 있습니다.
        {/* <Button
          variant="default"
          size="sm"
          className="ml-2"
          onClick={() => {
            toast.dismiss(t.id);
          }}
        >
          확인
        </Button> */}
      </div>
    ));
  }

  useEffect(() => {
    const task = getTaskByTaskType("TASK_AI_API_GEN");
    if (task && task.completed && !!task.result) {
      setGeneratedCode(task.result!);
    }
  }, [taskList, getTaskByTaskType]);

  useEffect(() => {
    if (checkNotCompletedTaskByTaskType("TASK_AI_API_GEN")) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [taskList, checkNotCompletedTaskByTaskType]);

  useManageTaskEventSource(taskId);

  return (
    <>
      <div className="relative flex h-full flex-col items-center">
        <div className="flex flex-col items-center py-4 pt-10">
          <h1 className="text-4xl">{title}</h1>
          <p className="leading-7 [&:not(:first-child)]:mt-6">{content}</p>
        </div>
        <div className="mx-auto w-full py-0 md:min-w-[50rem] lg:w-auto lg:p-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="framework"
                render={({ field }) => (
                  <FormItem className="mb-2 w-1/2">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="프레임워크" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {framework.map((f) => (
                          <SelectItem key={f.label} value={f.value}>
                            {f.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormItem>
                <FormControl>
                  <Textarea
                    {...form.register("input")}
                    name="input"
                    placeholder={`// Example:\nCreate something that stores crypto price data in a database`}
                    className="min-h-[10rem] w-full resize-none"
                    maxLength={2000}
                  />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.input?.message}
                </FormMessage>
              </FormItem>
              <Button
                className="mt-4 w-full"
                type="submit"
                size="2xl"
                variant="default"
                disabled={isLoading}
              >
                생성하기
              </Button>
            </form>
          </Form>
          {isLoading && (
            <div className="mb-20 mt-20 flex justify-center">
              <HashLoader size={90} color="#2DD4BF" />
            </div>
          )}
          {generatedCode.trim().length !== 0 && (
            <div className="mb-20 mt-20 flex justify-center">
              <ArrowDownCircleIcon
                className="animate-bounce cursor-pointer"
                size={90}
                color="#2DD4BF"
                onClick={() =>
                  resultSectionRef.current?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
              />
            </div>
          )}
        </div>
      </div>
      <section
        ref={resultSectionRef}
        className={cn(
          "h-screen-nav",
          generatedCode.trim().length === 0 && "hidden",
        )}
      >
        <div className="m-auto flex h-full w-full md:items-center lg:w-2/3">
          <CodeEditor
            height="42rem"
            readOnly={true}
            language={getLangByFramework(form.getValues("framework"))}
            value={generatedCode}
          />
        </div>
      </section>
    </>
  );
}

export default AIApiGenContainer;
