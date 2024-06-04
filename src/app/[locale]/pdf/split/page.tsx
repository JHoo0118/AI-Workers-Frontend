import PdfSplitContainer from "@/components/Pdf/PdfSplitContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF 분할하기",
};

export default function PdfToWordPage() {
  return (
    <PdfSplitContainer
      acceptedFileType=".pdf"
      maxAllowedFileCount={1}
      multiple={false}
    />
  );
}
