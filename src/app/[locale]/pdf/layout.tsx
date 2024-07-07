import { IsFileExistOutputs } from "@/types/file-types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "PDF",
    template: "AI WORKERS | %s",
  },
  description: "AI WORKERS",
};

export async function fetchFileExistence(
  filename: string,
): Promise<IsFileExistOutputs> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/py-api/file/exist?filename=${filename}`,
  );
  return response.json();
}

export default function PdfLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="h-screen-nav w-full overflow-auto">{children}</section>
  );
}
