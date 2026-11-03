"""
PARATIRITIRIO · daily Signals
---------------------------------------------------------
Run once a day by .github/workflows/paratiritirio-signals.yml (or by
hand: python3 basecamp/paratiritirio/tools/update_signals.py).

1. Reads signals-config.json (feeds, sector keywords, district and
   entry tags).
2. Fetches each RSS feed politely: one request per feed, a pause
   between them, a clear user agent. Every feed's robots.txt allows it
   (checked 2 Nov 2026).
3. Keeps only items about Cyprus that match at least one sector, and
   stores headline, source, date, link and a short summary (the feed's
   own description, cut to about 220 characters), never the article.
4. Tags each item to districts and map entries by keyword.
5. Merges with what was already there, removes duplicates, keeps the
   last 120 days (up to 300 items), newest first, and writes
   signals-data.js only if something changed.
Only Python's standard library is used: nothing to install.
"""
import hashlib
import html
import json
import re
import sys
import time
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent          # basecamp/paratiritirio/
CONFIG = json.loads((HERE / "signals-config.json").read_text())
OUT = HERE / "signals-data.js"
UA = "FieldNotes-Paratiritirio/1.0 (daily headlines for a personal page; +https://emilioschris.github.io/basecamp/paratiritirio/)"
NOW = datetime.now(timezone.utc)
KEEP_DAYS, KEEP_MAX, SUMMARY_LEN = 120, 300, 220


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/rss+xml, application/xml;q=0.9, */*;q=0.5"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def clean(text, limit=SUMMARY_LEN):
    """Strip HTML, collapse spaces, cut at a word boundary."""
    text = html.unescape(re.sub(r"<[^>]+>", " ", text or ""))
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"\s*The post .* appeared first on .*$", "", text)   # WordPress footer
    if len(text) > limit:
        text = text[:limit].rsplit(" ", 1)[0].rstrip(",.;:") + "…"
    return text


def iso(value):
    if not value:
        return None
    value = value.strip()
    try:
        return parsedate_to_datetime(value).astimezone(timezone.utc).date().isoformat()
    except (TypeError, ValueError):
        pass
    m = re.match(r"(\d{4}-\d{2}-\d{2})", value)
    return m.group(1) if m else None


def rx(words):
    parts = [r"\b" + re.escape(w.lower()).replace(r"\*", r"\w*") + r"\b" for w in words]
    return re.compile("|".join(parts))


CYPRUS = rx(CONFIG["cyprusWords"])
SECTORS = [(s["id"], rx(s["keywords"])) for s in CONFIG["sectors"]]
DISTRICTS = [(k, rx(v)) for k, v in CONFIG["districts"].items()]
ENTRIES = [(k, rx(v)) for k, v in CONFIG["entries"].items()]


def tags(blob, table):
    return [tid for tid, r in table if r.search(blob)]


def read_feed(feed):
    root = ET.fromstring(get(feed["url"]))
    skip = rx(feed["skip"]) if feed.get("skip") else None
    out = []
    for e in root.findall(".//item")[:40]:
        title, link = e.findtext("title"), (e.findtext("link") or "").strip()
        date = iso(e.findtext("pubDate") or e.findtext("{http://purl.org/dc/elements/1.1/}date"))
        if not (title and link and date):
            continue
        title = clean(title, 220)
        summary = clean(e.findtext("description") or "")
        blob = (title + " " + summary).lower()
        if skip and skip.search(title.lower()):
            continue
        if feed.get("requireCyprus") and not CYPRUS.search(blob):
            continue
        sectors = tags(blob, SECTORS)
        if not sectors:
            continue
        out.append({
            "id": hashlib.sha1(link.encode()).hexdigest()[:12],
            "title": title, "link": link, "source": feed["publisher"], "feed": feed["name"],
            "date": date, "summary": summary, "sectors": sectors,
            "districts": tags(blob, DISTRICTS), "entries": tags(blob, ENTRIES),
        })
    return out


def previous():
    if not OUT.exists():
        return {}
    m = re.search(r"=\s*(\{.*\});?\s*$", OUT.read_text(), re.S)
    return json.loads(m.group(1)) if m else {}


def main():
    old = previous()
    items, status = {}, []
    for it in old.get("items", []):                 # keep what we had
        items[it["id"]] = it
    for feed in CONFIG["feeds"]:
        try:
            got = read_feed(feed)
            for it in got:
                items[it["id"]] = it
            status.append({"name": feed["name"], "ok": True, "count": len(got)})
            print(f"  ok  {feed['name']}: {len(got)} relevant")
        except Exception as e:                       # one bad feed never stops the rest
            status.append({"name": feed["name"], "ok": False, "error": str(e)[:120]})
            print(f"! {feed['name']}: {e}", file=sys.stderr)
        time.sleep(1.5)

    cutoff = (NOW - timedelta(days=KEEP_DAYS)).date().isoformat()
    seen, kept = set(), []
    for it in sorted(items.values(), key=lambda x: x["date"], reverse=True):
        key = re.sub(r"\W+", "", it["title"].lower())
        if it["date"] >= cutoff and key not in seen:
            seen.add(key)
            kept.append(it)
    kept = kept[:KEEP_MAX]

    content = {"items": kept, "sources": status}
    if old.get("items") == kept and old.get("sources") == status:
        print("No changes.")
        return
    data = {"updated": NOW.strftime("%Y-%m-%dT%H:%MZ"), **content}
    OUT.write_text(
        "/* Written by tools/update_signals.py once a day. Don't edit by hand: it will be overwritten. */\n"
        "window.PARATIRITIRIO = window.PARATIRITIRIO || {};\n"
        "PARATIRITIRIO.signals = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n")
    print(f"Wrote {len(kept)} signals.")


if __name__ == "__main__":
    main()
