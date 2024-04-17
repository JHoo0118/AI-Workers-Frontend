"use client";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { Card, CardContent } from "../ui/card";

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

const GoogleAd = () => {
  const params = useParams();
  const adsLoaded = useRef(false);
  // useEffect(() => {
  //   (window.adsbygoogle = window.adsbygoogle || []).push({});
  // }, []);
  useEffect(() => {
    const loadAd = () => {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        adsLoaded.current = true;
      }
    };

    if (params && !adsLoaded.current) {
      setTimeout(loadAd, 0);
    }
  }, [params]);

  return (
    <Card className="flex min-h-60 flex-col justify-start bg-gray-100 dark:bg-card sm:min-h-60 md:min-h-80 md:justify-between">
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
