import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "AI",
    template: "AI WORKERS | %s",
  },
  description: "AI WORKERS",
};

export default function AILayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="h-screen-nav w-full overflow-auto">{children}</section>
  );
}
