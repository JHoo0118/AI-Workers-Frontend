"use client";
import withDragAndDropFiles, {
  AcceptedFile,
  DragAndDropFilesComponentProps,
  DragAndDropFilesWrappedProps,
} from "@/hoc/withDragAndDropFiles";
import useMenu from "@/hooks/useMenu";
import { cn } from "@/lib/utils/utils";
import { pdfSplit } from "@/service/pdf/pdf";
import { PdfSplitOutputs } from "@/types/pdf-types";
import { FileInputIcon, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import DragAndDropPdf from "../DragAndDrop/DragAndDropPdf";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";

interface PdfSplitContainerProps
  extends DragAndDropFilesWrappedProps,
    DragAndDropFilesComponentProps {}

function PdfSplitContainer({
  dragActive,
  inputRef,
  files,
  setFiles,
  openFileExplorer,
  handleChange,
  handleDrop,
  handleDragLeave,
  handleDragOver,
  handleDragEnter,
  removeFile,
  acceptedFileType,
}: PdfSplitContainerProps) {
  const url = "/pdf/split";
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { title, content } = useMenu(url);
  const [lastPage, setLastPage] = useState<number>();
  const [startInputPageNumber, setStartInputPageNumber] = useState<string>("1");
  const [endInputPageNumber, setEndInputPageNumber] = useState<string>();

  async function handleSubmitMergePdfFiles(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!startInputPageNumber || !endInputPageNumber) {
      toast.error("페이지 범위를 설정해 주세요.");
      return;
    }
    if (
      parseInt(startInputPageNumber) < 1 ||
      parseInt(endInputPageNumber) > lastPage!
    ) {
      toast.error("올바른 페이지 범위를 설정해 주세요.");
      return;
    }
    setLoading(true);
    toast.promise(
      pdfSplit({
        startPageNumber: startInputPageNumber,
        endPageNumber: endInputPageNumber!,
        files: files.map((acceptedFile: AcceptedFile) => acceptedFile.file),
      }).finally(() => setLoading(false)),
      {
        loading: "분할 중...",
        success: (data: PdfSplitOutputs) => {
          router.push(`/${locale}/pdf/split/result/${data.filename}`);
          return <b>PDF가 분할되었습니다.</b>;
        },
        error: (error) => <b>{error}</b>,
      },
    );
  }

  const handleStartPageInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setStartInputPageNumber(event.target.value);
  };
  const handleEndPageInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEndInputPageNumber(event.target.value);
  };

  return (
    <div className="relative flex h-full justify-center px-4">
      {files?.length === 0 && (
        <div className="flex flex-col items-center overflow-x-hidden py-10">
          <h1 className="text-4xl">{title}</h1>
          <p className="leading-7 [&:not(:first-child)]:mt-6">{content}</p>
          <Button
            className={cn("mt-4 min-w-80", !dragActive && "z-10")}
            type="button"
            size="2xl"
            variant="default"
            onClick={openFileExplorer}
          >
            PDF 파일 선택
          </Button>
          <h3 className="mt-4 text-sm">또는 PDF를 여기에 두기</h3>
        </div>
      )}

      <DragAndDropPdf
        dragActive={dragActive}
        inputRef={inputRef}
        files={files}
        setFiles={setFiles}
        handleChange={handleChange}
        handleDrop={handleDrop}
        handleDragLeave={handleDragLeave}
        handleDragOver={handleDragOver}
        handleDragEnter={handleDragEnter}
        removeFile={removeFile}
        acceptedFileType={acceptedFileType}
        sortable={false}
        setLastPage={setLastPage}
        sideBarContent={
          <div className="flex h-full flex-col justify-between py-2">
            <div>
              <h1 className="mb-6 mt-2 text-3xl">{title}</h1>
              <Card className="mb-4 rounded-none border-gray-500 bg-gray-500 text-white">
                <CardContent className="p-5">PDF를 분할합니다.</CardContent>
              </Card>
              <Button
                className="w-full"
                type="button"
                size="lg"
                onClick={openFileExplorer}
                disabled={loading}
              >
                <FileInputIcon className="mr-2 h-4 w-4" />
                파일 변경
              </Button>
              <div className="mt-4 lg:mt-6">
                <h3 className="text-sm md:text-lg">
                  페이지 범위 설정(총 {lastPage} 페이지)
                </h3>
                <div className="mt-2 flex items-center justify-between space-x-4 px-4">
                  <Input
                    className="w-[80px]"
                    type="number"
                    value={startInputPageNumber}
                    min="1"
                    max={lastPage || 1}
                    onChange={handleStartPageInputChange}
                  />
                  <span>~</span>
                  <Input
                    className="w-[80px]"
                    type="number"
                    value={endInputPageNumber}
                    min="1"
                    max={lastPage || 1}
                    onChange={handleEndPageInputChange}
                  />
                </div>
              </div>
            </div>
            <Button
              className="mt-10"
              disabled={files?.length <= 0 || loading}
              onClick={handleSubmitMergePdfFiles}
              variant="default"
              size="2xl"
            >
              {loading && <Loader2 className="mr-4 animate-spin" />}
              분할하기
            </Button>
          </div>
        }
      />

      {dragActive && (
        <h1 className="pointer-events-none absolute z-10 flex h-full items-center justify-center text-7xl text-white">
          파일을 여기에 두세요.
        </h1>
      )}
    </div>
  );
}

export default withDragAndDropFiles(PdfSplitContainer);
