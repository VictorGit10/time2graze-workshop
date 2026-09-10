/** Related stories replace the overlay entry, keeping Back a return to the page. */
export function openStory(hash: string) {
  if (window.location.hash === hash) {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    return;
  }
  if (window.location.hash.startsWith('#about-')) {
    window.history.replaceState(window.history.state, '', hash);
  } else {
    window.history.pushState({ ...window.history.state, workshopStory: true }, '', hash);
  }
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}

export function closeStory() {
  if (window.history.state?.workshopStory) {
    window.history.back();
  } else {
    window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }
}

// Shared by the story and nested photograph dialogs, independent of cleanup order.
let locks = 0;
let overflow = '';
export function lockStoryScroll() {
  if (locks++ === 0) {
    overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--locks === 0) document.body.style.overflow = overflow;
  };
}
