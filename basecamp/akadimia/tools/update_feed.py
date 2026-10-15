"""
AKADIMIA · daily feed
---------------------------------------------------------
Run once a day by .github/workflows/akadimia-feed.yml (or by hand:
python3 basecamp/akadimia/tools/update_feed.py).

1. Reads feed-config.json (sources, people, topic keywords).
2. Fetches each RSS/Atom feed, and the newest works from OpenAlex
   (a free, open database of research), politely: one request per
   source, a pause between them, a clear user agent.
3. Keeps only items that match a topic (faculty works are kept
   regardless), stores headline, source, school, date, link and a
   short summary, never the full article.
4. Merges with what was already there, removes duplicates, keeps
   the last year (up to 400 items), newest first.
5. Writes feed-data.js only if something actually changed, so the
   workflow commits only when there's news.
Only Python's standard library is used: nothing to install.
"""
import hashlib
import html
import json
import re
import sys
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent          # basecamp/akadimia/
CONFIG = json.loads((HERE / "feed-config.json").read_text())
OUT = HERE / "feed-data.js"
UA = "FieldNotes-Akadimia/1.0 (daily headlines for a personal study page; +https://emilioschris.github.io/basecamp/akadimia/)"
NOW = datetime.now(timezone.utc)
KEEP_DAYS, KEEP_MAX, SUMMARY_LEN = 365, 400, 220
WORK_TYPES = "article|book|book-chapter|report|preprint"


def get(url, accept="*/*"):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": accept})
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
    """Any feed date -> YYYY-MM-DD (or None)."""
    if not value:
        return None
    value = value.strip()
    try:
        return parsedate_to_datetime(value).astimezone(timezone.utc).date().isoformat()
    except (TypeError, ValueError):
        pass
    m = re.match(r"(\d{4}-\d{2}-\d{2})", value)
    return m.group(1) if m else None


# ---- topics ----
def compile_topics():
    out = []
    for t in CONFIG["topics"]:
        parts = []
        for k in t["keywords"]:
            k = re.escape(k.lower()).replace(r"\*", r"\w*")
            parts.append(r"\b" + k + r"\b")
        out.append((t["id"], re.compile("|".join(parts))))
    return out


TOPICS = compile_topics()


def topics_for(*texts):
    blob = " ".join(t or "" for t in texts).lower()
    return [tid for tid, rx in TOPICS if rx.search(blob)]


def item(title, link, source, school, date, summary, kind, topics):
    return {
        "id": hashlib.sha1(link.encode()).hexdigest()[:12],
        "title": clean(title, 220), "link": link, "source": source, "school": school,
        "date": date, "summary": summary, "kind": kind, "topics": topics,
    }


# ---- RSS / Atom ----
ATOM = "{http://www.w3.org/2005/Atom}"


def read_feed(feed):
    root = ET.fromstring(get(feed["url"], "application/rss+xml, application/atom+xml, application/xml;q=0.9, */*;q=0.5"))
    entries = root.findall(".//item") or root.findall(f".//{ATOM}entry")
    skip = re.compile("|".join(re.escape(w.lower()) for w in feed["skip"])) if feed.get("skip") else None
    out = []
    for e in entries[:30]:
        if e.tag == "item":
            title, link = e.findtext("title"), (e.findtext("link") or "").strip()
            date = iso(e.findtext("pubDate") or e.findtext("{http://purl.org/dc/elements/1.1/}date"))
            desc = e.findtext("description") or ""
        else:
            title = e.findtext(f"{ATOM}title")
            ln = e.find(f"{ATOM}link[@rel='alternate']")
            if ln is None:
                ln = e.find(f"{ATOM}link")
            link = ln.get("href") if ln is not None else ""
            date = iso(e.findtext(f"{ATOM}published") or e.findtext(f"{ATOM}updated"))
            desc = e.findtext(f"{ATOM}summary") or e.findtext(f"{ATOM}content") or ""
        if not (title and link and date):
            continue
        if skip and skip.search(title.lower()):    # routine notices this source posts
            continue
        summary = clean(desc)
        tags = topics_for(title, summary)
        if tags:                                   # only what fits my topics
            out.append(item(title, link, feed["name"], feed["school"], date, summary, feed["kind"], tags))
    return out


# ---- OpenAlex ----
def openalex(params):
    url = "https://api.openalex.org/works?" + urllib.parse.urlencode(params)
    return json.loads(get(url, "application/json"))["results"]


def work_summary(w):
    """Journal and authors only: no abstracts are copied."""
    venue = ((w.get("primary_location") or {}).get("source") or {}).get("display_name")
    names = [a["author"]["display_name"] for a in w.get("authorships", [])[:3]]
    who = ", ".join(names) + (" et al." if len(w.get("authorships", [])) > 3 else "")
    return " · ".join(x for x in (venue, who) if x)


def work_link(w):
    return w.get("doi") or (w.get("primary_location") or {}).get("landing_page_url") or w["id"]


def read_research(r):
    since = (NOW - timedelta(days=r["days"])).date().isoformat()
    works = openalex({
        "filter": f"institutions.id:{r['institution']},primary_topic.field.id:{'|'.join('fields/' + f for f in r['fields'])},"
                  f"from_publication_date:{since},type:article",
        "sort": "publication_date:desc", "per-page": 50,
    })
    need = None
    if r.get("require"):                           # e.g. economics or policy words
        need = re.compile("|".join(r"\b" + re.escape(k.lower()).replace(r"\*", r"\w*") + r"\b" for k in r["require"]))
    out = []
    for w in works:
        title = w.get("title") or ""
        topic_names = " ".join(t["display_name"] for t in (w.get("topics") or []))
        if need and not need.search((title + " " + topic_names).lower()):
            continue
        tags = topics_for(title, topic_names)
        if tags and not title.lower().startswith(("correction", "erratum")):
            out.append(item(title, work_link(w), r["name"], r["school"], w["publication_date"], work_summary(w), "research", tags))
    return out


def read_person(p):
    works = openalex({
        "filter": f"author.orcid:{p['orcid']},type:{WORK_TYPES}",
        "sort": "publication_date:desc", "per-page": 8,
    })
    out = []
    for w in works:
        title = w.get("title") or ""
        if not title or title.lower().startswith(("correction", "erratum", "replication package")):
            continue
        topic_names = " ".join(t["display_name"] for t in (w.get("topics") or []))
        out.append(item(title, work_link(w), p["name"], p["school"], w["publication_date"], work_summary(w), "research", topics_for(title, topic_names)))
    return out[:5]


# ---- the run ----
def previous():
    if not OUT.exists():
        return {}
    m = re.search(r"=\s*(\{.*\});?\s*$", OUT.read_text(), re.S)
    return json.loads(m.group(1)) if m else {}


def main():
    old = previous()
    items, status, people = {}, [], {}
    for it in old.get("items", []):                 # keep what we had
        items[it["id"]] = it

    jobs = [("feed", f) for f in CONFIG["feeds"]] + [("research", r) for r in CONFIG["research"]]
    for kind, src in jobs:
        try:
            got = read_feed(src) if kind == "feed" else read_research(src)
            for it in got:
                items[it["id"]] = it
            status.append({"name": src["name"], "ok": True, "count": len(got)})
        except Exception as e:                       # one bad source never stops the rest
            status.append({"name": src["name"], "ok": False, "error": str(e)[:120]})
            print(f"! {src['name']}: {e}", file=sys.stderr)
        time.sleep(1.5)

    for p in CONFIG["people"]:
        try:
            people[p["id"]] = read_person(p)
        except Exception as e:
            people[p["id"]] = old.get("people", {}).get(p["id"], [])
            status.append({"name": p["name"], "ok": False, "error": str(e)[:120]})
            print(f"! {p['name']}: {e}", file=sys.stderr)
        time.sleep(1.5)

    cutoff = (NOW - timedelta(days=KEEP_DAYS)).date().isoformat()
    # Duplicates: the same headline from two sources counts once
    seen, kept = set(), []
    for it in sorted(items.values(), key=lambda x: x["date"], reverse=True):
        key = re.sub(r"\W+", "", it["title"].lower())
        if it["date"] >= cutoff and key not in seen:
            seen.add(key)
            kept.append(it)
    kept = kept[:KEEP_MAX]

    info = [{k: p[k] for k in ("id", "name", "school", "role", "bio", "openalex")} for p in CONFIG["people"]]
    content = {"items": kept, "people": people, "peopleInfo": info, "sources": status,
               "topics": [{"id": t["id"], "name": t["name"]} for t in CONFIG["topics"]]}
    if all(old.get(k) == v for k, v in content.items()):
        print("No changes.")
        return
    data = {"updated": NOW.strftime("%Y-%m-%dT%H:%MZ"), **content}
    OUT.write_text(
        "/* Written by tools/update_feed.py once a day. Don't edit by hand: it will be overwritten. */\n"
        "window.AKADIMIA_FEED = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n")
    print(f"Wrote {len(kept)} items, {sum(len(v) for v in people.values())} faculty works.")


if __name__ == "__main__":
    main()
