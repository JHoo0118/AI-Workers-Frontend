import { useRef } from "react";

export function useThrottle(callback: (...args: any[]) => void, delay: number) {
  const lastCall = useRef<number | null>(null);

  return (...args: any[]) => {
    const now = new Date().getTime();
    if (lastCall.current === null || now - lastCall.current > delay) {
      lastCall.current = now;
      callback(...args);
    }
  };
}
