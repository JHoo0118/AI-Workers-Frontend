import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "회원가입",
    template: "AI WORKERS | %s",
  },
  description: "AI WORKERS",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="h-screen w-full">{children}</section>;
}
