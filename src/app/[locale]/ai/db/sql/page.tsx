import AIDBSqlContainer from "@/components/AI/DB/SQL/AIDBSqlContainer";
import AuthGuard from "@/components/Auth/AuthGuard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI DB 설계 및 디자인",
};

function AIDBSqlPage() {
  const forwardUrl = "/ai/db/sql";
  return (
    <AuthGuard forwardUrl={forwardUrl}>
      <AIDBSqlContainer url={forwardUrl} />
    </AuthGuard>
  );
}

export default AIDBSqlPage;
