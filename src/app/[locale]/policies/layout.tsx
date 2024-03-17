import Footer from "@/components/Footer/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Policy",
    template: "AI WORKERS | %s",
  },
  description: "AI WORKERS",
};

export default function PoliciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="md:py-30 px-4 py-10 sm:py-20 lg:py-40">{children}</div>
      <Footer />
    </section>
  );
}
