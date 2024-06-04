export type PdfMergeOutputs = {
  filename: string;
};

export type PdfSplitInputs = {
  startPageNumber: string;
  endPageNumber: string;
  files: File[];
};

export type PdfSplitOutputs = {
  filename: string;
};

export type PdfToWordOutputs = {
  result: string[];
};
