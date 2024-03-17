import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "AI",
    template: "AI WORKERS | %s",
  },
  description: "AI WORKERS",
};

export default function DiagramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="px-4">{children}</section>;
}
