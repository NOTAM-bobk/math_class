export type FrameLoadResult = "reachable" | "blocked";

/**
 * Loads a URL in an invisible frame. A load error or a timeout means the frame
 * never loaded, which is how a page the network blocks reveals itself.
 */
export function testFrameLoad(
  url: string,
  timeoutMs = 9000,
  signal?: AbortSignal,
): Promise<FrameLoadResult> {
  return new Promise((resolve) => {
    if (typeof document === "undefined") {
      resolve("blocked");
      return;
    }

    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.tabIndex = -1;
    iframe.title = `Connectivity check for ${url}`;
    Object.assign(iframe.style, {
      position: "fixed",
      left: "-10000px",
      top: "0",
      width: "1px",
      height: "1px",
      opacity: "0",
      pointerEvents: "none",
      border: "0",
    });

    let settled = false;
    const finish = (result: FrameLoadResult) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
      iframe.remove();
      resolve(result);
    };
    const timer = window.setTimeout(() => finish("blocked"), timeoutMs);
    const abort = () => finish("blocked");
    if (signal?.aborted) {
      finish("blocked");
      return;
    }
    signal?.addEventListener("abort", abort, { once: true });
    iframe.addEventListener("load", () => finish("reachable"), { once: true });
    iframe.addEventListener("error", () => finish("blocked"), { once: true });
    iframe.src = url;
    document.body.appendChild(iframe);
  });
}
