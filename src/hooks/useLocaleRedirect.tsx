import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useLocaleRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const hasLocale = /^\/(en|ko)/.test(path);

      if (!hasLocale) {
        const preferredLocale = navigator.language.startsWith("ko")
          ? "ko"
          : "en";
        const newPath = `/${preferredLocale}${path}`;

        router.replace(newPath);
      }
    }
  }, [router]);
};

export default useLocaleRedirect;
