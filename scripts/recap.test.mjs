/**
 * Guards the nightly edit to `data/recaps.ts`.
 *
 * A recap is written under time pressure, from a summary the organiser has
 * just corrected in a room, and its ids are what reader corrections point at
 * hours later. These are the mistakes that would be invisible on the page:
 * a duplicated id silently collecting two people's flags, a renumbered one
 * quietly redirecting them, a block heading linking to a session that does
 * not exist.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { AGENDA } from '../data/agenda.ts';
import { RECAPS, RECAP_FEEDBACK_CLOSES } from '../data/recaps.ts';

const ID = /^d([1-5])-r(\d{1,3})$/;
const STAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

const entries = Object.keys(RECAPS).map((key) => ({
  index: Number(key),
  recap: RECAPS[key],
}));

const anchors = new Set();
for (const day of AGENDA) {
  for (const session of day.sessions) {
    anchors.add(session.id);
    for (const track of session.tracks ?? []) anchors.add(track.id);
  }
}

const itemsOf = (section) => [
  ...(section.summary ? [section.summary] : []),
  ...(section.decisions ?? []),
  ...(section.questions ?? []),
  ...(section.actions ?? []),
];

test('every recap belongs to a day of this workshop', () => {
  for (const { index } of entries) {
    assert.ok(
      AGENDA.some((day) => day.index === index),
      `recap ${index} names no day in the agenda`,
    );
  }
});

test('item ids carry their own day and are unique across the site', () => {
  const seen = new Map();
  for (const { index, recap } of entries) {
    for (const section of recap.sections) {
      for (const item of itemsOf(section)) {
        const match = ID.exec(item.id);
        assert.ok(match, `"${item.id}" is not a d<day>-r<serial> id`);
        assert.equal(
          Number(match[1]),
          index,
          `"${item.id}" sits in day ${index} and claims day ${match[1]}`,
        );
        assert.equal(
          seen.has(item.id),
          false,
          `"${item.id}" is used twice — a flag against it would be ambiguous`,
        );
        seen.set(item.id, item.text);
      }
    }
  }
});

test('a recap block names a real session, or says it belongs to the day', () => {
  for (const { recap } of entries) {
    for (const section of recap.sections) {
      assert.ok(
        section.sessionId || section.title,
        'a section with neither sessionId nor title has no heading',
      );
      if (section.sessionId) {
        assert.ok(
          anchors.has(section.sessionId),
          `"${section.sessionId}" matches no session or track in the agenda`,
        );
      }
    }
  }
});

test('a section carries something to read', () => {
  for (const { recap } of entries) {
    for (const section of recap.sections) {
      assert.ok(
        itemsOf(section).length > 0,
        `"${section.sessionId ?? section.title}" renders a heading and nothing else`,
      );
      for (const item of itemsOf(section)) {
        assert.ok(item.text.trim().length > 0, `"${item.id}" is empty`);
      }
    }
  }
});

test('an action names who carries it', () => {
  for (const { recap } of entries) {
    for (const section of recap.sections) {
      for (const action of section.actions ?? []) {
        assert.ok(
          action.owner && action.owner.trim().length > 0,
          `action "${action.id}" has no owner — that is the part a recording cannot supply`,
        );
      }
    }
  }
});

test('the stamps are workshop-local, ordered, and never ahead of the day', () => {
  for (const { index, recap } of entries) {
    const day = AGENDA.find((d) => d.index === index);
    assert.match(recap.published, STAMP, `day ${index}: published is not YYYY-MM-DDTHH:MM`);
    assert.ok(
      recap.published.slice(0, 10) >= day.date,
      `day ${index} was published before it was held`,
    );
    if (recap.revised) {
      assert.match(recap.revised, STAMP, `day ${index}: revised is not YYYY-MM-DDTHH:MM`);
      assert.ok(
        recap.revised >= recap.published,
        `day ${index} was revised before it was published`,
      );
    }
    assert.ok(
      !recap.corrections || recap.revised,
      `day ${index} counts corrections without recording a revision`,
    );
  }
});

test('flagging closes after the workshop, not during it', () => {
  const lastDay = AGENDA[AGENDA.length - 1].date;
  assert.ok(
    RECAP_FEEDBACK_CLOSES > lastDay,
    'the correction window shuts before the last day is summarised',
  );
});
