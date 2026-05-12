export interface ShareInput {
  url: string;
}

export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'failed';

// Share the URL only — no title/text bundled. Keeps clipboard-copied output
// and share-sheet text clean (just the URL, no leaked titles/subtitles).
//
// URLs with non-ASCII characters (e.g. /news/c/1148/청와대) get percent-encoded
// when passed through the Web Share `url` field — ugly `%EC%B2%AD…` on the
// receiving side. Pass such URLs through `text` so share targets display the
// readable form; plain-ASCII URLs go through `url` since that's what most
// targets use to detect/unfurl the link.
export async function shareLink(input: ShareInput): Promise<ShareResult> {
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    const hasNonAscii = Array.from(input.url).some((char) => {
      const codePoint = char.codePointAt(0);
      return codePoint != null && codePoint > 0x7f;
    });
    const payload = hasNonAscii ? { text: input.url } : { url: input.url };
    try {
      await navigator.share(payload);
      return 'shared';
    } catch (err) {
      if ((err as DOMException)?.name === 'AbortError') return 'cancelled';
    }
  }
  try {
    await navigator.clipboard.writeText(input.url);
    return 'copied';
  } catch {
    return 'failed';
  }
}
