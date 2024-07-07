import {
  ReturnType,
  fetchDownloadInterceptors,
  fetchInterceptors,
} from "@/lib/utils/fetch";
import {
  FileDonwloadInputs,
  IsFileExistInputs,
  IsFileExistOutputs,
} from "@/types/file-types";

export async function filePublicDelete({
  filename,
}: FileDonwloadInputs): Promise<boolean> {
  return fetchInterceptors({
    url: `/py-api/file/public/delete/${filename}`,
    options: {
      method: "DELETE",
    },
  });
}

export async function fileDonwload({
  filename,
}: FileDonwloadInputs): Promise<Response> {
  return fetchDownloadInterceptors({
    url: `/py-api/file/download/${filename}`,
    options: {
      method: "GET",
    },
    returnType: ReturnType.BLOB,
  });
}

export async function fetchFileExistenceSSR({
  filename,
}: IsFileExistInputs): Promise<IsFileExistOutputs> {
  return fetchInterceptors({
    url: `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/file/exist?filename=${filename}`,
    options: {
      method: "GET",
    },
  });
}
