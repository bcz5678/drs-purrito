/**
 * Client-side error beacon. Replaces the generator's editor-only reporter.
 * Keeps the original export name so no call site needs changing.
 *
 * Fire-and-forget and never throws: an error inside the error reporter
 * must not surface to the visitor.
 */
export function reportLovableError(
  error: unknown,
  context: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;

  const endpoint = import.meta.env["VITE_ERROR_ENDPOINT"];
  if (!endpoint) return;

  const body = JSON.stringify({
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    host: window.location.host,
    path: window.location.pathname,
    ...context,
  });

  try {
    // sendBeacon survives page unload, which is often exactly when a
    // render error fires. fetch+keepalive is the fallback.
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
    } else {
      void fetch(endpoint, { method: "POST", body, keepalive: true });
    }
  } catch {
    /* swallow */
  }
}
