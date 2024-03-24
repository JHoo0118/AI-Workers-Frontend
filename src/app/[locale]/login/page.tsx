"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/ui/loading-button";
import { FORWARD_URL } from "@/const/const";
import { useAuth } from "@/context/AuthContext";
import { LoginSchema, loginSchema } from "@/lib/validation/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";

const LoginPageContent = () => {
  const searchParams = useSearchParams();
  const forwardUrl = searchParams.get(FORWARD_URL);
  const { login } = useAuth();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = async (data: LoginSchema) => {
    await login(
      data,
      !forwardUrl
        ? undefined
        : typeof forwardUrl === "string"
          ? forwardUrl
          : forwardUrl[0],
    );
  };

  // async function onClickGoogleLogin() {
  //   const { url } = await googleLogin();
  //   router.push(url);
  // }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormItem>
          <FormLabel>이메일</FormLabel>
          <FormControl>
            <Input type="email" {...form.register("email")} />
          </FormControl>
          <FormMessage>{form.formState.errors.email?.message}</FormMessage>
        </FormItem>
        <FormItem>
          <FormLabel>비밀번호</FormLabel>
          <FormControl>
            <Input type="password" {...form.register("password")} />
          </FormControl>
          <FormMessage>{form.formState.errors.password?.message}</FormMessage>
        </FormItem>
        <LoadingButton
          className="w-full"
          type="submit"
          loading={form.formState.isSubmitting}
        >
          로그인
        </LoadingButton>
        {/* <div className="mt-4 flex items-center justify-between">
              <div className="h-[1px] w-full bg-slate-200 dark:bg-slate-700"></div>
              <span className="min-w-12 text-center text-xs uppercase">
                또는
              </span>
              <div className="h-[1px] w-full bg-slate-200 dark:bg-slate-700"></div>
            </div>
            <Button
              onClick={onClickGoogleLogin}
              type="button"
              variant="ghost"
              className="flex w-full gap-2 rounded-lg border border-slate-200 px-4 py-2 text-slate-700 transition duration-150 hover:border-slate-400 hover:text-slate-900 hover:shadow dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-slate-300"
            >
              <Image
                className="h-5 w-5"
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                loading="lazy"
                alt="google logo"
                width="0"
                height="0"
              />
              <span>구글로 로그인</span>
            </Button> */}
      </form>
    </Form>
  );
};

const LoginPage = () => {
  const locale = useLocale();
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-md bg-card p-8 shadow-md dark:bg-secondary">
        <div className="flex items-start">
          <Image
            className="mr-4"
            src="/logo.png"
            alt="logo"
            width={28}
            height={28}
          />
          <h1 className="text-3xl">AI WORKERS 로그인</h1>
        </div>
        <Suspense fallback={<div></div>}>
          <LoginPageContent />
        </Suspense>
        <h3>
          아직 계정이 없으신가요?{" "}
          <span className="cursor-pointer text-teal-400 underline">
            <Link href={`/${locale}/signup`}>회원가입</Link>
          </span>
        </h3>
      </div>
      <Button variant="link" className="mt-4">
        <Link href={`/${locale}`}>홈으로 돌아가기</Link>
      </Button>
    </div>
  );
};

export default LoginPage;
