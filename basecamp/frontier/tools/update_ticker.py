"""
FRONTIER · stock ticker prices
---------------------------------------------------------
Run every 30 minutes on US market days by
.github/workflows/frontier-ticker.yml (or by hand with
FINNHUB_KEY=... python3 basecamp/frontier/tools/update_ticker.py).

Reads the symbols in data.js (FRONTIER.stocks), asks Finnhub's
quote API for each one's latest price and % change on the day,
and writes ticker-data.js. The API key lives only in the
FINNHUB_KEY secret on GitHub, never in the site's code.
Writes the file only if something changed. Standard library only.
"""
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent          # basecamp/frontier/
OUT = HERE / "ticker-data.js"
KEY = os.environ.get("FINNHUB_KEY", "").strip()
if not KEY:
    sys.exit("FINNHUB_KEY is not set: add it as a repository secret on GitHub.")

symbols = re.findall(r'symbol:\s*"([A-Z.]+)"', (HERE / "data.js").read_text())
quotes = {}
for sym in symbols:
    url = "https://finnhub.io/api/v1/quote?" + urllib.parse.urlencode({"symbol": sym, "token": KEY})
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "FieldNotes-Frontier/1.0"}), timeout=20) as r:
            q = json.loads(r.read())
        if q.get("c"):
            quotes[sym] = {"price": round(q["c"], 2), "change": round(q.get("dp") or 0, 2),
                           "at": datetime.fromtimestamp(q["t"], timezone.utc).strftime("%Y-%m-%dT%H:%MZ")}
    except Exception as e:                       # one bad symbol never stops the rest
        print(f"! {sym}: {e}", file=sys.stderr)
    time.sleep(1.1)                              # stay well inside the free limit

old = OUT.read_text() if OUT.exists() else ""
m = re.search(r"=\s*(\{.*\});", old, re.S)
if m and json.loads(m.group(1)).get("quotes") == quotes:
    print("No changes.")
    sys.exit(0)
data = {"updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ"), "source": "Finnhub", "quotes": quotes}
OUT.write_text("/* Written by tools/update_ticker.py. Don't edit by hand. */\nwindow.FRONTIER_TICKER = "
               + json.dumps(data, indent=1) + ";\n")
print(f"Wrote {len(quotes)} quotes.")
