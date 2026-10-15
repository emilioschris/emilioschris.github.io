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
