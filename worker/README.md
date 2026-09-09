# The assistant's inference proxy

The site is a static export on GitHub Pages. There is no server on the origin,
so there is nowhere on it to keep an API key — anything shipped to the browser
is public, and a key in the bundle is a key a scraper drains overnight. This
worker is the only place the key exists.

It is also deliberately thin. It holds no copy of the workshop: it fetches
`assistant-corpus.json` from the published site and caches it for five
minutes, so **changing the agenda and pushing the site is the whole update
procedure** — this worker is not redeployed for a programme change. Redeploy it
only when the endpoint logic, the model or the limits change.

## Deploying it the first time

You need a Cloudflare account (the free plan is enough) and an Ollama Cloud
API key.

```
cd worker
npx wrangler login
npx wrangler kv namespace create ASSISTANT_KV   # prints an id
```

Paste that id into the `[[kv_namespaces]]` block in `wrangler.toml` and
uncomment it. Without KV the worker still runs, but `DAILY_LIMIT` cannot be
enforced and the burst limiter is the only guard.

Then confirm the model tag is one your key can actually reach — the catalogue
moves, and `glm-4.6` and `glm-4.7` have already been retired:

```
curl -H "Authorization: Bearer $OLLAMA_API_KEY" https://ollama.com/api/tags
```

Put the key in, and deploy:

```
npx wrangler secret put OLLAMA_API_KEY
npx wrangler deploy
```

`wrangler deploy` prints the worker's URL. That URL goes into
`ASSISTANT_ENDPOINT` in `lib/assistant.ts`, which is the site's one copy of it
— the same rule the Apps Script endpoint follows in `lib/apps-script.ts`.

## What guards the key

Four things, in the order a request meets them:

1. **Origin allowlist** (`ALLOWED_ORIGINS`). Stops a browser on another site.
   It does not stop a script, which can send any `Origin` header it likes.
2. **Burst limit**, 8 questions per IP per minute, via the rate limiting
   binding. No external resource, no setup.
3. **Daily cap** (`DAILY_LIMIT`), counted in KV across everyone. This is the
   one that bounds the bill. It is soft: two answers racing can share a count.
4. **Per-answer caps**, in `LIMITS` in `src/index.js` — history length,
   question length and `num_predict`. A single request cannot ask for a large
   completion.

The upstream error body can carry account details, so it goes to
`wrangler tail`, never to the page.

## Turning it off

Set `ASSISTANT_ENDPOINT` to `''` in `lib/assistant.ts` and push the site: the
panel stops rendering, and the deterministic search keeps answering. That is
the kill switch, and it needs no Cloudflare access. To stop the worker itself,
`npx wrangler delete`.
