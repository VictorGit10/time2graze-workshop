import assert from 'node:assert/strict';
import test from 'node:test';
import { fixture as load } from './apps-script-fixture.mjs';

const fixture = () => {
  const f = load('recap-feedback');
  return { ...f, flag: f.exports.flagRecapItem, NOTE_MAX: f.exports.NOTE_MAX };
};

test('a flag carries the item it belongs to, so a correction can be located', async () => {
  const f = fixture();
  const result = f.flag('d3-r7', '  Uganda presented four sites, not three.  ', 'Ana Paula');
  assert.equal(f.params().get('action'), 'flag');
  assert.equal(f.params().get('item'), 'd3-r7');
  assert.equal(f.params().get('note'), 'Uganda presented four sites, not three.');
  assert.equal(f.params().get('name'), 'Ana Paula');
  f.reply('received');
  assert.equal(await result, 'received');
  assert.equal(f.scripts[0].removed, true);
  assert.equal(f.timers.size, 0);
});

test('the name is optional and an empty one is not sent at all', async () => {
  const f = fixture();
  const result = f.flag('d2-r1', 'Missing the methane decision.', '   ');
  assert.equal(f.params().has('name'), false);
  f.reply('received');
  assert.equal(await result, 'received');
});

test('the note is capped before it travels, since the request is a URL', async () => {
  const f = fixture();
  const result = f.flag('d2-r1', 'x'.repeat(f.NOTE_MAX + 250), '');
  assert.equal(f.params().get('note').length, f.NOTE_MAX);
  f.reply('received');
  assert.equal(await result, 'received');
});

test('refusals stay distinct: a closed window is not a failure to report', async () => {
  for (const status of ['invalid', 'limit', 'closed']) {
    const f = fixture();
    const result = f.flag('d3-r7', 'Wrong figure.', '');
    f.reply(status);
    assert.equal(await result, status);
  }
});

test('a lost or unrecognised response never reports the flag as received', async () => {
  for (const response of ['unexpected', null]) {
    const f = fixture();
    const result = f.flag('d3-r7', 'Wrong figure.', '');
    if (response) f.reply(response);
    else f.scripts[0].onerror();
    assert.equal(await result, 'error');
    assert.equal(f.scripts[0].removed, true);
    assert.equal(f.timers.size, 0);
  }
});

test('a slow response reports timeout, so the reader is not told to retype it', async () => {
  const f = fixture();
  const result = f.flag('d3-r7', 'Wrong figure.', '');
  [...f.timers.values()][0].fn();
  assert.equal(await result, 'timeout');
  assert.equal(f.scripts[0].removed, true);
});
