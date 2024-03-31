"use client";
import Image from "next/image";

export default function HomeFreeSection() {
  return (
    <section className="px-4 py-8 sm:py-20">
      <div className="flex flex-col items-center justify-center">
        <Image
          className="mr-4 rounded-3xl"
          src="/cuteRobot.webp"
          alt="robot"
          width={400}
          height={400}
        />
        <h1 className="mt-10 text-2xl">지금 바로 무료로 사용해 보세요!</h1>
      </div>
    </section>
  );
}
