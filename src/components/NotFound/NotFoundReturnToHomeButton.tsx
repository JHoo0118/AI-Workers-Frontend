"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { Button } from "../ui/button";

export default function NotFoundReturnToHomeButton() {
  const locale = useLocale();
  return (
    <Button variant="link" className="mt-4">
      <Link href={`/${locale}`}>홈으로 돌아가기</Link>
    </Button>
  );
}
