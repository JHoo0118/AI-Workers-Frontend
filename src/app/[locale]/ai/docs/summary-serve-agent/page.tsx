import AIDocsSummaryServeAgentContainer from "@/components/AI/Docs/AIDocsSummaryServeAgentContainer";
import AuthGuard from "@/components/Auth/AuthGuard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent 문서 요약 제공",
};

function AIDocsSummaryServeAgentPage() {
  const forwardUrl = "/ai/docs/summary-serve-agent";
  return (
    <AuthGuard forwardUrl={forwardUrl}>
      <div className="h-full overflow-y-hidden">
        <AIDocsSummaryServeAgentContainer
          acceptedFileType=".pdf"
          multiple={false}
          url={forwardUrl}
        />
      </div>
    </AuthGuard>
  );
}

export default AIDocsSummaryServeAgentPage;
