import PdfMergeResultContainer from "@/components/Pdf/PdfMergeResultContainer";
import { fetchFileExistenceSSR } from "@/service/file/file";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF 병합 결과",
};

interface PdfMergeResultPageProps {
  params: { filename: string };
}

export default async function PdfMergeResultPage({
  params: { filename },
}: PdfMergeResultPageProps) {
  const fallbackData = await fetchFileExistenceSSR({ filename });

  return (
    <div className="flex h-full flex-col items-center p-10">
      <PdfMergeResultContainer
        filename={filename}
        fallbackData={fallbackData}
      />
    </div>
  );
}
