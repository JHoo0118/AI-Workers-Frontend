"use client";

import Logo from "@/components/Logo/Logo";
import { useLocale } from "next-intl";
import Link from "next/link";
import React from "react";

const Footer: React.FC = () => {
  const locale = useLocale();
  return (
    <footer className="mt-20 bg-gray-100 dark:bg-card">
      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="grid gap-14 lg:grid-cols-2 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div className="col-span-2 text-xs text-gray-500 dark:text-gray-400">
                <Logo />
                <br />
                <h3 className="text-sm text-gray-400">KIMJUNGHOO</h3>
              </div>

              {/* <div className="mt-4 flex items-center justify-between">
                <SocialsList itemClass="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-xl" />
              </div> */}
            </div>
            <div className="grid grid-cols-1 gap-8">
              <h4 className="text-sm font-semibold uppercase leading-5 tracking-wider text-gray-400 dark:text-gray-300">
                Legal
              </h4>
              <ul className="mt-4">
                <li>
                  <Link
                    className="text-base leading-6 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                    href={`/${locale}/policies/terms`}
                  >
                    이용약관
                  </Link>
                </li>
                <li className="mt-4">
                  <Link
                    className="text-base leading-6 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                    href={`/${locale}/policies/privacy-policy`}
                  >
                    개인정보처리방침
                  </Link>
                </li>
                <li className="mt-4">
                  <Link
                    className="text-base leading-6 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                    href={`/${locale}/policies/security`}
                  >
                    데이터 프라이버시 및 보안
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center xl:mt-0"></div>
        </div>

        <hr className="mt-10" />
        <div className="mt-10 flex justify-between">
          <p className="text-center text-base leading-6 text-gray-400 md:order-1 md:mt-0 md:text-left">
            © 2024 AI WORKERS. All rights reserved.
          </p>
          {/* <SocialsList /> */}
        </div>
      </div>
    </footer>

    // <div className="nc-Footer relative border-t border-neutral-200 py-16 dark:border-neutral-700 lg:py-28">
    //   <div className="container grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-10 ">
    //     <div className="col-span-2 grid grid-cols-4 gap-5 md:col-span-4 lg:md:col-span-1 lg:flex lg:flex-col">
    //       <div className="col-span-2 md:col-span-1">
    //         <Logo />
    //       </div>
    //       <div className="col-span-2 flex items-center md:col-span-3">
    //         <SocialsList1 className="flex items-center space-x-3 lg:flex-col lg:items-start lg:space-x-0 lg:space-y-2.5" />
    //       </div>
    //     </div>
    //     <div className="text-sm">
    //       <h2 className="font-semibold text-neutral-700 dark:text-neutral-200"></h2>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Footer;
