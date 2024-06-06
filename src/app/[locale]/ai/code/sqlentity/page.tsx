import AISqlEntityContainer from "@/components/AI/Code/SqlEntity/AISqlEntityContainer";
import AuthGuard from "@/components/Auth/AuthGuard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI API 생성",
};

function AISqlEntityPage() {
  const forwardUrl = "/ai/code/sqlentity";
  return (
    <AuthGuard forwardUrl={forwardUrl}>
      <AISqlEntityContainer url={forwardUrl} />
    </AuthGuard>
  );
}

export default AISqlEntityPage;
