import { useEffect } from "react";

let locks = 0;

export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return;
    const { style } = document.body;
    if (locks === 0) {
      const gutter = window.innerWidth - document.documentElement.clientWidth;
      style.overflow = "hidden";
      if (gutter > 0) style.paddingRight = `${gutter}px`;
    }
    locks += 1;
    return () => {
      locks -= 1;
      if (locks === 0) {
        style.overflow = "";
        style.paddingRight = "";
      }
    };
  }, [active]);
}
