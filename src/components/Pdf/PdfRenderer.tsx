"use client";
import { AcceptedFile } from "@/hoc/withDragAndDropFiles";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useResizeDetector } from "react-resize-detector";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

interface PdfRendererProps {
  acceptedFile: AcceptedFile;
  numPages: number;
  setNumPages: (numPages: number) => void;
  pageNumber: number;
  setPageNumber: (pageNumber: number) => void;
  inputPageNumber: string;
  setInputPageNumber: (inputPageNumber: string) => void;
}

const options = {
  // cMapUrl: "cmaps/",
  cMapPacked: true,
  // length: 1,
  standardFontDataUrl: "standard_fonts/",
};

const PdfRenderer = ({
  acceptedFile,
  numPages,
  setNumPages,
  pageNumber,
  setPageNumber,
  setInputPageNumber,
}: PdfRendererProps) => {
  const [uint8Arr, setUint8Arr] = useState<Uint8Array>();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setInputPageNumber("1");
  }

  const handleResize = useCallback(() => {
    setUint8Arr(getUint8Array(acceptedFile.fileData!));
  }, [acceptedFile]);

  const file = useMemo(
    () => ({
      data: new Uint8Array(Buffer.from(acceptedFile.fileData!, "base64")),
    }),
    [acceptedFile],
  );
  const onResize = useCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  const { width, height, ref } = useResizeDetector({
    handleHeight: true,
    refreshRate: 1000,
    onResize,
  });

  useEffect(() => {
    window.addEventListener("resize", handleResize, false);
    if (
      acceptedFile.file &&
      acceptedFile.fileData &&
      acceptedFile.fileData?.length > 0 &&
      !uint8Arr
    ) {
      setUint8Arr(getUint8Array(acceptedFile.fileData!));
    }
    return () => {
      window.removeEventListener("resize", handleResize, false);
    };
  }, [height, acceptedFile, uint8Arr, handleResize]);

  function getUint8Array(base64Str: string): Uint8Array {
    return new Uint8Array(Buffer.from(base64Str, "base64"));
  }

  return (
    <div
      className="relative h-full overflow-auto"
      ref={ref as React.LegacyRef<HTMLDivElement>}
    >
      <Document
        file={file}
        renderMode="canvas"
        options={options}
        loading={false}
        error={false}
        onLoadSuccess={onDocumentLoadSuccess}
        className="flex h-full justify-center overflow-y-hidden lg:overflow-auto"
      >
        <Page pageNumber={pageNumber} width={width} height={height}></Page>
      </Document>
    </div>
  );
};

export default memo(PdfRenderer);
