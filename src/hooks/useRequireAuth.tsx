"use client";

import { ACCESS_TOKEN } from "@/const/const";
import { hasCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export interface UseRequireAuthProps {
  forwardUrl?: string;
}

export const useRequireAuth = ({ forwardUrl }: UseRequireAuthProps) => {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = () => {
      const hasToken = hasCookie(ACCESS_TOKEN);
      return hasToken;
    };

    // Redirect to login page if not authenticated
    if (!isAuthenticated()) {
      router.replace(
        !!forwardUrl ? `/login?forwardUrl=${forwardUrl}` : "/login",
      );
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Perform the authentication check again
        if (!isAuthenticated()) {
          router.push(
            !!forwardUrl ? `/login?forwardUrl=${forwardUrl}` : "/login",
          );
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router, forwardUrl]);
};
