import { ACCESS_TOKEN } from "@/const/const";
import { refreshTokens } from "@/service/auth/auth";
import { getCookie, hasCookie } from "cookies-next";

export enum ReturnType {
  JSON,
  BLOB,
}

interface FetchArgs {
  url: string;
  options?: RequestInit;
  returnType?: ReturnType;
  isRequiredAccessToken?: boolean;
  isMultipart?: boolean;
}

interface FetchStreamArgs {
  url: string;
  options?: RequestInit;
  isRequiredAccessToken?: boolean;
}
let refreshTokenPromise: Promise<any> | null = null;

export async function fetchInterceptors({
  url,
  options = {},
  returnType = ReturnType.JSON,
  isRequiredAccessToken = false,
  isMultipart = false,
}: FetchArgs) {
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const originHeaders = options.headers ?? new Headers();

  if (isRequiredAccessToken && !hasCookie(ACCESS_TOKEN)) {
    throw new Error("인증에 실패했습니다.");
  }

  options.headers = {
    ...(originHeaders && { ...originHeaders }),
    ...(!Object.prototype.hasOwnProperty.call(originHeaders, "Content-Type") &&
      !isMultipart && { ...defaultHeaders }),
    ...(isRequiredAccessToken && {
      Authorization: `Bearer ${getCookie(ACCESS_TOKEN)}`,
    }),
  };

  try {
    let res = await fetch(url, options);

    if (res.status === 409) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokens();
        await refreshTokenPromise;
        refreshTokenPromise = null;
      }

      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${getCookie(ACCESS_TOKEN)}`,
      };

      res = await fetch(url, options);
    }

    if (!res.ok) {
      const errorResp = await res.json().catch((e) => "오류가 발생했습니다.");
      if (errorResp.hasOwnProperty("detail")) {
        throw new Error(
          typeof errorResp["detail"] === "string"
            ? errorResp["detail"]
            : "오류가 발생했습니다.",
        );
      }
      throw new Error(`HTTP error, status = ${res.status}`);
    }

    if (returnType === ReturnType.BLOB) {
      return await res.blob();
    }
    return await res.json();
  } catch (error: any) {
    throw error?.message || "오류가 발생했습니다.";
  }
}

export async function fetchStreamInterceptors({
  url,
  options = {},
  isRequiredAccessToken = false,
}: FetchStreamArgs) {
  const originHeaders = options.headers ?? new Headers();

  if (isRequiredAccessToken && !hasCookie(ACCESS_TOKEN)) {
    throw new Error("인증에 실패했습니다.");
  }

  options.headers = {
    ...(originHeaders && { ...originHeaders }),
    ...(!Object.prototype.hasOwnProperty.call(
      originHeaders,
      "Content-Type",
    ) && { "Content-Type": "application/json" }),
    ...(!Object.prototype.hasOwnProperty.call(originHeaders, "Accept") && {
      Accept: "text/event-stream",
    }),
    ...(isRequiredAccessToken && {
      Authorization: `Bearer ${getCookie(ACCESS_TOKEN)}`,
    }),
  };

  try {
    let res = await fetch(url, options);

    if (res.status === 409) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokens();
        await refreshTokenPromise;
        refreshTokenPromise = null;
      }

      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${getCookie(ACCESS_TOKEN)}`,
      };

      res = await fetch(url, options);
    }

    if (!res.ok) {
      const errorResp = await res.json();
      if (errorResp.hasOwnProperty("detail")) {
        throw new Error(
          typeof errorResp["detail"] === "string"
            ? errorResp["detail"]
            : "오류가 발생했습니다.",
        );
      }
      throw new Error(`HTTP error, status = ${res.status}`);
    }

    const stream = res.body;
    const reader = stream?.getReader();

    console.log(stream, reader);

    const readChunk = async () => {
      try {
        let { value, done }: any = await reader?.read();
        console.log(value, done);
        if (done) {
          console.log("Stream finished");
          return;
        }
        const chunkString = new TextDecoder().decode(value);
        console.log(chunkString);
      } catch (error) {
        console.error(error);
      }
    };

    await readChunk();
  } catch (error: any) {
    throw error?.message || "오류가 발생했습니다.";
  }
}
