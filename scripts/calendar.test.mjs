import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import { AGENDA } from '../data/agenda.ts';
import { icsCalendar } from '../lib/calendar.ts';

const calendar = icsCalendar(AGENDA, {
  name: 'Time2Graze workshop',
  release: 'beta',
  stamp: new Date('2026-09-05T12:00:00Z'),
});
const unfolded = calendar.replace(/\r\n /g, '');

test('calendar sync explicitly clears locations omitted from the feed', () => {
  const context = {
    Utilities: {
      DigestAlgorithm: { MD5: 'md5' },
      computeDigest: (algorithm, value) => Array.from(createHash(algorithm).update(value).digest()),
    },
  };
  runInNewContext(readFileSync(new URL('../apps-script/sync.gs', import.meta.url), 'utf8'), context);
  const events = context.parseIcs(calendar);
  assert.equal(events.length, AGENDA.flatMap((day) => day.sessions).length);
  for (const event of events) assert.equal(event.location, '');
});

test('all scheduled items keep stable UIDs without independent-travel locations', () => {
  const sessions = AGENDA.flatMap((day) => day.sessions);
  assert.equal((unfolded.match(/BEGIN:VEVENT/g) ?? []).length, sessions.length);
  assert.doesNotMatch(unfolded, /^LOCATION[:;]/m);
  assert.match(unfolded, /Daily transport is organised by the workshop/);
  for (const session of sessions)
    assert.ok(unfolded.includes(`UID:${session.id}@time2graze-workshop`));
});

test('provisional ends never become calendar end times', () => {
  const events = unfolded.split('BEGIN:VEVENT\r\n').slice(1);
  for (const session of AGENDA.flatMap((day) => day.sessions)) {
    const event = events.find((value) =>
      value.includes(`UID:${session.id}@time2graze-workshop\r\n`),
    );
    assert.ok(event);
    if (session.end && session.endStatus !== 'provisional')
      assert.match(event, /DTEND;TZID=America\/Sao_Paulo:/);
    else assert.doesNotMatch(event, /^DTEND[:;]/m);
  }
});
