import AIAlgorithmAdviceContainer from "@/components/AI/Code/Algorithm/AIAlgorithmAdviceContainer";
import AuthGuard from "@/components/Auth/AuthGuard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Algorithm 조언",
};

function AIAlgorithmAdvicePage() {
  const forwardUrl = "/ai/code/algorithm";
  return (
    <AuthGuard forwardUrl={forwardUrl}>
      <AIAlgorithmAdviceContainer url={forwardUrl} />;
    </AuthGuard>
  );
}

export default AIAlgorithmAdvicePage;
