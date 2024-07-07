"use client";
import LoginPageContent from "@/components/Auth/LoginPageContent";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { HashLoader } from "react-spinners";

const LoginPage = () => {
  const locale = useLocale();
  return (
    <div className="flex h-full flex-col">
      <div className="m-auto flex w-full max-w-md flex-col">
        <div className="space-y-6 rounded-md bg-card p-8 shadow-md dark:bg-secondary">
          <div className="flex items-center">
            <Image
              className="mr-4"
              src="/logo.png"
              alt="logo"
              width={28}
              height={28}
            />
            <h1 className="text-xl sm:text-3xl">AI WORKERS 로그인</h1>
          </div>
          <Suspense fallback={<HashLoader size={90} color="#2DD4BF" />}>
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
    </div>
  );
};

export default LoginPage;
