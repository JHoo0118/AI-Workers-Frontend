import AICodeConverterContainer from "@/components/AI/Code/CodeConverter/AICodeConverterContainer";
import AuthGuard from "@/components/Auth/AuthGuard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 코드 변환",
};

function AICodeConverter() {
  const forwardUrl = "/ai/code/codeconvert";
  return (
    <AuthGuard forwardUrl={forwardUrl}>
      <AICodeConverterContainer url={forwardUrl} />
    </AuthGuard>
  );
}

export default AICodeConverter;
