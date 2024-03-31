import AIAlgorithmAdviceContainer from "@/components/AI/Code/Algorithm/AIAlgorithmAdviceContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Algorithm 조언",
};

function AIAlgorithmAdvicePage() {
  return <AIAlgorithmAdviceContainer />;
}

export default AIAlgorithmAdvicePage;
