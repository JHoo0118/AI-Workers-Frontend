"use client";

import { isAuthenticated } from "@/lib/utils/auth";
import { useLocale } from "next-intl";
import Router from "next/router";
import { ComponentType, FC, useEffect } from "react";

const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
): FC<P> => {
  const WithAuthComponent: FC<P> = (props) => {
    const locale = useLocale();
    useEffect(() => {
      if (!isAuthenticated()) {
        Router.push(`/${locale}/login`);
      }
    }, [locale]);

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
};

export default withAuth;
