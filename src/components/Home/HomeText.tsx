"use client";

import useLocaleRedirect from "@/hooks/useLocaleRedirect";

export default function HomeText() {
  useLocaleRedirect();
  return (
    <div className="mx-auto flex flex-col">
      <h1 className="text-center text-2xl font-semibold md:text-3xl lg:text-4xl">
        다양한 AI 툴을 이용해 보세요.
      </h1>
      <span className="mb-10 mt-2 block text-center text-base font-normal text-neutral-500 dark:text-neutral-400 sm:text-xl md:mt-3">
        다양한 도구를 설치 없이 사용 가능
      </span>
    </div>
  );
}
