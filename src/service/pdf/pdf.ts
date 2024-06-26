import { fetchInterceptors } from "@/lib/utils/fetch";
import {
  PdfMergeOutputs,
  PdfSplitInputs,
  PdfSplitOutputs,
  PdfToWordOutputs,
} from "@/types/pdf-types";

export async function pdfMerge(files: File[]): Promise<PdfMergeOutputs> {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }
  return fetchInterceptors({
    url: "/py-api/pdf/merge",
    options: {
      method: "POST",
      body: formData,
    },
    isMultipart: true,
  });
}

export async function pdfSplit({
  startPageNumber,
  endPageNumber,
  files,
}: PdfSplitInputs): Promise<PdfSplitOutputs> {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
    formData.append("startPageNumber", startPageNumber);
    formData.append("endPageNumber", endPageNumber);
  }
  return fetchInterceptors({
    url: "/py-api/pdf/split",
    options: {
      method: "POST",
      body: formData,
    },
    isMultipart: true,
  });
}

export async function pdfToWord(files: File[]): Promise<PdfToWordOutputs> {
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }
  return fetchInterceptors({
    url: "/py-api/pdf/convert/word",
    options: {
      method: "POST",
      body: formData,
    },
    isMultipart: true,
  });
}
