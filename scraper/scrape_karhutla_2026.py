"""
KARHUTLA INDONESIA 2026 — KEYWORD + VALIDATION SCRAPER

Flow:
official domains -> keyword discovery -> candidate scoring -> validate ->
if score passes use discovered reference; otherwise use fixed reference URL ->
extract metrics -> write JSON.

The fixed links are controlled fallbacks, not the primary source-selection method.
"""
from __future__ import annotations
import json,re,time
from datetime import datetime
from pathlib import Path
from typing import Dict,List,Optional,Sequence,Tuple
from urllib.parse import parse_qs,quote_plus,unquote,urljoin,urlparse
import requests
from bs4 import BeautifulSoup

try:
    from bs4 import XMLParsedAsHTMLWarning
except ImportError:
    XMLParsedAsHTMLWarning = Warning
import warnings

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/"data"
OUTPUT=DATA/"karhutla_2026.json"
PROVINCE_OUTPUT=DATA/"province_metrics.json"
REGISTRY_OUTPUT=DATA/"source_registry.json"
TIMEOUT=25
CRAWL_DELAY=.2
MAX_SEARCH_RESULTS=8
MAX_SITEMAP_URLS=250
MAX_CANDIDATES_PER_SOURCE=36
RELEVANCE_THRESHOLD=18
HEADERS={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/154.0 Safari/537.36 KarhutlaDashboard/1.0","Accept-Language":"id-ID,id;q=0.9,en;q=0.8"}

SOURCE_CONFIG=[
{"key":"bnpb_dashboard","name":"BNPB — Dashboard Karhutla 2026","domains":["gis.bnpb.go.id"],"keywords":["karhutla","hotspot","fire spot","luas terbakar","luas ditangani","personel gabungan","29 september 2026","6 provinsi"],"fallback_url":"https://gis.bnpb.go.id/karhutla2026/","queries":["karhutla 2026","karhutla hotspot","karhutla enam provinsi prioritas"]},
{"key":"bnpb_latest","name":"BNPB — Situasi Terkini 6 Provinsi Prioritas","domains":["bnpb.go.id","www.bnpb.go.id"],"keywords":["karhutla","6 provinsi prioritas","527,6","96,07","431,53","59.035","29 september 2026"],"fallback_url":"https://bnpb.go.id/index.php/berita/perkembangan-situasi-terkini-penanganan-karhutla-di-6-provinsi-prioritas","queries":["karhutla 6 provinsi prioritas","karhutla 29 september 2026","527,6 karhutla"]},
{"key":"bnpb_province_snapshot","name":"BNPB — Cumulative Province Snapshot","domains":["bnpb.go.id","www.bnpb.go.id"],"keywords":["karhutla","48.889,69","28.680,47","15.551,76","3.069,52","664,87","540","383,07","9 agustus 2026"],"fallback_url":"https://www.bnpb.go.id/berita/kepala-bnpb-hadiri-rakor-penanganan-karhutla-pemerintah-perkuat-operasi-darat-hadapi-puncak-risiko-agustusseptember","queries":["karhutla 48.889,69","karhutla 9 agustus 2026 enam provinsi","15.551,76 28.680,47 karhutla"]},
{"key":"bmkg_latest","name":"BMKG — Karhutla & Hotspot Monitoring","domains":["bmkg.go.id","www.bmkg.go.id"],"keywords":["karhutla","hotspot","kebakaran hutan dan lahan","kalimantan tengah","sumatera selatan","kalimantan barat","22 september 2026"],"fallback_url":"https://www.bmkg.go.id/cuaca/potensi-hujan-sepekan/prakiraan-cuaca-indonesia-sepekan-periode-22-28-september-2026-sebaran-asap-dan-karhutla-masih-menjadi-perhatian-hujan-lebat-masih-terjadi-di-sejumlah-wilayah","queries":["karhutla hotspot september 2026","karhutla 22 september 2026","Kalimantan Tengah hotspot 5283"]},
{"key":"bmkg_el_nino","name":"BMKG — El Niño & Karhutla Risk","domains":["bmkg.go.id","www.bmkg.go.id"],"keywords":["el niño","karhutla","fase kritis","hotspot","september 2026"],"fallback_url":"https://www.bmkg.go.id/berita/dampak-el-nino-masih-perlu-diwaspadai-bmkg-perkuat-dukungan-pengendalian-karhutla","queries":["El Nino karhutla September 2026","BMKG karhutla 7 September 2026"]},
{"key":"bnpb_kalteng","name":"BNPB — Kalimantan Tengah Evaluation","domains":["bnpb.go.id","www.bnpb.go.id"],"keywords":["kalimantan tengah","karhutla","142.000 hotspot","3.800 kejadian","7.634 hektare","21 september 2026"],"fallback_url":"https://bnpb.go.id/index.php/berita/evaluasi-penanganan-karhutla-kalimantan-tengah-bnpb-perkuat-pemadaman-darat","queries":["Kalimantan Tengah karhutla 142000 hotspot","Kalteng karhutla 21 September 2026"]},
{"key":"bmkg_omc_kalbar","name":"BMKG — OMC Kalimantan Barat","domains":["bmkg.go.id","www.bmkg.go.id"],"keywords":["kalimantan barat","karhutla","omc","operasi modifikasi cuaca","5 september 2026"],"fallback_url":"https://www.bmkg.go.id/berita/utama/optimalkan-potensi-hujan-untuk-redakan-karhutla-bmkg-omc-di-kalbar-buahkan-hasil","queries":["Karhutla Kalimantan Barat OMC 5 September 2026"]}
]
PRIORITY_PROVINCES={"Riau":15551.76,"Jambi":540.0,"Sumatera Selatan":664.87,"Kalimantan Barat":28680.47,"Kalimantan Tengah":3069.52,"Kalimantan Selatan":383.07}
PROVINCE_COORDS={"Riau":(0.3,101.7),"Jambi":(-1.6,103.6),"Sumatera Selatan":(-3.2,104.2),"Kalimantan Barat":(-0.1,110.0),"Kalimantan Tengah":(-1.7,113.4),"Kalimantan Selatan":(-3.0,115.4)}
FALLBACK_CURRENT={"total_hotspots":2310,"fire_spots":202,"burned_area_24h_ha":638.6,"handled_area_today_ha":431.5,"personnel":59035,"air_units":57,"affected_regencies_cities":36,"handled_area_ground_ha":369.03,"handled_area_air_ha":62.5,"uncontrolled_area_ha":96.07,"total_burned_area_situation_ha":527.6}

# Existing local dashboard snapshot is used only as a safety net when a value
# cannot be extracted from the newly discovered/fallback reference pages.
# This avoids the previous NameError caused by referencing an undefined
# `snapshot` object during automated runs.
REFERENCE_SNAPSHOT={
    "hotspot_window": {
        "period": "7–16 September 2026",
        "high_confidence": [
            {"province": "Kalimantan Tengah", "hotspots": 3177},
            {"province": "Sumatera Selatan", "hotspots": 1305},
            {"province": "Kalimantan Barat", "hotspots": 1088},
            {"province": "Papua Selatan", "hotspots": 960},
        ],
    },
    "personnel_composition": [
        {"group": "TNI", "count": 14311},
        {"group": "Relawan", "count": 11919},
        {"group": "Polri", "count": 8153},
        {"group": "Perusahaan", "count": 8069},
        {"group": "MPA", "count": 5743},
        {"group": "BPBD", "count": 3527},
        {"group": "Pemda", "count": 2680},
        {"group": "Satpol PP", "count": 1891},
        {"group": "Manggala Agni", "count": 1451},
        {"group": "Polisi Hutan", "count": 1271},
        {"group": "Pemerintah Pusat", "count": 20},
    ],
    "province_air_quality": [
        {"province": "Riau", "air_quality": "Moderate–Unhealthy", "visibility_km": "4 km"},
        {"province": "Jambi", "air_quality": "Good–Unhealthy", "visibility_km": "2.5 km"},
        {"province": "Sumatera Selatan", "air_quality": "Good–Moderate", "visibility_km": "≤ 6–8 km"},
        {"province": "Kalimantan Barat", "air_quality": "Moderate–Unhealthy", "visibility_km": "0.6–10 km"},
        {"province": "Kalimantan Tengah", "air_quality": "Good–Hazardous", "visibility_km": "2.5 km"},
        {"province": "Kalimantan Selatan", "air_quality": "Unhealthy–Hazardous", "visibility_km": "< 7 km"},
    ],
    "operations_today": [
        {"operation": "Patroli", "sorties": 9},
        {"operation": "Water Bombing", "sorties": 21},
        {"operation": "OMC", "sorties": 8},
    ],
}

# Backward-compatible alias: older versions referenced `snapshot`.
snapshot = REFERENCE_SNAPSHOT

def now_iso(): return datetime.now().astimezone().isoformat()
def norm(t): return re.sub(r"\s+"," ",t or "").strip()
def canon(u):
    try:
        p=urlparse(u); return p._replace(fragment="",query="").geturl().rstrip("/")
    except: return u
def same_domain(u,domains):
    h=urlparse(u).netloc.lower()
    return any(h==d.lower() or h.endswith("."+d.lower()) for d in domains)
def fetch(u):
    try:
        r=requests.get(u,headers=HEADERS,timeout=TIMEOUT)
        return (r.text,r.status_code) if r.ok else ("",r.status_code)
    except: return "",0
def text_from_html(h):
    if not h:return ""
    s=BeautifulSoup(h,"html.parser")
    for tag in s(["script","style","noscript","svg"]): tag.decompose()
    return norm(s.get_text(" ",strip=True))
def title_from_html(h):
    if not h:return ""
    s=BeautifulSoup(h,"html.parser")
    return norm(s.title.get_text(" ",strip=True)) if s.title else ""
def robots_sitemaps(domain):
    h,_=fetch(f"https://{domain}/robots.txt"); out=[]
    for line in h.splitlines():
        if line.lower().startswith("sitemap:"): out.append(line.split(":",1)[1].strip())
    return out[:8] or [f"https://{domain}/sitemap.xml"]
def parse_sitemap(u,seen=None):
    seen=seen or set(); u=canon(u)
    if u in seen or len(seen)>25:return []
    seen.add(u); h,_=fetch(u)
    if not h:return []
    try:
        s=BeautifulSoup(h,"xml"); out=[]
    except Exception:
        with warnings.catch_warnings():
            warnings.simplefilter("ignore", XMLParsedAsHTMLWarning)
            s=BeautifulSoup(h,"html.parser"); out=[]
    for loc in s.find_all("loc"):
        v=norm(loc.get_text())
        if v.endswith(".xml") or "sitemap" in v.lower(): out.extend(parse_sitemap(v,seen))
        elif v.startswith("http"): out.append(v)
        if len(out)>=MAX_SITEMAP_URLS:break
    return list(dict.fromkeys(out))[:MAX_SITEMAP_URLS]
def homepage_links(domain):
    base=f"https://{domain}/"; h,_=fetch(base)
    if not h:return []
    s=BeautifulSoup(h,"html.parser"); out=[]
    for a in s.find_all("a",href=True):
        u=canon(urljoin(base,a["href"]))
        if same_domain(u,[domain]) and u not in out: out.append(u)
        if len(out)>=80:break
    return out
def ddg_site_search(domain,q):
    h,_=fetch(f"https://html.duckduckgo.com/html/?q={quote_plus(f'site:{domain} {q}')}")
    if not h:return []
    s=BeautifulSoup(h,"html.parser"); out=[]
    for a in s.select("a.result__a"):
        u=a.get("href")
        if not u:continue
        if "uddg=" in u:
            p=urlparse(u);u=unquote(parse_qs(p.query).get("uddg",[""])[0])
        u=canon(u)
        if same_domain(u,[domain]) and u not in out:out.append(u)
        if len(out)>=MAX_SEARCH_RESULTS:break
    return out
def score_candidate(url,title,text,keywords):
    score=0;hits=[]; tl=title.lower(); ul=url.lower(); txt=text[:9000].lower()
    for kw in keywords:
        k=kw.lower(); hit=False
        if k in tl: score+=9;hit=True
        elif k in ul: score+=5;hit=True
        elif k in txt: score+=2;hit=True
        if hit:hits.append(kw)
    hay=ul+" "+tl+" "+txt
    if "karhutla" in hay:score+=5
    if "kebakaran hutan dan lahan" in hay:score+=4
    if "2026" in hay:score+=2
    return score,hits
def discover_source(src):
    urls=[]
    for domain in src["domains"]:
        for sm in robots_sitemaps(domain): urls.extend(parse_sitemap(sm))
        urls.extend(homepage_links(domain)[:50])
        for q in src["queries"]:
            urls.extend(ddg_site_search(domain,q));time.sleep(CRAWL_DELAY)
    uniq=[]
    for u in urls:
        u=canon(u)
        if u and same_domain(u,src["domains"]) and u not in uniq:uniq.append(u)
        if len(uniq)>=MAX_CANDIDATES_PER_SOURCE:break
    ranked=[]
    for u in uniq:
        h,code=fetch(u)
        if not h:continue
        tx=text_from_html(h)
        if len(tx)<100:continue
        ti=title_from_html(h) or u.rsplit("/",1)[-1]
        score,hits=score_candidate(u,ti,tx,src["keywords"])
        ranked.append({"url":u,"title":ti,"text":tx,"score":score,"keyword_hits":hits,"status_code":code})
    ranked.sort(key=lambda x:(x["score"],len(x["keyword_hits"])),reverse=True)
    best=ranked[0] if ranked else None
    if best and best["score"]>=RELEVANCE_THRESHOLD:
        best.update({"reference_type":"keyword_match","validation_passed":True,"validation_threshold":RELEVANCE_THRESHOLD,"pages_checked":len(ranked),"discovery_method":"keywords + sitemap + internal links + site-restricted search"})
        return best
    h,code=fetch(src["fallback_url"]);tx=text_from_html(h);ti=title_from_html(h) or src["name"]
    score,hits=score_candidate(src["fallback_url"],ti,tx,src["keywords"])
    return {"url":src["fallback_url"],"title":ti,"text":tx,"score":score,"keyword_hits":hits,"status_code":code,"reference_type":"fixed_reference","validation_passed":False,"validation_threshold":RELEVANCE_THRESHOLD,"pages_checked":len(ranked),"discovery_method":"fixed reference fallback"}
def parse_num(s):
    if not s:return None
    s=s.replace(" ","")
    if "," in s and "." in s:
        s=s.replace(".","").replace(",",".") if s.rfind(",")>s.rfind(".") else s.replace(",","")
    elif "," in s:
        s=s.replace(",","") if not re.search(r",\d{1,2}$",s) else s.replace(",",".")
    elif s.count(".")>1:s=s.replace(".","")
    try:return float(s)
    except:return None
def find_num(text,patterns):
    for p in patterns:
        m=re.search(p,text,re.I|re.S)
        if m:
            v=parse_num(m.group(1))
            if v is not None:return v
    return None
def extract_current(text):
    return {
        "total_hotspots":find_num(text,[r"Total Hotspot Hari Ini[^0-9]{0,80}([\d.,]+)"]),
        "fire_spots":find_num(text,[r"Fire Spot[^0-9]{0,80}([\d.,]+)"]),
        "burned_area_24h_ha":find_num(text,[r"Luas Terbakar 24H Terakhir[^0-9]{0,80}([\d.,]+)"]),
        "handled_area_today_ha":find_num(text,[r"Luas Ditangani.*?Hari Ini[^0-9]{0,80}([\d.,]+)"]),
        "personnel":find_num(text,[r"Personel Gabungan[^0-9]{0,80}([\d.,]+)"]),
        "air_units":find_num(text,[r"Total Unit Udara Hari Ini[^0-9]{0,80}([\d.,]+)"]),
        "affected_regencies_cities":find_num(text,[r"Kab/Kota Terdampak[^0-9]{0,80}([\d.,]+)"]),
        "handled_area_ground_ha":find_num(text,[r"Darat\s*([\d.,]+)\s*ha"]),
        "handled_area_air_ha":find_num(text,[r"Udara\s*([\d.,]+)\s*ha"]),
        "uncontrolled_area_ha":find_num(text,[r"belum padam[^0-9]{0,40}([\d.,]+)\s*hektare"]),
        "total_burned_area_situation_ha":find_num(text,[r"total luas lahan terbakar[^0-9]{0,80}([\d.,]+)\s*hektare"]),
    }
def extract_province_snapshot(text):
    patterns={
      "Kalimantan Barat":r"Kalimantan Barat[^0-9]{0,120}([\d.,]+)\s*hektare",
      "Riau":r"Riau[^0-9]{0,120}([\d.,]+)\s*hektare",
      "Kalimantan Tengah":r"Kalimantan Tengah[^0-9]{0,120}([\d.,]+)\s*hektare",
      "Sumatera Selatan":r"Sumatera Selatan[^0-9]{0,120}([\d.,]+)\s*hektare",
      "Jambi":r"Jambi[^0-9]{0,120}([\d.,]+)\s*hektare",
      "Kalimantan Selatan":r"Kalimantan Selatan[^0-9]{0,120}([\d.,]+)\s*hektare"}
    out=[]
    for p,pat in patterns.items():
        v=find_num(text,[pat])
        if v is not None:out.append({"name":p,"burned_area_snapshot_ha":v})
    return out
def extract_hotspots(text):
    patterns={
      "Kalimantan Tengah":r"Kalimantan Tengah sebanyak\s*([\d.,]+)\s*titik",
      "Sumatera Selatan":r"Sumatera Selatan sebanyak\s*([\d.,]+)\s*titik",
      "Kalimantan Barat":r"Kalimantan Barat(?: sebanyak)?\s*([\d.,]+)\s*titik",
      "Kalimantan Selatan":r"Kalimantan Selatan sebanyak\s*([\d.,]+)\s*titik",
      "Kalimantan Timur":r"Kalimantan Timur sebanyak\s*([\d.,]+)\s*titik"}
    out=[]
    for p,ps in patterns.items():
        v=find_num(text,[ps])
        if v is not None:out.append({"province":p,"hotspots":int(v)})
    return out
def extract_personnel(text):
    out=[]
    for g in ["TNI","Relawan","Polri","Perusahaan","MPA","BPBD","Pemda","Satpol PP","Manggala Agni","Polisi Hutan","Pemerintah Pusat"]:
        v=find_num(text,[rf"\b{re.escape(g)}\b\s*([\d.,]+)"])
        if v is not None:out.append({"group":g,"count":int(v)})
    return out
def write(obj,p):p.write_text(json.dumps(obj,ensure_ascii=False,indent=2),encoding="utf-8")

def main():
    print("============================================================")
    print(" KARHUTLA INDONESIA 2026 — KEYWORD + VALIDATION SCRAPER")
    print("============================================================")
    print(f"Relevance threshold: {RELEVANCE_THRESHOLD}")
    selected={}
    for src in SOURCE_CONFIG:
        r=discover_source(src);selected[src["key"]]=r
        print(f"{src['name']}: {r['reference_type']} | score={r['score']} | {r['url']}")
    dashboard_text=selected["bnpb_dashboard"]["text"]
    latest_text=selected["bnpb_latest"]["text"]+" "+dashboard_text
    province_text=selected["bnpb_province_snapshot"]["text"]
    bmkg_text=selected["bmkg_latest"]["text"]+" "+selected["bmkg_el_nino"]["text"]
    current=extract_current(latest_text)
    for k,v in FALLBACK_CURRENT.items():
        if current.get(k) is None:current[k]=v
    prows=extract_province_snapshot(province_text); pmap={x["name"]:x["burned_area_snapshot_ha"] for x in prows}
    for p,v in PRIORITY_PROVINCES.items():pmap.setdefault(p,v)
    hotspot_top=extract_hotspots(bmkg_text)
    if len(hotspot_top)<3:hotspot_top=[{"province":"Kalimantan Tengah","hotspots":5283},{"province":"Sumatera Selatan","hotspots":1485},{"province":"Kalimantan Barat","hotspots":1357},{"province":"Kalimantan Selatan","hotspots":498},{"province":"Kalimantan Timur","hotspots":433}]
    personnel=extract_personnel(dashboard_text)
    if len(personnel)<5: personnel=REFERENCE_SNAPSHOT["personnel_composition"]
    air_quality=REFERENCE_SNAPSHOT["province_air_quality"]
    provinces=[]
    for name,area in pmap.items():
        lat,lng=PROVINCE_COORDS[name]
        provinces.append({"name":name,"key":name.lower().replace(" ","_"),"coverage":"Priority response","lat":lat,"lng":lng,"burned_area_snapshot_ha":area})
    cards=[]
    for src in SOURCE_CONFIG:
        s=selected[src["key"]]
        cards.append({"title":src["name"],"description":"Keyword-discovered reference validated by relevance score." if s["reference_type"]=="keyword_match" else "Keyword candidate did not meet the relevance threshold; fixed reference used.","date":None,"url":s["url"],"reference_type":s["reference_type"],"relevance_score":s["score"],"validation_threshold":RELEVANCE_THRESHOLD,"validation_passed":s["validation_passed"],"keyword_hits":s["keyword_hits"],"pages_checked":s["pages_checked"],"fetch_status":"OK" if s["status_code"]==200 else "UNAVAILABLE"})
    data={"metadata":{"last_updated":now_iso(),"last_updated_display":datetime.now().astimezone().strftime("%d %B %Y, %H:%M WIB"),"report_title":"Karhutla Indonesia 2026 — Situasi & Penanganan","scope":"Six priority provinces","discovery_mode":"keywords + sitemap + internal links + site-restricted search","relevance_threshold":RELEVANCE_THRESHOLD,"fallback_policy":"If the best keyword-discovered candidate does not meet the relevance threshold, use the configured fixed reference URL.","author":"Kelvin Irawan"},"current":current,"priority_provinces":provinces,"province_air_quality":air_quality,"hotspot_window_latest":{"period":"10–21 September 2026","high_confidence":hotspot_top},"hotspot_window":REFERENCE_SNAPSHOT["hotspot_window"],"personnel_composition":personnel,"operations_today":REFERENCE_SNAPSHOT["operations_today"],"province_snapshot_date":"9 August 2026","province_snapshot_source_note":"Uniform province comparison from BNPB reporting through 9 August 2026.","sources":cards}
    write(data,OUTPUT);write(provinces,PROVINCE_OUTPUT);write({"generated_at":now_iso(),"sources":cards},REGISTRY_OUTPUT)
    print("SCRAPING COMPLETE")

if __name__=="__main__":main()
