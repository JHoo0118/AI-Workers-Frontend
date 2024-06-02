import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Portfolio",
    template: "AI WORKERS | %s",
  },
  description: "AI WORKERS",
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div>{children}</div>
    </section>
  );
}
