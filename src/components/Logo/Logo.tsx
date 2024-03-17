"use client";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  const locale = useLocale();
  return (
    <Link className="w-[20rem]" href={`/${locale}`} aria-label="Home">
      <div className="flex items-center">
        <Image
          className="mr-4"
          src="/logo.png"
          alt="logo"
          width={28}
          height={28}
        />
        <h1 className="text-3xl font-bold">AI WORKERS</h1>
      </div>
    </Link>
  );
};

export default Logo;
