/**
 * Runs a `lib/` module that talks to the Apps Script endpoint against a fake
 * document, so the JSONP transport can be tested without a browser.
 *
 * The modules are a small graph now that the transport is shared, so this
 * loads their dependencies too rather than one file in isolation: a fixture
 * that stubbed `lib/apps-script.ts` would stop testing the part that builds
 * the request.
 */
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import ts from 'typescript';

function transpile(name) {
  return ts.transpileModule(
    readFileSync(new URL(`../lib/${name}.ts`, import.meta.url), 'utf8'),
    { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
  ).outputText;
}

export function fixture(entry) {
  const timers = new Map();
  const scripts = [];
  const window = {
    setTimeout(fn, ms) { const id = timers.size + 1; timers.set(id, { fn, ms }); return id; },
    clearTimeout(id) { timers.delete(id); },
  };
  const context = createContext({
    window,
    URL,
    URLSearchParams,
    document: {
      createElement: () => ({ remove() { this.removed = true; } }),
      head: { appendChild: (script) => scripts.push(script) },
    },
  });

  const loaded = new Map();
  function load(specifier) {
    const name = specifier.replace(/^\.\//, '');
    const cached = loaded.get(name);
    if (cached) return cached;

    const exports = {};
    loaded.set(name, exports);
    const factory = runInContext(
      `(function (exports, require, module) {\n${transpile(name)}\n})`,
      context,
    );
    factory(exports, load, { exports });
    return exports;
  }

  const reply = (status, index = 0) => {
    const callback = new URL(scripts[index].src).searchParams.get('callback');
    window[callback](status === null ? undefined : { status });
    return callback;
  };
  const params = (index = 0) => new URL(scripts[index].src).searchParams;

  return { exports: load(entry), scripts, timers, window, reply, params };
}
