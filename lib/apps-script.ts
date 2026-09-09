/**
 * The one Apps Script web app the site talks to, and the transport it needs.
 *
 * Apps Script responses carry no CORS headers: a POST from the site is
 * unreadable and a plain GET fails. The request is therefore JSONP — a script
 * tag, which needs no permission and whose response we can actually read,
 * unlike an opaque `no-cors` POST.
 *
 * The URL lives here rather than in each caller because redeploying the script
 * mints a new `/exec` and both features — calendar sharing and recap
 * flagging — are served by that same deployment. Two copies of it is one copy
 * that gets forgotten.
 */

// Deployed 5 September 2026 with "execute as owner" and anonymous access.
// Redeploy only when the endpoint logic changes, and put the new /exec here.
export const APPS_SCRIPT_ENDPOINT: string =
  'https://script.google.com/macros/s/AKfycbzpmYFJq7WFRxtnGHGZkW0FFhiit9441UHtfZnwfrNZI6Vuku1MY6Rb7JBBIcFwGcBi/exec';

export const appsScriptEnabled = APPS_SCRIPT_ENDPOINT !== '';

export type JsonpResult =
  | { ok: true; status: string }
  | { ok: false; reason: 'timeout' | 'error' };

/** A GET is the whole protocol, so everything travels in the query string. */
export function jsonp(
  params: Record<string, string>,
  prefix: string,
): Promise<JsonpResult> {
  return new Promise((resolve) => {
    const callbackName = `${prefix}${Math.random().toString(36).slice(2)}`;
    const script = document.createElement('script');
    const timer = window.setTimeout(() => {
      cleanup();
      resolve({ ok: false, reason: 'timeout' });
    }, 20000);

    function cleanup() {
      window.clearTimeout(timer);
      delete (window as unknown as Record<string, unknown>)[callbackName];
      script.remove();
    }

    (window as unknown as Record<string, unknown>)[callbackName] = (
      response: { status?: string } | undefined,
    ) => {
      cleanup();
      resolve(
        response && typeof response.status === 'string'
          ? { ok: true, status: response.status }
          : { ok: false, reason: 'error' },
      );
    };
    script.onerror = () => {
      cleanup();
      resolve({ ok: false, reason: 'error' });
    };

    const query = new URLSearchParams({ ...params, callback: callbackName });
    script.src = `${APPS_SCRIPT_ENDPOINT}?${query}`;
    document.head.appendChild(script);
  });
}
