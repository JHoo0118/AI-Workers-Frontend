import MainHeader from "@/components/Header/MainHeader";
import { AuthProvider } from "@/context/AuthContext";
import SWRConfigContext from "@/context/SWRConfigContext";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { Open_Sans } from "next/font/google";
import { Metadata } from "next/types";
import { Toaster } from "react-hot-toast";
import { locales } from "../../config";
import "../globals.css";
import { ThemeProvider } from "./ThemeProvider";

const openSans = Open_Sans({ subsets: ["latin"] });

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale },
}: Omit<Props, "children">): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "LocaleLayout" });

  return {
    title: {
      default: t("title"),
      template: `${t("title")} | %s`,
    },
    metadataBase: new URL(process.env.BASE_URL!),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      images: "/logo.png",
      // <meta property="og:image:width" content="1200" />
      // <meta property="og:image:height" content="630" />
    },
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
    <html lang={locale} className={`dark ${openSans.className}`}>
      <head>
        <meta name="google-adsense-account" content="ca-pub-7740654158068459" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7740654158068459"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="w-full overflow-auto">
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
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
