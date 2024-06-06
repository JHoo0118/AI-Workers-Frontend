"use client";

import { ACCESS_TOKEN } from "@/const/const";
import useUserStore from "@/store/userStore";
import { hasCookie } from "cookies-next";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useThrottle } from "./useThrottle";

export interface UseRequireAuthProps {
  forwardUrl?: string;
  checkRemainCount?: boolean;
}

export const useRequireAuth = ({
  forwardUrl,
  checkRemainCount,
}: UseRequireAuthProps) => {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(true);
  const throttledShowToast = useThrottle(() => {
    toast.error("잔여 횟수가 없습니다.");
  }, 1000);

  useEffect(() => {
    const isAuthenticated = () => {
      const hasToken = hasCookie(ACCESS_TOKEN);
      return hasToken;
    };

    if (!isAuthenticated()) {
      const loginUrl = forwardUrl
        ? `/${locale}/login?forwardUrl=/${locale}${forwardUrl}`
        : `/${locale}/login`;
      router.replace(loginUrl);
    } else {
      if (checkRemainCount && (!user || user?.remainCount <= 0)) {
        throttledShowToast();
        router.replace(`/${locale}`);
      } else {
        setIsLoading(false);
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (!isAuthenticated()) {
          router.push(
            !!forwardUrl
              ? `/${locale}/login?forwardUrl=/${locale}${forwardUrl}`
              : `/${locale}/login`,
          );
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router, forwardUrl, locale, checkRemainCount, user, throttledShowToast]);

  return { isLoading };
};
