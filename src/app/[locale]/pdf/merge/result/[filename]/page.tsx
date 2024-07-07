import PdfMergeResultContainer from "@/components/Pdf/PdfMergeResultContainer";
import { Metadata } from "next";
import { fetchFileExistence } from "../../../layout";

export const metadata: Metadata = {
  title: "PDF 병합 결과",
};

interface PdfMergeResultPageProps {
  params: { filename: string };
}

export default async function PdfMergeResultPage({
  params: { filename },
}: PdfMergeResultPageProps) {
  const fallbackData = await fetchFileExistence(filename);

  return (
    <div className="flex h-full flex-col items-center p-10">
      <PdfMergeResultContainer
        filename={filename}
        fallbackData={fallbackData}
      />
    </div>
  );
}
