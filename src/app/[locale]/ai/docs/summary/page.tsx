import AIDocsSummaryContainer from "@/components/AI/Docs/AIDocsSummaryContainer";
import AuthGuard from "@/components/Auth/AuthGuard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 문서 요약 & 질문",
};

function AIDocsSummaryPage() {
  const forwardUrl = "/ai/docs/summary";
  return (
    <AuthGuard forwardUrl={forwardUrl}>
      <AIDocsSummaryContainer
        acceptedFileType=".pdf, .docx, .txt, .rtf"
        multiple={false}
        url={forwardUrl}
      />
    </AuthGuard>
  );
}

export default AIDocsSummaryPage;
