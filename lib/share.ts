export type ShareResult = "shared" | "copied" | "cancelled" | "failed";

// navigator.share (mobile browsers, some desktop) opens the native share
// sheet; falls back to copying the link so the flow always does *something*
// useful even on browsers without Web Share support.
export async function shareOrCopyLink(data: {
  title: string;
  text?: string;
  url: string;
}): Promise<ShareResult> {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share(data);
      return "shared";
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return "cancelled";
    }
  }

  try {
    await navigator.clipboard.writeText(data.url);
    return "copied";
  } catch {
    return "failed";
  }
}
