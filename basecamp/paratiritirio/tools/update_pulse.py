#!/usr/bin/env python3
"""
PARATIRITIRIO · monthly data refresh
------------------------------------
Fetches the Pulse indicators, the wealth distribution and the company
structure from three free, official APIs and writes them to
basecamp/paratiritirio/pulse-data.js (never hand-edit that file).

    Eurostat   https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/
    ECB        https://data-api.ecb.europa.eu/service/data/   (carries Central Bank of Cyprus series)
    CYSTAT     https://cystatdb.cystat.gov.cy/api/v1/en/8.CYSTAT-DB/

Run by .github/workflows/paratiritirio-pulse.yml on the 8th of every month,
or by hand from the repository root:

    python3 basecamp/paratiritirio/tools/update_pulse.py

Standard-library Python only. If a source fails, that series keeps its
previous values (read back from the existing file), so one broken API never
blanks the page. Figures that have no API (property sales, company
registrations, bad loans, the wealth survey) live in pulse-snapshot.js and
are updated by hand.
"""

import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from datetime import date

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "pulse-data.js")
UA = {"User-Agent": "FieldNotes-Paratiritirio/1.0 (personal, non-commercial; https://emilioschris.github.io)"}

EUROSTAT = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/"
ECB = "https://data-api.ecb.europa.eu/service/data/"
CYSTAT = "https://cystatdb.cystat.gov.cy/api/v1/en/8.CYSTAT-DB/"

SINCE = 2010  # earliest year kept for time series


def http(url, data=None, accept=None):
    headers = dict(UA)
    if accept:
        headers["Accept"] = accept
    if data is not None:
        headers["Content-Type"] = "application/json"
        data = json.dumps(data).encode()
    for attempt in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, data=data, headers=headers), timeout=60) as r:
                return r.read().decode("utf-8")
        except Exception as e:  # network hiccup: wait and retry
            last = e
            time.sleep(3 * (attempt + 1))
    raise last


def keep(period):
    return int(period[:4]) >= SINCE


# ---------- Eurostat (JSON-stat) ----------
def eurostat(dataset, **filters):
    """One series: every dimension except time must be fixed by filters."""
    q = urllib.parse.urlencode(filters, doseq=True)
    d = json.loads(http(EUROSTAT + dataset + "?" + q))
    times = {v: k for k, v in d["dimension"]["time"]["category"]["index"].items()}
    sizes = d["size"]
    if any(s != 1 for s in sizes[:-1]):
        raise ValueError(f"{dataset}: filters leave more than one series {sizes}")
    pts = [(times[int(i)], v) for i, v in d["value"].items()]
    pts = [(p.replace("-Q", "-Q"), round(v, 3)) for p, v in sorted(pts) if keep(p)]
    return pts, d.get("updated", "")


# ---------- ECB (CSV) ----------
def ecb(flow, key):
    import csv
    import io
    text = http(f"{ECB}{flow}/{key}?startPeriod={SINCE}", accept="text/csv")
    rows = list(csv.DictReader(io.StringIO(text)))
    return [(r["TIME_PERIOD"], round(float(r["OBS_VALUE"]), 3)) for r in rows if r["OBS_VALUE"]]


# ---------- CYSTAT (PxWeb, JSON-stat2) ----------
def cystat_meta(table):
    return json.loads(http(CYSTAT + urllib.parse.quote(table)))


def cystat(table, select):
    """select: {variable code: [value codes]}; returns (dims, values)."""
    query = {"query": [{"code": k, "selection": {"filter": "item", "values": v}} for k, v in select.items()],
             "response": {"format": "json-stat2"}}
    d = json.loads(http(CYSTAT + urllib.parse.quote(table), data=query))
    return d


def code_for(meta, var, text_pred):
    v = next(x for x in meta["variables"] if x["code"] == var)
    for c, t in zip(v["values"], v["valueTexts"]):
        if text_pred(t):
            return c
    raise KeyError(f"{var}: no value matched")


def cystat_monthly(table, fixed):
    """A monthly series: every non-MONTH variable fixed by a text predicate."""
    meta = cystat_meta(table)
    month = next(x for x in meta["variables"] if x["code"] == "MONTH")
    sel = {"MONTH": month["values"]}
    for var, pred in fixed.items():
        sel[var] = [code_for(meta, var, pred)]
    d = cystat(table, sel)
    labels = d["dimension"]["MONTH"]["category"]["label"]
    index = d["dimension"]["MONTH"]["category"]["index"]
    order = sorted(index, key=index.get)
    vals = d["value"]
    pts = []
    for i, code in enumerate(order):
        v = vals[i]
        p = labels[code].replace("M", "-")
        if v is not None and keep(p):
            pts.append((p, v))
    return pts


# ---------- what to fetch ----------
def build():
    out = {}

    def series(sid, label, unit, freq, source, fetch, note=""):
        try:
            pts = fetch()
            if not pts:
                raise ValueError("no data")
            out[sid] = {"label": label, "unit": unit, "freq": freq, "source": source, "points": pts, "note": note}
            print(f"  ok  {sid:16} {len(pts):4} points, latest {pts[-1]}")
        except Exception as e:
            print(f"  --  {sid:16} failed: {e}", file=sys.stderr)

    es_src = lambda ds, title: {"publisher": "Eurostat", "kind": "official", "dataset": ds, "title": title,
                                "url": f"https://ec.europa.eu/eurostat/databrowser/view/{ds}/default/table"}
    ecb_src = lambda flow, key, title, publisher="Central Bank of Cyprus, via the ECB Data Portal": {
        "publisher": publisher, "kind": "official", "dataset": f"{flow}.{key}", "title": title,
        "url": f"https://data.ecb.europa.eu/data/datasets/{flow}/{flow}.{key}"}
    cy_src = lambda table, title: {"publisher": "CYSTAT", "kind": "official", "dataset": table, "title": title,
                                   "url": "https://cystatdb.cystat.gov.cy/pxweb/en/8.CYSTAT-DB/"}

    print("Pulse")
    series("gdp", "GDP growth", "% change on a year earlier (real, seasonally adjusted)", "Q",
           es_src("namq_10_gdp", "GDP and main components, quarterly"),
           lambda: eurostat("namq_10_gdp", geo="CY", unit="CLV_PCH_SM", s_adj="SCA", na_item="B1GQ")[0])
    series("inflation", "Inflation (HICP)", "% change on a year earlier", "M",
           es_src("prc_hicp_minr", "HICP, monthly"),
           lambda: eurostat("prc_hicp_minr", geo="CY", unit="RCH_A", coicop18="TOTAL")[0])
    series("rents", "Rents (HICP, actual rentals)", "% change on a year earlier", "M",
           es_src("prc_hicp_minr", "HICP, monthly: actual rentals for housing"),
           lambda: eurostat("prc_hicp_minr", geo="CY", unit="RCH_A", coicop18="CP041")[0])
    series("unemployment", "Unemployment", "% of the labour force (seasonally adjusted)", "M",
           es_src("une_rt_m", "Unemployment by sex and age, monthly"),
           lambda: eurostat("une_rt_m", geo="CY", s_adj="SA", age="TOTAL", sex="T", unit="PC_ACT")[0])
    series("rppi", "Residential property price index", "index, 2010 Q1 = 100", "Q",
           ecb_src("RESR", "Q.CY._T.N._TR.TVAL.CY2.TB.N.IX", "Residential property prices, Cyprus (Central Bank of Cyprus)"),
           lambda: ecb("RESR", "Q.CY._T.N._TR.TVAL.CY2.TB.N.IX"))
    series("permits", "Building permits", "permits issued per month", "M",
           cy_src("1440005E", "Building permits, monthly"),
           lambda: cystat_monthly("Construction/Building Permits/1440005E.px", {
               "TYPE OF PROJECT": lambda t: t.strip().upper() == "TOTAL",
               "MEASUREMENT": lambda t: t == "Number",
               "REFERENCE PERIOD": lambda t: t == "Monthly data",
               "NUMBER/AREA/VALUE/DWELLING UNITS": lambda t: t == "Number of permits"}))
    series("arrivals", "Tourist arrivals", "tourists per month", "M",
           cy_src("2021012E", "Arrivals of tourists, monthly"),
           lambda: cystat_monthly("Tourism/Tourists/Monthly/2021012E.px", {"MEASURE": lambda t: t == "Number"}))
    series("tourismRevenue", "Tourism revenue", "€ million per month", "M",
           cy_src("2031010E", "Revenue estimates and arrivals of tourists, monthly"),
           lambda: cystat_monthly("Tourism/Revenue from Tourism/Monthly/2031010E.px", {"ARRIVALS AND REVENUE": lambda t: t == "Revenue (€ mn)"}))
    series("loansHouseholds", "Bank lending to households", "% change on a year earlier", "M",
           ecb_src("BSI", "M.CY.N.A.A20.A.I.U2.2250.Z01.A", "Loans to households by banks in Cyprus, annual growth"),
           lambda: ecb("BSI", "M.CY.N.A.A20.A.I.U2.2250.Z01.A"))
    series("loansBusinesses", "Bank lending to businesses", "% change on a year earlier", "M",
           ecb_src("BSI", "M.CY.N.A.A20.A.I.U2.2240.Z01.A", "Loans to non-financial corporations by banks in Cyprus, annual growth"),
           lambda: ecb("BSI", "M.CY.N.A.A20.A.I.U2.2240.Z01.A"))
    series("fdiTotal", "Foreign direct investment into Cyprus (stock)", "€ million, end of year", "A",
           es_src("bop_fdi6_pos", "Direct investment positions"),
           lambda: eurostat("bop_fdi6_pos", geo="CY", currency="MIO_EUR", stk_flow="NI", partner="WRL_REST",
                            nace_r2="FDI", entity="TOTAL", counterp="IMM", fdi_item="DI__D__F")[0],
           note="Includes special purpose entities (SPEs): companies with little or no local activity that mostly pass money through Cyprus.")
    series("fdiSpe", "Of which: through special purpose entities", "€ million, end of year", "A",
           es_src("bop_fdi6_pos", "Direct investment positions"),
           lambda: eurostat("bop_fdi6_pos", geo="CY", currency="MIO_EUR", stk_flow="NI", partner="WRL_REST",
                            nace_r2="FDI", entity="SPE", counterp="IMM", fdi_item="DI__D__F")[0])

    print("Arrivals by country (latest month)")
    try:
        t = "Tourism/Tourists/Monthly/2021010E.px"
        meta = cystat_meta(t)
        months = next(x for x in meta["variables"] if x["code"] == "MONTH")
        last = months["values"][-1]
        countries = next(x for x in meta["variables"] if x["code"] == "COUNTRY OF USUAL RESIDENCE")
        d = cystat(t, {"COUNTRY OF USUAL RESIDENCE": countries["values"], "MONTH": [last]})
        cat = d["dimension"]["COUNTRY OF USUAL RESIDENCE"]["category"]
        order = sorted(cat["index"], key=cat["index"].get)
        rows = [(cat["label"][c].split(" (")[0], v) for c, v in zip(order, d["value"]) if v]
        groups = {"TOTAL", "EUROPE", "E.U. COUNTRIES", "OTHER EUROPEAN COUNTRIES", "ASIA", "AFRICA", "AMERICA", "OCEANIA", "NOT STATED"}
        total = next(v for name, v in rows if name == "TOTAL")
        top = sorted([(n, v) for n, v in rows if n.upper() not in groups and "OTHER" not in n.upper()],
                     key=lambda x: -x[1])[:5]
        out["arrivalsByCountry"] = {"month": months["valueTexts"][-1].replace("M", "-"), "total": total, "top": top,
                                    "source": cy_src("2021010E", "Arrivals of tourists by country of usual residence, monthly")}
        print("  ok ", out["arrivalsByCountry"]["month"], top)
    except Exception as e:
        print("  --  arrivalsByCountry failed:", e, file=sys.stderr)

    print("Capital: foreign direct investment by country and sector")
    def fdi_table(**filters):
        """{year: {code: value}} plus code labels, for one Eurostat query."""
        q = urllib.parse.urlencode(filters)
        d = json.loads(http(EUROSTAT + "bop_fdi6_pos?" + q))
        times = {v: k for k, v in d["dimension"]["time"]["category"]["index"].items()}
        var = next(k for k in d["id"] if k not in ("time",) and d["size"][d["id"].index(k)] > 1)
        cat = d["dimension"][var]["category"]
        inv = {v: k for k, v in cat["index"].items()}
        nt, nv = d["size"][-1], d["size"][d["id"].index(var)]
        out = {}
        for i, v in d["value"].items():
            i = int(i)
            out.setdefault(times[i % nt], {})[inv[(i // nt) % nv]] = v
        return out, cat["label"]
    try:
        base = dict(geo="CY", currency="MIO_EUR", stk_flow="NI", nace_r2="FDI", entity="TOTAL", fdi_item="DI__D__F")
        groups = {"WRL_REST", "EU27_2020", "EXT_EU27_2020", "EA20", "EA19", "EFTA", "OFFSHO", "EUR_OTH", "AFR", "AME", "ASI", "OCE", "NAM", "CAM", "SAM", "EUR", "OTH", "NSA", "INT_ORG"}
        country = lambda k: len(k) == 2 and k not in groups
        imm, labels = fdi_table(counterp="IMM", **base)
        ult, labels2 = fdi_table(counterp="ULT", **base)
        labels.update(labels2)
        year = max(y for y in imm if y in ult)
        top = lambda tbl: [[k, labels.get(k, k), round(v, 1)] for k, v in sorted(((k, v) for k, v in tbl[year].items() if country(k)), key=lambda x: -x[1])[:10]]
        topImm = top(imm)
        trend_codes = [k for k, _, _ in topImm[:6]]
        trend = {k: [[y, round(imm[y][k], 1)] for y in sorted(imm) if k in imm[y] and int(y) >= SINCE] for k in trend_codes}
        sect, slabels = fdi_table(counterp="IMM", geo="CY", currency="MIO_EUR", stk_flow="NI", entity="TOTAL", fdi_item="DI__D__F", partner="WRL_REST")
        sy = max(sect)
        pick = ["K642", "K64", "K", "L", "J", "H50", "M", "G", "C", "I"]
        sectors = [[k, slabels[k], round(sect[sy][k], 1)] for k in pick if k in sect[sy]]
        out["fdiCapital"] = {
            "year": year, "total": round(imm[year].get("WRL_REST", 0), 1),
            "topImmediate": topImm, "topUltimate": top(ult), "trend": trend,
            "sectorYear": sy, "sectorTotal": round(sect[sy].get("FDI", 0), 1), "sectors": sectors,
            "source": es_src("bop_fdi6_pos", "Direct investment positions by partner and activity"),
            "note": "Immediate counterpart: the country the money arrives from directly. Ultimate investor: the country of the investor who finally controls it."}
        print("  ok  fdiCapital", year, topImm[:3])
    except Exception as e:
        print("  --  fdiCapital failed:", e, file=sys.stderr)

    print("Wealth distribution (ECB distributional wealth accounts)")
    dwa_src = lambda key, title: ecb_src("DWA", key, title, publisher="European Central Bank")
    for sid, key, label, unit in [
        ("wealthTop10CY", "Q.CY.S14._Z._Z.NWA.T10.PT.S.N", "Top 10% share of net wealth, Cyprus", "% of household net wealth"),
        ("wealthBottom50CY", "Q.CY.S14._Z._Z.NWA.B50.PT.S.N", "Bottom 50% share of net wealth, Cyprus", "% of household net wealth"),
        ("wealthTop10EA", "Q.I9.S14._Z._Z.NWA.T10.PT.S.N", "Top 10% share of net wealth, euro area", "% of household net wealth"),
        ("wealthBottom50EA", "Q.I9.S14._Z._Z.NWA.B50.PT.S.N", "Bottom 50% share of net wealth, euro area", "% of household net wealth"),
        ("wealthGiniCY", "Q.CY.S14._Z._Z.NWA._Z.GI.S.N", "Wealth Gini coefficient, Cyprus", "Gini, 0 to 100"),
    ]:
        series(sid, label, unit, "Q", dwa_src(key, label), lambda key=key: ecb("DWA", key))

    print("Generations and housing")
    series("leaveHomeCY", "Average age young people leave home, Cyprus", "years", "A",
           es_src("yth_demo_030", "Estimated average age of young people leaving the parental household"),
           lambda: eurostat("yth_demo_030", geo="CY", sex="T", unit="AVG")[0])
    series("leaveHomeEU", "Average age young people leave home, EU", "years", "A",
           es_src("yth_demo_030", "Estimated average age of young people leaving the parental household"),
           lambda: eurostat("yth_demo_030", geo="EU27_2020", sex="T", unit="AVG")[0])

    print("Company structure")
    try:
        sizes = {}
        # Eurostat doesn't publish the 0 to 9 band for Cyprus, so it is worked
        # out as the total minus the published larger bands (and labelled so).
        get = lambda c: dict(eurostat("sbs_sc_ovw", geo="CY", indic_sbs="ENT_NR", nace_r2="B-S_X_O_S94", size_emp=c)[0])
        total, larger = get("TOTAL"), {c: get(c) for c in ["10-19", "20-49", "50-249", "GE250"]}
        year = max(y for y in total if all(y in v for v in larger.values()))
        bands = [["10 to 49", larger["10-19"][year] + larger["20-49"][year]],
                 ["50 to 249", larger["50-249"][year]], ["250 or more", larger["GE250"][year]]]
        bands.insert(0, ["0 to 9 (worked out)", total[year] - sum(v for _, v in bands)])
        sizes = {"total": total[year]}
        out["companySizes"] = {"year": year, "total": total[year], "bands": bands,
                               "note": "The 0 to 9 band is the total minus the larger bands, which Eurostat publishes.",
                               "source": es_src("sbs_sc_ovw", "Enterprise statistics by size class (business economy)")}
        print("  ok  companySizes", out["companySizes"]["bands"])
    except Exception as e:
        print("  --  companySizes failed:", e, file=sys.stderr)

    try:
        fats = {}
        for ind, name in [("V11110", "enterprises"), ("V16110", "employed")]:
            for ctrl in ["WORLD", "WRL_X_REP"]:
                fats[(name, ctrl)] = dict(eurostat("fats_g1a_08", geo="CY", nace_r2="B-N_S95_X_K", indic_sb=ind, c_ctrl=ctrl)[0])
        year = max(y for y in fats[("enterprises", "WORLD")] if all(y in v for v in fats.values()))
        out["foreignControl"] = {
            "year": year,
            "enterprises": {"all": fats[("enterprises", "WORLD")][year], "foreign": fats[("enterprises", "WRL_X_REP")][year]},
            "employed": {"all": fats[("employed", "WORLD")][year], "foreign": fats[("employed", "WRL_X_REP")][year]},
            "source": es_src("fats_g1a_08", "Foreign control of enterprises by economic activity (business economy)"),
            "note": "Enterprises with real activity in the business economy, so registered holding companies with no staff are not counted."}
        print("  ok  foreignControl", out["foreignControl"])
    except Exception as e:
        print("  --  foreignControl failed:", e, file=sys.stderr)

    try:
        t = "Business Register/1600010E.px"
        meta = cystat_meta(t)
        year = next(x for x in meta["variables"] if x["code"] == "YEAR")
        muni = next(x for x in meta["variables"] if x["code"] == "MUNICIPALITY, COMMUNITY")
        nace = next(x for x in meta["variables"] if x["code"].startswith("ECONOMIC ACTIVITY"))
        last = year["values"][-1]
        d = cystat(t, {muni["code"]: muni["values"], "YEAR": [last], nace["code"]: nace["values"]})
        ids = d["id"]
        sz = d["size"]
        cats = [d["dimension"][k]["category"] for k in ids]
        orders = [sorted(c["index"], key=c["index"].get) for c in cats]
        # CYSTAT geocodes: the first digit is the district
        district_of = {"1": "nicosia", "3": "famagusta", "4": "larnaca", "5": "limassol", "6": "paphos"}
        by_district, by_sector = {}, {}
        import itertools
        for flat, combo in enumerate(itertools.product(*[range(n) for n in sz])):
            v = d["value"][flat]
            if not v:
                continue
            codes = {ids[i]: orders[i][combo[i]] for i in range(len(ids))}
            m, n = codes[muni["code"]], codes[nace["code"]]
            nlabel = cats[ids.index(nace["code"])]["label"][n]
            if "-" in m:  # the island total row
                if not nlabel.startswith("A-T"):
                    by_sector[nlabel] = v
                continue
            if nlabel.startswith("A-T"):
                key = district_of.get(m[0])
                if key:
                    by_district[key] = by_district.get(key, 0) + v
        out["establishments"] = {"year": year["valueTexts"][-1], "byDistrict": by_district,
                                 "bySector": sorted(by_sector.items(), key=lambda x: -x[1]),
                                 "source": cy_src("1600010E", "Number of establishments by economic activity and municipality/community")}
        print("  ok  establishments", out["establishments"]["year"], by_district)
    except Exception as e:
        print("  --  establishments failed:", e, file=sys.stderr)

    return out


def previous():
    """The data already on the site, so a failed source keeps its old values."""
    try:
        text = open(OUT, encoding="utf-8").read()
        m = re.search(r"PARATIRITIRIO\.pulse = (\{.*\});\s*$", text, re.S)
        return json.loads(m.group(1))["series"] if m else {}
    except Exception:
        return {}


def main():
    fresh = build()
    old = previous()
    merged = dict(old)
    merged.update(fresh)
    if not merged:
        print("Nothing fetched and nothing to keep; leaving the file alone.")
        return
    payload = {"fetched": date.today().isoformat(), "series": merged}
    body = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    header = ("/* PARATIRITIRIO · Pulse data. Generated by tools/update_pulse.py: never hand-edit.\n"
              "   Sources: Eurostat, the ECB Data Portal (incl. Central Bank of Cyprus series) and CYSTAT. */\n"
              "window.PARATIRITIRIO = window.PARATIRITIRIO || {};\n")
    new = header + "PARATIRITIRIO.pulse = " + body + ";\n"
    # Only the data matters for "changed": ignore the fetched date.
    strip = lambda s: re.sub(r'"fetched":"[^"]*",', "", s)
    try:
        if strip(open(OUT, encoding="utf-8").read()) == strip(new):
            print("No new figures.")
            return
    except FileNotFoundError:
        pass
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(new)
    print("Wrote", os.path.relpath(OUT), f"({len(merged)} series)")


if __name__ == "__main__":
    main()
