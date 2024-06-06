"use client";

import { menus } from "@/lib/data/menu";
import useUserStore from "@/store/userStore";
import { useLocale } from "next-intl";
import Link from "next/link";
import ThemeToggleButton from "../Button/ThemeToggleButton";
import Logo from "../Logo/Logo";
import DrawerSSEButton from "../SSE/DrawerSSEButton";
import { Button } from "../ui/button";
import { DropdownIcon } from "./DropdownIcon";
import NavItem from "./NavItem";
import RemainCountIcon from "./RemainCountIcon";

export default function Navbar() {
  const user = useUserStore((state) => state.user);
  const locale = useLocale();

  return (
    <div className="flex h-nav flex-1 items-center justify-between px-6">
      <Logo />
      <nav className="flex w-full items-center justify-between">
        <ul className="flex items-center gap-4 p-4">
          {menus.map((menu) => (
            <NavItem menu={menu} key={menu.id} />
          ))}
        </ul>
        {user ? (
          <div className="flex items-center justify-center">
            <RemainCountIcon remainCount={user.remainCount ?? 0} />
            <DropdownIcon />
            <DrawerSSEButton />
            <ThemeToggleButton />
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Button className="mr-4" asChild variant="ghost">
              <Link href={`/${locale}/login`}>로그인</Link>
            </Button>
            <Button className="mr-4" asChild>
              <Link href={`/${locale}/signup`}>가입하기</Link>
            </Button>
            <ThemeToggleButton />
          </div>
        )}
      </nav>
    </div>
  );
}
