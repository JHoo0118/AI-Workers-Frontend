"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { deleteTokens } from "@/lib/utils/auth";
import { deleteUser } from "@/service/auth/auth";
import useUserStore from "@/store/userStore";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LeaveContainer() {
  useRequireAuth({ forwardUrl: "/account/settings" });
  const { setUser } = useUserStore();
  const { renewalUser } = useAuth();
  const user = useUserStore((state) => state.user);
  const [confirmText, setConfirmText] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(true);
  const router = useRouter()
  const locale = useLocale();

  const onSubmit = async () => {
    if (confirmText !== `${user?.email}/회원탈퇴`) {
      return;
    }
    toast.promise(deleteUser(), {
      loading: "회원탈퇴 중입니다...",
      success: (data: boolean) => {
        deleteTokens();
        setUser(undefined);
        router.replace(`/${locale}`);
        return <b>성공적으로 회원탈퇴 되었습니다.</b>;
      },
      error: (error) => {
        return <b>회원탈퇴에 실패했습니다. 다시 시도해 주세요.</b>;
      },
    });
  };

  function handleChange(event: any) {
    if (event.target.value === `${user?.email}/회원탈퇴`) {
      setDisabled(false);
    } else if (!disabled) {
      setDisabled(true);
    }
    setConfirmText(event.target.value);
  }

  return (
    <div className="mt-4 max-w-[30rem] space-y-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">회원탈퇴</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>회원탈퇴</DialogTitle>
            <DialogDescription>
              정말 회원탈퇴를 하시겠습니까? 회원탈퇴를 하시려면{" "}
              <span className="font-bold text-secondary-foreground">
                {user?.email}/회원탈퇴
              </span>{" "}
              라고 입력해 주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="confirm"
                value={confirmText}
                onChange={handleChange}
                placeholder={user?.email + "/회원탈퇴"}
                className="col-span-4"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="w-full"
              disabled={disabled}
              variant="destructive"
              type="button"
              onClick={() => onSubmit()}
            >
              회원탈퇴
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
