# Karhutla Indonesia 2026 — Situation & Response Dashboard

Second disaster-impact analytics project, built by reusing the Anak Krakatau dashboard architecture.

## Scope
Six priority provinces:
Riau, Jambi, Sumatera Selatan, Kalimantan Barat, Kalimantan Tengah, Kalimantan Selatan.

## Initial official snapshot
Latest BNPB dashboard snapshot available for this build (29 Sep 2026):
- 2,310 total hotspots
- 202 fire spots
- 638.6 ha burned in the last 24 hours
- 431.5 ha handled today
- 59,035 combined personnel
- 57 air units
- 36 affected kabupaten/kota

BNPB's 29 Sep situation report separately states that in the 28 Sep situation snapshot, 527.6 ha had burned, 431.53 ha had been handled, and 96.07 ha remained unextinguished.

## Province map
The map highlights the six priority provinces using an Indonesia 38-province GeoJSON boundary file. The choropleth fill is based on a uniform cumulative burned-area snapshot through 9 Aug 2026:
- Kalimantan Barat 28,680.47 ha
- Riau 15,551.76 ha
- Kalimantan Tengah 3,069.52 ha
- Sumatera Selatan 664.87 ha
- Jambi 540 ha
- Kalimantan Selatan 383.07 ha

This is intentionally date-scoped and is not today's fire area.

## Scraper flow
official domains -> keyword discovery -> sitemap/internal links/site search -> relevance score -> PASS: discovered reference / FAIL: fixed reference -> metric extraction -> JSON.

Each source record stores the selected URL, reference type, score, threshold, keyword hits and fetch status.

## Local use
```powershell
python -m pip install -r requirements.txt
python scraper\scrape_karhutla_2026.py
```
Or run `run_scraper.bat`.

Open the dashboard with `open_dashboard.bat`:
`http://localhost:8001/`

## GitHub Actions
`.github/workflows/update-dashboard.yml` runs the scraper daily at 07:00 WIB, commits data changes and deploys the static dashboard to GitHub Pages.

## Sources
BNPB dashboard:
https://gis.bnpb.go.id/karhutla2026/

BNPB 29 Sep six-province update:
https://bnpb.go.id/index.php/berita/perkembangan-situasi-terkini-penanganan-karhutla-di-6-provinsi-prioritas

BNPB 10 Aug uniform province snapshot:
https://www.bnpb.go.id/berita/kepala-bnpb-hadiri-rakor-penanganan-karhutla-pemerintah-perkuat-operasi-darat-hadapi-puncak-risiko-agustusseptember

BMKG 22 Sep hotspot monitoring:
https://www.bmkg.go.id/cuaca/potensi-hujan-sepekan/prakiraan-cuaca-indonesia-sepekan-periode-22-28-september-2026-sebaran-asap-dan-karhutla-masih-menjadi-perhatian-hujan-lebat-masih-terjadi-di-sejumlah-wilayah

BMKG El Niño / Karhutla:
https://www.bmkg.go.id/berita/dampak-el-nino-masih-perlu-diwaspadai-bmkg-perkuat-dukungan-pengendalian-karhutla

Province boundary reference:
https://github.com/denyherianto/indonesia-geojson-topojson-maps-with-38-provinces
