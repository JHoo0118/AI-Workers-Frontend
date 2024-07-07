"use client";

import { Button } from "@/components/ui/button";

import Image from "next/image";

import SignupPageContent from "@/components/Auth/SignupPageContent";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Suspense } from "react";
import { HashLoader } from "react-spinners";

const SignupPage = () => {
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
            <h1 className="text-xl sm:text-3xl">AI WORKERS 회원가입</h1>
          </div>

          <Suspense fallback={<HashLoader size={90} color="#2DD4BF" />}>
            <SignupPageContent />
          </Suspense>
          <h3>
            이미 계정이 있으신가요?{" "}
            <span className="cursor-pointer text-teal-400 underline">
              <Link href={`/${locale}/login`}>로그인</Link>
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

export default SignupPage;
