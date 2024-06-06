// import { getCookie } from "cookies-next";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";
// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";
// import { ACCESS_TOKEN, REFRESH_TOKEN } from "./const/const";
// import { deleteTokens } from "./lib/utils/auth";
// import { RefreshTokensSchema } from "./lib/validation/refreshTokensSchema";

// export async function middleware(req: NextRequest) {
//   const { pathname, search, origin, basePath } = req.nextUrl;
//   const cookieStore = cookies();
//   const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;

//   if (
//     accessToken &&
//     (pathname.startsWith("/login") || pathname.startsWith("/signup"))
//   ) {
//     return NextResponse.redirect(new URL(`${basePath}`, origin));
//   }

//   if (req.nextUrl.pathname.startsWith("/ai")) {
//     const urlWithForward = req.nextUrl.clone();
//     urlWithForward.pathname = "/login"; // Your login route
//     urlWithForward.searchParams.set("forwardUrl", req.nextUrl.pathname);

//     const loginUrl = new URL(`${basePath}/login`, origin);
//     if (!accessToken) {
//       deleteTokens();
//       return NextResponse.redirect(urlWithForward);
//     }
//     try {
//       const accessTokenKey = process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY!;
//       jwt.verify(accessToken, accessTokenKey);
//       return NextResponse.next();
//     } catch (error) {
//       try {
//         const accessToken = getCookie(ACCESS_TOKEN)!;
//         const email = jwt.decode(accessToken)!.sub!.toString();
//         const refreshTokensSchemaInputs: RefreshTokensSchema = {
//           email,
//           refreshToken: getCookie(REFRESH_TOKEN)!,
//         };

//         await fetch("/py-api/auth/refresh-tokens", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(refreshTokensSchemaInputs),
//         });
//         return NextResponse.next();
//       } catch (error) {}
//       deleteTokens();
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   return NextResponse.next();
// }

import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { locales, pathnames } from "./config";
import { ACCESS_TOKEN } from "./const/const";

export default createMiddleware({
  defaultLocale: "ko",
  locales,
  pathnames,
  localePrefix: "as-needed",
});

export async function middleware(req: NextRequest) {
  const { pathname, origin, basePath } = req.nextUrl;
  const cookieStore = req.cookies;
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;
  const locale = "ko";

  console.log(pathname);

  if (
    accessToken &&
    (pathname.indexOf("/login") !== -1 || pathname.indexOf("/signup") !== -1)
  ) {
    return NextResponse.redirect(new URL(basePath, origin));
  }
  // const loginUrl = new URL(`${basePath}/login`, origin);
  // Protected paths requiring authentication
  // if (pathname.indexOf("/ai/") !== -1 || pathname.indexOf("/account") !== -1) {
  //   if (!accessToken) {
  //     deleteTokens();
  //     const forwardUrl = req.nextUrl.clone();
  //     forwardUrl.pathname = `/${locale}/login`;
  //     forwardUrl.searchParams.set("forwardUrl", req.nextUrl.pathname);

  //     return NextResponse.redirect(forwardUrl);
  //   }
  // }
  if (pathname === "/") {
    const cloneUrl = req.nextUrl.clone();
    cloneUrl.pathname = `/${locale}`;
    return NextResponse.redirect(cloneUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc|py-api)(.*)"],
};
