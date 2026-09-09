'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { MessageCircle, X } from 'lucide-react';
import {
  assistantEnabled, loadCorpus, splitSources, streamAnswer,
  type ChatMessage, type Corpus, type CorpusEntry,
} from '@/lib/assistant';
import { search } from '@/lib/assistant-search';

/**
 * A question box over the site's own content.
 *
 * It is not a fifth destination: it is a panel over whichever page the reader
 * is already on, and it closes when they follow it somewhere. The rule it has
 * to keep is the site's first one — never invent a fact. So every answer here
 * is bounded by `public/assistant-corpus.json`, and every link under an answer
 * is a corpus entry resolved by id, not a URL a model composed.
 *
 * There are two answering paths and the reader is told which one spoke. With a
 * worker deployed, the model writes prose and cites entries. Without one, or
 * when it refuses, the search returns the published lines themselves. The
 * second path is the honest floor: it cannot be eloquent and it cannot be
 * wrong.
 */

type Turn = {
  role: 'user' | 'assistant';
  text: string;
  sources?: CorpusEntry[];
  /** Said on the turn, so a reader knows a fallback answered rather than the model. */
  note?: string;
};

export function Assistant() {
  const [open, setOpen] = useState(false);
  const [corpus, setCorpus] = useState<Corpus | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  /* The corpus is 30 kB and only the panel needs it, so it is not part of the
     page's own payload — it is fetched the first time the panel opens. */
  useEffect(() => {
    if (!open || corpus) return;
    let live = true;
    loadCorpus().then(
      (loaded) => { if (live) setCorpus(loaded); },
      () => { if (live) setCorpus({ generated: '', workshop: '', timezone: '', entries: [] }); },
    );
    return () => { live = false; };
  }, [open, corpus]);

  /* A real `dialog` rather than a div claiming the role: it traps focus, it
     closes on Escape and it sits in the top layer, none of which is worth
     reimplementing. `onClose` catches the Escape the browser handles itself. */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
      triggerRef.current?.focus();
    }
  }, [open]);

  /* A streamed answer grows downward; without this the reader watches the top
     of a paragraph while the rest of it arrives off screen. */
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [turns]);

  useEffect(() => () => abortRef.current?.abort(), []);

  /** The published lines themselves, as an answer of last resort. */
  const searchTurn = useCallback((asked: string, loaded: Corpus, note: string): Turn => {
    const found = search(loaded, asked);
    return found.length
      ? { role: 'assistant', text: found.map((m) => m.entry.text).join('\n\n'), sources: found.map((m) => m.entry), note }
      : {
          role: 'assistant',
          text: 'The site does not publish anything on that. Try naming a day, a venue or a session — and note that some travel and venue details are still marked pending on the pages themselves.',
          note,
        };
  }, []);

  const ask = useCallback(
    async (asked: string) => {
      const loaded = corpus ?? (await loadCorpus().catch(() => null));
      if (!loaded || !loaded.entries.length) {
        setTurns((prior) => [...prior, {
          role: 'assistant',
          text: 'The workshop content could not be loaded. Reload the page and try again.',
        }]);
        return;
      }
      if (!corpus) setCorpus(loaded);

      if (!assistantEnabled) {
        setTurns((prior) => [...prior, searchTurn(asked, loaded, 'From the site’s own pages.')]);
        return;
      }

      const history: ChatMessage[] = [
        ...turns.filter((t) => t.role === 'user' || !t.note).map((t) => ({ role: t.role, content: t.text })),
        { role: 'user', content: asked },
      ];

      const controller = new AbortController();
      abortRef.current = controller;

      // The turn is appended empty and then grown, so the reader sees the
      // answer form rather than a spinner that might be a failure.
      setTurns((prior) => [...prior, { role: 'assistant', text: '' }]);
      let streamed = '';
      const result = await streamAnswer(history, (fragment) => {
        streamed += fragment;
        // Sources are resolved once the answer is complete; until then the
        // trailing marker line is withheld rather than typed out.
        const shown = streamed.replace(/\n?SOURCES:[\s\S]*$/i, '');
        setTurns((prior) => prior.map((turn, i) => (i === prior.length - 1 ? { ...turn, text: shown } : turn)));
      }, controller.signal);

      abortRef.current = null;

      if (!result.ok) {
        setTurns((prior) => [
          ...prior.slice(0, -1),
          searchTurn(asked, loaded, `The assistant is unavailable (${result.reason}). From the site’s own pages instead.`),
        ]);
        return;
      }

      const { text, sources } = splitSources(streamed, loaded);
      setTurns((prior) => prior.map((turn, i) => (i === prior.length - 1 ? { role: 'assistant', text, sources } : turn)));
    },
    [corpus, searchTurn, turns],
  );

  const submit = useCallback(
    (event: SyntheticEvent<HTMLFormElement>) => {
      event.preventDefault();
      const asked = question.trim();
      if (!asked || busy) return;
      setQuestion('');
      setTurns((prior) => [...prior, { role: 'user', text: asked }]);
      setBusy(true);
      void ask(asked).finally(() => setBusy(false));
    },
    [ask, busy, question],
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="ask-trigger"
        aria-expanded={open}
        onClick={() => setOpen((was) => !was)}
      >
        <MessageCircle aria-hidden size={16} />
        Ask
      </button>

      <dialog className="ask-panel" ref={dialogRef} aria-labelledby="ask-title" onClose={() => setOpen(false)}>
        {open && (
          <>
          <div className="ask-head">
            <h2 id="ask-title">Ask</h2>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close">
              <X aria-hidden size={18} />
            </button>
          </div>

          <div className="ask-log" ref={logRef} aria-live="polite">
            {turns.length === 0 && (
              <p className="ask-empty">
                Questions about the programme, the hotel, the shuttle or the city.
                Answered from this site only.
              </p>
            )}

            {turns.map((turn, index) => (
              <div key={index} className={`ask-turn ask-${turn.role}`}>
                {turn.text.split('\n\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)}

                {turn.note && <p className="ask-note">{turn.note}</p>}

                {turn.sources && turn.sources.length > 0 && (
                  <nav className="ask-sources" aria-label="Where this is on the site">
                    {turn.sources.map((entry) => (
                      <Link key={entry.id} href={entry.href} onClick={() => setOpen(false)}>
                        {entry.title}
                      </Link>
                    ))}
                  </nav>
                )}
              </div>
            ))}

            {busy && <p className="ask-busy">Reading the site…</p>}
          </div>

          <form className="ask-form" onSubmit={submit}>
            <label className="visually-hidden" htmlFor="ask-input">Your question</label>
            <input
              ref={inputRef}
              id="ask-input"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              maxLength={600}
              autoComplete="off"
              placeholder="Where is the hotel?"
            />
            <button type="submit" disabled={busy || !question.trim()}>Ask</button>
          </form>

          <p className="ask-disclosure">
            {assistantEnabled
              ? 'Answers are generated from this site’s published pages, and your question is sent to the model provider to produce them. Details marked pending are not yet confirmed.'
              : 'Answers are the site’s own published lines. Details marked pending are not yet confirmed.'}
          </p>
          </>
        )}
      </dialog>
    </>
  );
}
