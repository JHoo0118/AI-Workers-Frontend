"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import Loading from "../Loading/Loading";

interface AuthGuardProps {
  children: React.ReactNode;
  checkRemainCount?: boolean;
  forwardUrl?: string;
}

const AuthGuard = ({
  children,
  forwardUrl,
  checkRemainCount,
}: AuthGuardProps) => {
  const { isLoading } = useRequireAuth({ forwardUrl, checkRemainCount });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading message="잠시만 기다려주세요..." />
      </div>
    );
  }
  return <>{children}</>;
};

export default AuthGuard;
