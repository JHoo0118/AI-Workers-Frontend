"use client";
import toast, { Toast } from "react-hot-toast";
import { Button } from "../ui/button";

interface WarningToastProps {
  t: Toast;
  message: string;
  onClickDissmiss?: () => void;
}

export default function WarningToast({
  t,
  message,
  onClickDissmiss,
}: WarningToastProps) {
  return (
    <span>
      {message}
      <Button
        variant="secondary"
        size="icon-sm"
        className="ml-2"
        onClick={() => {
          onClickDissmiss && onClickDissmiss();
          toast.dismiss(t.id);
        }}
      >
        닫기
      </Button>
    </span>
  );
}
