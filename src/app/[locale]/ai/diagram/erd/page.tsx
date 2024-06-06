import AIErdContainer from "@/components/AI/Diagram/Erd/AIErdContainer";
import AuthGuard from "@/components/Auth/AuthGuard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI ERD 생성",
};

function AIErdPage() {
  const forwardUrl = "/ai/diagram/erd";
  return (
    <AuthGuard forwardUrl={forwardUrl}>
      <AIErdContainer url={forwardUrl} />
    </AuthGuard>
  );
}

export default AIErdPage;
