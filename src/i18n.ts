import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "./config";

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (
      await (locale === "ko"
        ? // When using Turbopack, this will enable HMR for `en`
          import("../messages/ko.json")
        : import(`../messages/${locale}.json`))
    ).default,
  };
});
