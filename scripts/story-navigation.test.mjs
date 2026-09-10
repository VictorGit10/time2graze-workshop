import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openStory, closeStory, lockStoryScroll } from '../lib/story-navigation.ts';

function browser(initial = 'https://workshop.test/practical/#transport') {
  const entries = [{ url: new URL(initial), state: { existing: true } }];
  let index = 0;
  let signals = 0;
  globalThis.HashChangeEvent = class { constructor(type) { this.type = type; } };
  globalThis.window = {
    get location() { return entries[index].url; },
    dispatchEvent() { signals++; },
    history: {
      get state() { return entries[index].state; },
      pushState(state, _, href) {
        entries.splice(index + 1);
        entries.push({ state, url: new URL(href, entries[index].url) });
        index++;
      },
      replaceState(state, _, href) { entries[index] = { state, url: new URL(href, entries[index].url) }; },
      back() { index = Math.max(0, index - 1); },
    },
  };
  return { entries, signals: () => signals };
}

test('related reading shares one history entry and Back restores the original anchor', () => {
  const fixture = browser();
  openStory('#about-fica');
  assert.equal(window.history.state.existing, true);
  openStory('#about-cidade-de-goias');
  assert.equal(fixture.entries.length, 2);
  closeStory();
  assert.equal(window.location.hash, '#transport');
});

test('a direct story link closes locally without navigating away from the site', () => {
  const fixture = browser('https://workshop.test/practical/?lang=en#about-fica');
  closeStory();
  assert.equal(window.location.href, 'https://workshop.test/practical/?lang=en');
  assert.equal(fixture.entries.length, 1);
  assert.equal(fixture.signals(), 1);
});

test('reopening the current story does not create another history entry', () => {
  const fixture = browser();
  openStory('#about-fica');
  openStory('#about-fica');
  assert.equal(fixture.entries.length, 2);
  assert.equal(fixture.signals(), 2);
});

test('nested galleries keep scrolling locked regardless of cleanup order', () => {
  globalThis.document = { body: { style: { overflow: 'auto' } } };
  const story = lockStoryScroll();
  const photo = lockStoryScroll();
  story();
  assert.equal(document.body.style.overflow, 'hidden');
  story(); // Cleanup is idempotent.
  photo();
  assert.equal(document.body.style.overflow, 'auto');
});
