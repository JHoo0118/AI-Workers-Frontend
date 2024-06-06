import AISequenceDiagramContainer from "@/components/AI/Diagram/SequenceDiagram/AISequenceDiagramContainer";
import AuthGuard from "@/components/Auth/AuthGuard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Sequence Diagram 생성",
};

function AIErdPage() {
  const forwardUrl = "/ai/diagram/seq";
  return (
    <AuthGuard forwardUrl={forwardUrl}>
      <AISequenceDiagramContainer url={forwardUrl} />
    </AuthGuard>
  );
}

export default AIErdPage;
