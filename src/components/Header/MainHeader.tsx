"use client";

import { cn } from "@/lib/utils/utils";
import { usePathname } from "next/navigation";
import MenuBar from "../MenuBar/MenuBar";
import Navbar from "../Navigation/Navbar";

export default function MainHeader() {
  const pathname = usePathname();
  const doNotShowHeaders = ["/login", "/signup", "/account", "portfolio"];
  const showHeader = doNotShowHeaders.some((path: string) =>
    pathname.includes(path),
  )
    ? false
    : true;
  return (
    <header
      className={cn(
        "sticky top-0 z-20 border-b bg-gray-100 dark:bg-card",
        !showHeader && "hidden",
      )}
    >
      <div className="flex h-12 flex-1 items-center sm:h-14 md:h-16 lg:hidden lg:h-20">
        <MenuBar />
      </div>
      <div className="mx-auto hidden max-w-screen-2xl lg:block">
        <Navbar />
      </div>
    </header>
  );
}
