import { AcceptedFile } from "@/hoc/withDragAndDropFiles";
import { cn } from "@/lib/utils/utils";
import PdfAsImage from "./PdfAsImage";

interface PdfSortableListDragHandleItemProps {
  acceptedFile: AcceptedFile;
  sortable: boolean;
  setLastPage?: (lastPage: number) => void;
}

export default function PdfSortableListDragHandleItem({
  acceptedFile,
  sortable,
  setLastPage,
}: PdfSortableListDragHandleItemProps) {
  return (
    <div
      className={cn(
        "aspect-[3/4] w-full rounded-xl bg-gray-100 px-4 py-2 ring-1 ring-primary dark:bg-card",
        sortable ? "cursor-grab" : "cursor-default",
      )}
    >
      <PdfAsImage
        acceptedFile={acceptedFile}
        setLastPage={setLastPage}
      ></PdfAsImage>
      <h1 className="truncate text-sm">{acceptedFile.file.name}</h1>
    </div>
  );
}
