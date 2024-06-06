"use client";
import Loading from "@/components/Loading/Loading";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import useMenu from "@/hooks/useMenu";
import { CryptoUtils } from "@/lib/utils/crypto";
import { sequenceDiagramSchema } from "@/lib/validation/ai/diagram/seq/seqDiagramSchema";
import { sequenceDiagramGenerate } from "@/service/ai/diagram/seq/seq";
import useUserStore from "@/store/userStore";
import { SeqDiagramGenerateOutputs } from "@/types/ai-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface AISequenceDiagramContainerProps {
  url: string;
}

function AISequenceDiagramContainer({ url }: AISequenceDiagramContainerProps) {
  const locale = useLocale();
  const { title, content } = useMenu(url);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof sequenceDiagramSchema>>({
    resolver: zodResolver(sequenceDiagramSchema),
    defaultValues: {
      request: "",
    },
  });
  const { recalculateRemainCount } = useUserStore();

  async function onSubmit(data: z.infer<typeof sequenceDiagramSchema>) {
    setIsLoading(true);
    recalculateRemainCount();
    toast.promise(sequenceDiagramGenerate(data), {
      loading: "생성 중...",
      success: (data: SeqDiagramGenerateOutputs) => {
        const { image } = data;
        const encryptedImage = CryptoUtils.getInstance().encryptAes(image);
        router.push(`/${locale}/ai/diagram/seq/result/${encryptedImage}`);
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
          <div className="mx-auto w-full py-0 lg:w-auto lg:p-10">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...form.register("request")}
                      name="request"
                      placeholder={`// Example 1:\nClient는 Authorization Server에 Access Token을 요청합니다. 이 경우에 포함된 파라미터는 grant_type입니다. 이 요청에 대한 응답으로 Authorization Server는 Client에 Access Token을 전달합니다. 이 프로세스가 실패하면, 연결이 종료됩니다. 마지막으로 Client는 Resource Server에 보호된 리소스를 획득하도록 요청하고, Resource Server는 요청된 리소스를 Client에 전달합니다.
\n// Example 2:\n1. 클라이언트 애플리케이션이 OAuth 2.0 제공자에 등록하여 클라이언트 ID와 클라이언트 시크릿을 발급받습니다.
2. 사용자가 클라이언트 애플리케이션에서 로그인 버튼을 클릭하면, 클라이언트는 OAuth 2.0 제공자의 인증 서버로 사용자를 리디렉션합니다.
3. 사용자는 OAuth 2.0 제공자의 로그인 페이지에서 인증(로그인)하고 애플리케이션에 권한을 부여합니다. 이 과정이 완료되면, OAuth 2.0 제공자는 사용자를 클라이언트 애플리케이션의 리디렉션 URI로 리디렉션하며, URI에 인가 코드(authorization code)가 포함됩니다.
4. 클라이언트 애플리케이션은 받은 인가 코드를 사용하여 토큰 엔드포인트에 액세스 토큰을 요청합니다.
5. 인증 서버는 요청이 유효하면 액세스 토큰과 선택적으로 리프레시 토큰을 클라이언트에게 응답합니다.
6. 클라이언트 애플리케이션은 발급받은 액세스 토큰을 사용하여 보호된 리소스에 접근합니다.
7. 액세스 토큰이 만료되면, 클라이언트 애플리케이션은 리프레시 토큰을 사용하여 새로운 액세스 토큰을 요청할 수 있습니다.`}
                      className="min-h-[10rem] w-full sm:min-h-[12rem] md:min-h-[14rem] lg:min-h-[20rem] lg:w-[50rem]"
                      maxLength={2000}
                    ></Textarea>
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.request?.message}
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

export default AISequenceDiagramContainer;

// 1. 클라이언트 애플리케이션이 OAuth 2.0 제공자에 등록하여 클라이언트 ID와 클라이언트 시크릿을 발급받습니다.
// 2. 사용자가 클라이언트 애플리케이션에서 로그인 버튼을 클릭하면, 클라이언트는 OAuth 2.0 제공자의 인증 서버로 사용자를 리디렉션합니다.
// 3. 사용자는 OAuth 2.0 제공자의 로그인 페이지에서 인증(로그인)하고 애플리케이션에 권한을 부여합니다. 이 과정이 완료되면, OAuth 2.0 제공자는 사용자를 클라이언트 애플리케이션의 리디렉션 URI로 리디렉션하며, URI에 인가 코드(authorization code)가 포함됩니다.
// 4. 클라이언트 애플리케이션은 받은 인가 코드를 사용하여 토큰 엔드포인트에 액세스 토큰을 요청합니다.
// 5. 인증 서버는 요청이 유효하면 액세스 토큰과 선택적으로 리프레시 토큰을 클라이언트에게 응답합니다.
// 6. 클라이언트 애플리케이션은 발급받은 액세스 토큰을 사용하여 보호된 리소스에 접근합니다.
// 7. 액세스 토큰이 만료되면, 클라이언트 애플리케이션은 리프레시 토큰을 사용하여 새로운 액세스 토큰을 요청할 수 있습니다.
