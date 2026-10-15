# Ideas

Things to build next, roughly in order. Nothing here is promised.

## The Greenhouse: care reminders in my phone's calendar (next step)

A calendar feed (`.ics`) of the Greenhouse's care reminders that I can subscribe to on my phone, so "Check soil: Dragon Scale" shows up in my calendar like any other event.

How it would work:
- A small script (run by Claude, no build step on the site) reads `library/greenhouse/data.js` and writes `library/greenhouse/care.ics`.
- Each job becomes a repeating all-day event: check soil every N days, feed every N days from April to October, mist, turn. The wording stays "Check soil", never "Water".
- Two sets of rules per plant: the growing-season interval (April to October) and the winter one (November to March), using the calendar's own repeat rules, so the feed never needs updating.
- I subscribe once, in my phone's calendar settings ("Add subscribed calendar" on iPhone, "From URL" in Google Calendar), with `webcal://emilioschris.github.io/library/greenhouse/care.ics`.
- Re-run the script whenever data.js changes (a new plant, a new interval) and push.

The catch: the calendar can't see the "Done" taps on the website (those live in the browser), so it shows a fixed rhythm, not "3 days since you last checked". The website stays the live version; the calendar is the nudge.

Later, maybe: a "Download this week" button on the page that makes a one-off .ics from the live care log.

## The Greenhouse: photos

When photos arrive in `library/greenhouse/photos/`: strip metadata (GPS), cut out the background with macOS Vision, resize for the web (WebP), and stand each plant in its real pot on the bench. Then identify the Braided palm and the Small succulents and fill in their care.

## Bonsai waterfall display

A bonsai on a live-edge wood slab with a small real waterfall spilling off the edge. Could be a physical build I document on the site, and visual inspiration for The Greenhouse. Ties to the Nakashima philosophy: natural free-edge wood, shaped by hand.

Reference image: `inspiration/bonsai-waterfall.jpg`. It's a video thumbnail and someone else's image, so it's a private reference only and never goes on the site (the `inspiration/` folder is kept out of git).

## The Cockpit (shelved for now)

A private layer of the site, only for me, on phone and laptop: a "today" view of what's due, synced Greenhouse and Spanish progress, then goals, a weekly review and a journal. The door is a hidden terminal (backtick key or a small hawk mark in the footer) with commands like `login`, `today`, `log climb`.

Decisions so far:
- A password checked in JavaScript is NOT security on a public static site. The lock has to be real.
- Plan: keep the site on GitHub Pages, put private data in a database with a real login (Supabase or similar), email magic link or passkey, row-level security on every table.
- The code can stay public; private data never goes in the repo; the secret service key never gets committed.
- Two-factor on my email and GitHub before starting.

When I pick it back up: ask Claude Code for a plan only (diagram, tables, security rules, my manual steps, build stages), and review it before building.

## Akadimia: later

- Library sections: Readings from my courses, Lectures and talks, Concepts (short notes on big ideas), more Professors.
- Permanent saving via a "GitHub inbox": a Save button opens a pre-filled GitHub issue; an Action files it into the library (data.js) and closes the issue. Only issues opened by my account count; anything else is ignored.
- Look again for official IMF blog and FAO newsroom feeds (none verified on 15 Oct 2026).
