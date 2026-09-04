/**
 * Google Calendar access requests for the live workshop calendar.
 *
 * The endpoint is an Apps Script web app deployed with "execute as owner";
 * it shares the workshop calendar with the address as a reader and Google
 * sends the invitation. Apps Script responses carry no CORS headers, so the
 * request is JSONP — a script tag, which needs no permission and whose
 * response we can read, unlike an opaque `no-cors` POST.
 */

// Web-app URL of the Apps Script project (apps-script/). Empty until the
// deployment exists; the form is not rendered while it is.
const SHARE_ENDPOINT = '';

export const calendarShareEnabled = SHARE_ENDPOINT !== '';

export type ShareStatus =
  | 'shared'
  | 'already'
  | 'invalid'
  | 'limit'
  | 'error';

type ShareResponse = { status?: string };

export function requestCalendarAccess(email: string): Promise<ShareStatus> {
  return new Promise((resolve) => {
    const callbackName = `t2gCalendarShare${Math.random().toString(36).slice(2)}`;
    const script = document.createElement('script');
    const timer = window.setTimeout(() => {
      cleanup();
      resolve('error');
    }, 10000);

    const finish = (status: ShareStatus) => {
      window.clearTimeout(timer);
      cleanup();
      resolve(status);
    };

    function cleanup() {
      delete (window as unknown as Record<string, unknown>)[callbackName];
      script.remove();
    }

    (window as unknown as Record<string, unknown>)[callbackName] = (response: ShareResponse) => {
      finish(
        response && ['shared', 'already', 'invalid', 'limit'].includes(response.status ?? '')
          ? (response.status as ShareStatus)
          : 'error',
      );
    };
    script.onerror = () => finish('error');
    script.src = `${SHARE_ENDPOINT}?action=share&email=${encodeURIComponent(email)}&callback=${callbackName}`;
    document.head.appendChild(script);
  });
}