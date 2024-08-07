import PdfToWordResultContainer from "@/components/Pdf/PdfToWordResultContainer";
import { fetchFileExistenceSSR } from "@/service/file/file";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF 변환 결과",
};
interface PdfToWordResultPageProps {
  params: { filename: string };
}

export default async function PdfToWordResultPage({
  params: { filename },
}: PdfToWordResultPageProps) {
  const fallbackData = await fetchFileExistenceSSR({ filename });

  return (
    <div className="flex h-full flex-col items-center p-10">
      <PdfToWordResultContainer
        filename={filename}
        fallbackData={fallbackData}
      />
    </div>
  );
}
