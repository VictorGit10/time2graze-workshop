import assert from 'node:assert/strict';
import test from 'node:test';
import { fixture as load } from './apps-script-fixture.mjs';

const fixture = () => {
  const f = load('calendar-sharing');
  return { ...f, request: f.exports.requestCalendarAccess };
};

test('successful invitation encodes the address and cleans up the request', async () => {
  const f = fixture();
  const result = f.request('participant+workshop@example.org');
  assert.equal(f.params().get('action'), 'share');
  assert.equal(f.params().get('email'), 'participant+workshop@example.org');
  const callback = f.reply('shared');
  assert.equal(await result, 'shared');
  assert.equal(f.scripts[0].removed, true);
  assert.equal(f.window[callback], undefined);
  assert.equal(f.timers.size, 0);
});

test('existing access, invalid address and daily limit remain distinct outcomes', async () => {
  for (const status of ['already', 'invalid', 'limit']) {
    const f = fixture();
    const result = f.request('participant@example.org');
    f.reply(status);
    assert.equal(await result, status);
  }
});

test('unrecognised responses and script failures do not report success', async () => {
  for (const response of ['unexpected', null]) {
    const f = fixture();
    const result = f.request('participant@example.org');
    if (response) f.reply(response);
    else f.scripts[0].onerror();
    assert.equal(await result, 'error');
    assert.equal(f.scripts[0].removed, true);
    assert.equal(f.timers.size, 0);
  }
});

test('a slow response reports timeout rather than claiming the invitation failed', async () => {
  const f = fixture();
  const result = f.request('participant@example.org');
  const timer = [...f.timers.values()][0];
  assert.equal(timer.ms, 20000);
  timer.fn();
  assert.equal(await result, 'timeout');
  assert.equal(f.scripts[0].removed, true);
});

test('independent requests cannot consume each other’s response', async () => {
  const f = fixture();
  const first = f.request('first@example.org');
  const second = f.request('second@example.org');
  f.reply('already', 1);
  f.reply('shared', 0);
  assert.equal(await first, 'shared');
  assert.equal(await second, 'already');
});
