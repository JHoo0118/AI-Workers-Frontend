"use client";

import { ACCESS_TOKEN } from "@/const/const";
import { hasCookie } from "cookies-next";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export interface UseRequireAuthProps {
  forwardUrl?: string;
}

export const useRequireAuth = ({ forwardUrl }: UseRequireAuthProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    const isAuthenticated = () => {
      const hasToken = hasCookie(ACCESS_TOKEN);
      return hasToken;
    };

    // Redirect to login page if not authenticated
    if (!isAuthenticated()) {
      router.replace(
        !!forwardUrl
          ? `/${locale}/login?forwardUrl=/${locale}/${forwardUrl}`
          : `/${locale}/login`,
      );
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Perform the authentication check again
        if (!isAuthenticated()) {
          router.push(
            !!forwardUrl
              ? `/${locale}/login?forwardUrl=/${locale}/${forwardUrl}`
              : `/${locale}/login`,
          );
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router, forwardUrl, locale]);
};
