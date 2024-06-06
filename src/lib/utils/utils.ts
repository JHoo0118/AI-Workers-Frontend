import { fileDonwload } from "@/service/file/file";
import { clsx, type ClassValue } from "clsx";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createRange<T>(
  length: number,
  initializer: (index: number) => T,
): T[] {
  return [...new Array(length)].map((_, index) => initializer(index));
}

export function decodeURIComponentHelper(str: string) {
  return decodeURIComponent(str.replace(/\+/g, "%20"));
}

const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

export function formatBytes(bytes: number, decimals: number = 2) {
  if (!+bytes) return "0 B";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function stopPropagate(callback: () => void) {
  return (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    callback();
  };
}

export async function fileDownload({
  filename,
  setLoading,
  setProgress,
}: {
  filename: string;
  setLoading: (loading: boolean) => void;
  setProgress: (progress: number) => void;
}) {
  setLoading(true);
  setProgress(0);
  const toastId = toast.loading("다운로드 중... 0%");
  try {
    const response = await fileDonwload({ filename });
    const contentLength = response.headers.get("Content-Length");
    if (!contentLength) {
      setLoading(false);
      throw new Error("Content-Length header is missing");
    }

    const totalLength = parseInt(contentLength, 10);
    const reader = response.body?.getReader();
    let receivedLength = 0;
    const chunks = [];
    while (true) {
      const { done, value } = await reader?.read()!;

      if (done) {
        break;
      }

      chunks.push(value);
      receivedLength += value.length;

      const progress = (receivedLength / totalLength) * 100;
      setProgress(progress);
      toast.loading(`다운로드 중... ${Math.round(progress)}%`, { id: toastId });
    }

    const blob = new Blob(chunks);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    const pFilename = decodeURIComponentHelper(filename);

    link.href = url;
    link.download = `${pFilename}`;
    link.click();
    window.URL.revokeObjectURL(url);
    toast.success("다운로드가 완료되었습니다.", {
      id: toastId,
      duration: 3000,
    });
  } catch (error) {
    toast.error("다운로드 중 오류가 발생했습니다.", {
      id: toastId,
      duration: 3000,
    });
  } finally {
    setLoading(false);
    // toast.dismiss(toastId);
  }
}
