"use client";
import { useEffect } from "react";
import { Card, CardContent } from "../ui/card";

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

const GoogleAd = () => {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <Card className="flex min-h-36 flex-col justify-start bg-gray-100 dark:bg-card sm:min-h-52 md:min-h-60 md:justify-between">
      <CardContent>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-format="fluid"
          data-ad-layout-key="-6t+ed+2i-1n-4w"
          data-ad-client="ca-pub-7740654158068459"
          data-ad-slot="9747476355"
        />
      </CardContent>
    </Card>
  );
};

export default GoogleAd;
