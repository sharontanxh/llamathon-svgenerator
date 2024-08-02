// @ts-nocheck

import { useRef, useLayoutEffect } from "react";

export function Artifact({
  className,
  loading,
  markup,
  darkMode,
  refreshKey,
}: {
  className: string;
  loading: boolean;
  markup: string;
  darkMode: boolean;
  refreshKey: number;
}) {
  const elRef = useRef<HTMLDivElement>();

  useLayoutEffect(() => {
    if (!loading) {
      // We only want to do this when the component is done loading
      console.log("re-rendering to trigger any JS");

      const range = document.createRange();
      range.selectNode(elRef.current);
      const documentFragment = range.createContextualFragment(markup);

      // Inject the markup, triggering a re-run!
      elRef.current.innerHTML = "";
      elRef.current.append(documentFragment);
    }
  }, [loading, markup, refreshKey]);

  return (
    <div
      ref={elRef}
      className={`${className} ${darkMode ? "bg-gray-800" : "bg-white"} [&>svg]:h-full [&>svg]:w-full`}
      dangerouslySetInnerHTML={{ __html: markup }}
    ></div>
  );
}
