import MainHeader from "@/components/Header/MainHeader";
import { AuthProvider } from "@/context/AuthContext";
import SWRConfigContext from "@/context/SWRConfigContext";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Open_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { locales } from "../../config";
import { ThemeProvider } from "./ThemeProvider";

const openSans = Open_Sans({ subsets: ["latin"] });

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

// export const metadata: Metadata = {
//   title: {
//     default: "AI WORKERS",
//     template: "AI WORKERS | %s",
//   },
//   description: "AI WORKERS",
// };

export async function generateMetadata({
  params: { locale },
}: Omit<Props, "children">) {
  const t = await getTranslations({ locale, namespace: "LocaleLayout" });

  return {
    // title: t('title')
    title: {
      default: t("title"),
      template: `${t("title")} | %s`,
    },
    description: t("title"),
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  unstable_setRequestLocale(locale);

  return (
    <html lang={locale} className={openSans.className}>
      <body className="w-full overflow-auto">
        <AuthProvider>
          <ThemeProvider attribute="class">
            <MainHeader />
            <main className="w-full">
              <Toaster position="top-center" />
              <SWRConfigContext>{children}</SWRConfigContext>
            </main>
            <div id="portal" />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
