import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "페이지를 찾을 수 없음",
    template: "AI WORKERS | %s",
  },
  description: "AI WORKERS",
};

export default function NotFoundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
