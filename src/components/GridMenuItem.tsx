"use client";
import { Menu } from "@/lib/data/menu";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface GridMenuItemProps {
  menu: Menu;
}

export default function GridMenuItem({
  menu: { title, content, href },
}: GridMenuItemProps) {
  const locale = useLocale();
  return (
    <Link href={`/${locale}${href}`}>
      <Card className="flex min-h-36 flex-col justify-start bg-gray-100 dark:bg-card sm:min-h-52 md:min-h-60 md:justify-between">
        <CardHeader>
          <CardTitle className="line-clamp-3 leading-7">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{content}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
