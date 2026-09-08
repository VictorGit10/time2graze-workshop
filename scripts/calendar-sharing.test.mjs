import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const source = ts.transpileModule(
  readFileSync(new URL('../lib/calendar-sharing.ts', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
).outputText;

function fixture() {
  const timers = new Map();
  const scripts = [];
  const window = {
    setTimeout(fn, ms) { const id = timers.size + 1; timers.set(id, { fn, ms }); return id; },
    clearTimeout(id) { timers.delete(id); },
  };
  const exports = {};
  runInNewContext(source, {
    exports, window,
    document: {
      createElement: () => ({ remove() { this.removed = true; } }),
      head: { appendChild: (script) => scripts.push(script) },
    },
  });
  const reply = (status, index = 0) => {
    const callback = new URL(scripts[index].src).searchParams.get('callback');
    window[callback]({ status });
    return callback;
  };
  return { request: exports.requestCalendarAccess, scripts, timers, window, reply };
}

test('successful invitation encodes the address and cleans up the request', async () => {
  const f = fixture();
  const result = f.request('participant+workshop@example.org');
  assert.equal(new URL(f.scripts[0].src).searchParams.get('email'), 'participant+workshop@example.org');
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
