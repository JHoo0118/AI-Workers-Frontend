"use client";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  const locale = useLocale();
  return (
    <Link className="w-[23rem]" href={`/${locale}`} aria-label="Home">
      <div className="flex items-center">
        <Image
          className="mr-4"
          src="/logo.png"
          alt="logo"
          width={28}
          height={28}
        />
        <h1 className="mr-2 text-xl font-bold lg:text-2xl xl:text-3xl">
          AI WORKERS
        </h1>
        <Badge variant="default" className="bg-blue-500 hover:bg-blue-500">
          Beta
        </Badge>
      </div>
    </Link>
  );
};

export default Logo;
