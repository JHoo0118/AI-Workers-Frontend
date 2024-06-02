import AIDocsSummaryServeAgentContainer from "@/components/AI/Docs/AIDocsSummaryServeAgentContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agent 문서 요약 제공",
};

function AIDocsSummaryServeAgentPage() {
  return (
    <div className="h-full overflow-y-hidden">
      <AIDocsSummaryServeAgentContainer
        acceptedFileType=".pdf"
        multiple={false}
      />
    </div>
  );
}

export default AIDocsSummaryServeAgentPage;
