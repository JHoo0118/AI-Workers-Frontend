import PdfSplitResultContainer from "@/components/Pdf/PdfSplitResultContainer";
import { Metadata } from "next";
import { fetchFileExistence } from "../../../layout";

export const metadata: Metadata = {
  title: "PDF 분할 결과",
};

interface PdfSplitResultPageProps {
  params: { filename: string };
}

export default async function PdfSplitResultPage({
  params: { filename },
}: PdfSplitResultPageProps) {
  const fallbackData = await fetchFileExistence(filename);

  return (
    <div className="flex h-full flex-col items-center p-10">
      <PdfSplitResultContainer
        filename={filename}
        fallbackData={fallbackData}
      />
    </div>
  );
}
