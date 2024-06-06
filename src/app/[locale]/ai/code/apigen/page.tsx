import AIApiGenContainer from "@/components/AI/Code/ApiGen/AIApiGenContainer";
import AuthGuard from "@/components/Auth/AuthGuard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI API 생성",
};

function AIApiGenPage() {
  const forwardUrl = "/ai/code/apigen";
  return (
    <AuthGuard forwardUrl={forwardUrl}>
      <AIApiGenContainer url={forwardUrl} />
    </AuthGuard>
  );
}

export default AIApiGenPage;
