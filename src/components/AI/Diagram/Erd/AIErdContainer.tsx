"use client";
import CodeEditor from "@/components/AceEditor/CodeEditor";
import Loading from "@/components/Loading/Loading";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import useMenu from "@/hooks/useMenu";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { CryptoUtils } from "@/lib/utils/crypto";
import { erdSchema } from "@/lib/validation/ai/diagram/erd/erdSchema";
import { erdGenerate } from "@/service/ai/diagram/erd/erd";
import { ErdGenereateOutputs } from "@/types/ai-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface AIErdContainerProps {}

function AIErdContainer({}: AIErdContainerProps) {
  const url = "/ai/diagram/erd";
  useRequireAuth({ forwardUrl: url });
  const locale = useLocale();
  const { title, content } = useMenu(url);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryInput, setQueryInput] = useState<string>("");
  const form = useForm<z.infer<typeof erdSchema>>({
    resolver: zodResolver(erdSchema),
    defaultValues: {
      query: queryInput,
    },
  });

  async function onSubmit(data: z.infer<typeof erdSchema>) {
    data.query = queryInput;
    if (data.query.length === 0) {
      toast.error("필수 항목입니다.");
      return;
    }
    const regex = new RegExp(
      /(CREATE|ALTER|DROP|TRUNCATE|INSERT|UPDATE|DELETE|SELECT)\s/,
      "gi",
    );

    if (!regex.test(data.query)) {
      toast.error("올바른 형태로 입력해 주세요.");
    }
    setIsLoading(true);
    toast.promise(erdGenerate(data), {
      loading: "생성 중...",
      success: (data: ErdGenereateOutputs) => {
        const { image } = data;
        const encryptedImage = CryptoUtils.getInstance().encryptAes(image);
        router.push(`/${locale}/ai/diagram/erd/result/${encryptedImage}`);
        return <b>이미지가 생성되었습니다.</b>;
      },
      error: (error) => {
        setIsLoading(false);
        return <b>{error}</b>;
      },
    });
  }

  return (
    <div className="relative flex h-full flex-col items-center">
      {isLoading ? (
        <Loading message={"생성 중입니다. 잠시만 기다려 주세요."} />
      ) : (
        <>
          <div className="flex flex-col items-center py-4 pt-10">
            <h1 className="text-4xl">{title}</h1>
            <p className="leading-7 [&:not(:first-child)]:mt-6">{content}</p>
          </div>
          <div className="mx-auto w-full py-0 md:min-w-[50rem] lg:w-auto lg:p-10">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormItem>
                  <FormControl>
                    <CodeEditor
                      height="22rem"
                      placeholder={`// Example 1:\nCREATE TABLE Student_info(\n\tCollege_Id number(2),\n\tCollege_name varchar(30),\n\tBranch varchar(10)\n);\n\n // Example 2:\nSELECT Emp_Id, Emp_Salary FROM Employee;\n\n// Example 3:\nINSERT INTO Student (Stu_id, Stu_Name, Stu_Marks, Stu_Age) VALUES (104, Anmol, 89, 19);`}
                      onChange={setQueryInput}
                      language={"sql"}
                      value={queryInput}
                    />
                    {/* <Textarea
                      {...form.register("query")}
                      name="query"
                      placeholder={`// Example 1:\nCREATE TABLE Student_info(\n\tCollege_Id number(2),\n\tCollege_name varchar(30),\n\tBranch varchar(10)\n);\n\n // Example 2:\nSELECT Emp_Id, Emp_Salary FROM Employee;\n\n// Example 3:\nINSERT INTO Student (Stu_id, Stu_Name, Stu_Marks, Stu_Age) VALUES (104, Anmol, 89, 19);`}
                      className="min-h-[22rem] w-full lg:min-h-[26rem] lg:w-[50rem]"
                      maxLength={2000}
                    ></Textarea> */}
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.query?.message}
                  </FormMessage>
                </FormItem>
                <Button
                  className="mt-4 w-full"
                  type="submit"
                  size="2xl"
                  variant="default"
                >
                  생성하기
                </Button>
              </form>
            </Form>
          </div>
        </>
      )}
    </div>
  );
}

export default AIErdContainer;
