import AIDocsSummaryAgentContainer from "@/components/AI/Docs/AIDocsSummaryAgentContainer";
import AuthGuard from "@/components/Auth/AuthGuard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent 문서 요약 & 질문",
};

function AIDocsSummaryAgentPage() {
  const forwardUrl = "/ai/docs/summary-agent";
  return (
    <AuthGuard forwardUrl={forwardUrl}>
      <AIDocsSummaryAgentContainer
        acceptedFileType=".pdf, .docx, .txt, .rtf"
        multiple={false}
        url={forwardUrl}
      />
    </AuthGuard>
  );
}

export default AIDocsSummaryAgentPage;
