const state={
  lang:localStorage.getItem("karhutlaDashboardLang")||"en",
  data:null,
  charts:{},
  map:null,
  mapLayer:null,
  mobile:localStorage.getItem("karhutlaDashboardMobile")==="1"
};

const I18N={
  en:{
    eyebrow:"FOREST & LAND FIRE IMPACT ANALYTICS",title:"Karhutla Indonesia 2026",
    headerDescription:"Situation, fire coverage, hotspot activity, air quality, and response operations across Indonesia's priority provinces.",
    statusLabel:"REPORT STATUS",statusBadge:"Monitoring 6 Priority Provinces",updatedAsOf:"UPDATED DATA AS OF",
    mobileView:"Mobile view",desktopView:"Desktop view",
    hotspots:"Total Hotspots",fireSpots:"Fire Spots",sixProvinceAccum:"Accumulated across 6 priority provinces",verifiedOperational:"Operational fire spots",burned24h:"Burned Area — 24h",handledToday:"Area Handled — Today",personnel:"Combined Personnel",responsePersonnel:"Response personnel",affectedKab:"Affected Kab/Kota",reportedCoverage:"Reported affected districts/cities",
    situationOverview:"Situation Overview",latestOperational:"Latest operational snapshot for the six priority provinces",priorityScope:"Priority scope",total24h:"Burned area, last 24h",handledGround:"Handled — ground",handledAir:"Handled — air",remainingUncontrolled:"Unextinguished area, 28 Sep",airUnits:"Air units",
    impactSummary:"Impact & Response Summary",mainResponseAreas:"Key recorded impacts and response capacity",hotspotActivity:"Hotspot activity",provinceCoverage:"Priority province coverage",sixPriorityText:"Six provinces are under priority response.",fieldResponse:"Field response",airOperations:"Air operations",airQuality:"Air quality",airQualityText:"Qualitative air-quality conditions and visibility varied across the priority provinces.",weatherContext:"Weather context",weatherContextText:"BMKG linked dry conditions and very strong El Niño influence with elevated karhutla risk.",
    provinceCoverageMap:"Province Coverage",provinceCoverageSubtitle:"Priority provinces highlighted on the Indonesia administrative map",mapNote:"The highlighted six provinces are the national priority response area. Fill intensity uses a uniform cumulative burned-area snapshot through 9 August 2026, not today's fire area.",provinceAreaChart:"Burned Area by Priority Province",provinceAreaSubtitle:"Uniform comparison snapshot through 9 August 2026",
    hotspotChart:"High-Confidence Hotspots",responseOps:"Response Operations",sortiesToday:"Reported sorties today",personnelComposition:"Combined Personnel Composition",allInstitutions:"Across participating response groups",airQualityPanel:"Air Quality & Visibility",qualitativePanel:"Qualitative conditions reported across the priority provinces",
    latestSituation:"Latest Situation",latestSituationSubtitle:"28–29 September 2026 operational update",haUnitShort:"ha (hectare)",haUnit:"1 ha (hectare) = 10,000 m² ≈ 100 m × 100 m",reportedBurned:"Reported burned area",handledArea:"Handled",unextinguished:"Still unextinguished",comparison:"Change vs 27 Sep",scopeNote:"Daily and cumulative metrics in this report come from different official snapshots. Dates and metric scope are shown so values are not interpreted as if they were from one identical time window.",
    timeline:"Karhutla Response Timeline",milestones:"Key monitoring and response milestones",timeline1Title:"National priority response reinforced",timeline1Desc:"BNPB highlighted six priority provinces as the government prepared for elevated August–September karhutla risk.",timeline2Title:"BMKG flagged critical conditions",timeline2Desc:"Dry conditions, very strong El Niño influence and high hotspot activity remained important risk factors.",timeline3Title:"Hotspot concentration & air-quality pressure",timeline3Desc:"BMKG and BNPB reported high hotspot concentration in Kalimantan and Sumatra, with smoke and visibility impacts.",timeline4Title:"Latest six-province response update",timeline4Desc:"BNPB reported 527.6 ha burned in the latest situation snapshot, 431.53 ha handled and 96.07 ha still unextinguished.",
    sources:"Data Sources",sourcesSubtitle:"Official references used by the dashboard and scraper",officialReference:"Official reference",validatedSource:"Validated source",referenceRetained:"Reference retained",sourceAvailable:"Source available",openSource:"Open source ↗",validationScore:"Relevance score",dateUnavailable:"Reference date not provided",visibility:"Visibility",priorityResponse:"Priority response area",burnedSnapshot:"Burned-area snapshot through 9 Aug 2026",sourceSelection:"Reference selection",footerTitle:"Karhutla Indonesia 2026 — Situation & Response Dashboard",footerCredit:'Data analysis & dashboard by <strong>Kelvin Irawan</strong>',footerTech:"Built with HTML, CSS, JavaScript, Chart.js, Leaflet and Python",footerNote:"Data compiled from publicly available official sources. Province-area comparison is date-scoped to 9 August 2026; operational snapshot metrics are date-scoped to 28–29 September 2026.",
    chartBurnedArea:"Burned area (ha)",chartHotspots:"High-confidence hotspots",chartSorties:"Sorties",chartPersonnel:"Personnel",
    unitPeople:"people",unitPersonnel:"personnel",unitAirUnits:"units",unitHotspots:"hotspots",unitFireSpots:"fire spots",unitKota:"districts/cities",
    summaryHotspot:(h,f)=>`${h} hotspots and ${f} fire spots in the current dashboard snapshot.`,
    summaryPersonnel:(p)=>`${p} combined personnel across participating response groups.`,
    summaryAir:(u)=>`${u} total air units; 9 patrol, 21 water-bombing and 8 OMC sorties are separately reported.`,
    visibilityValue:(v)=>`Visibility: ${v}`
  },
  id:{
    eyebrow:"ANALISIS DAMPAK KEBAKARAN HUTAN & LAHAN",title:"Karhutla Indonesia 2026",
    headerDescription:"Situasi, cakupan kebakaran, aktivitas hotspot, kualitas udara, dan operasi penanganan di provinsi prioritas Indonesia.",
    statusLabel:"STATUS LAPORAN",statusBadge:"Pemantauan 6 Provinsi Prioritas",updatedAsOf:"DATA DIPERBARUI PER",
    mobileView:"Tampilan mobile",desktopView:"Tampilan desktop",
    hotspots:"Total Hotspot",fireSpots:"Titik Api",sixProvinceAccum:"Akumulasi pada 6 provinsi prioritas",verifiedOperational:"Titik api operasional",burned24h:"Luas Terbakar — 24 Jam",handledToday:"Luas Ditangani — Hari Ini",personnel:"Personel Gabungan",responsePersonnel:"Personel penanganan",affectedKab:"Kab/Kota Terdampak",reportedCoverage:"Kabupaten/kota terdampak yang dilaporkan",
    situationOverview:"Ringkasan Situasi",latestOperational:"Snapshot operasional terbaru untuk enam provinsi prioritas",priorityScope:"Cakupan prioritas",total24h:"Luas terbakar, 24 jam terakhir",handledGround:"Ditangani — darat",handledAir:"Ditangani — udara",remainingUncontrolled:"Area masih belum padam, 28 Sep",airUnits:"Unit udara",
    impactSummary:"Ringkasan Dampak & Penanganan",mainResponseAreas:"Dampak utama dan kapasitas penanganan yang tercatat",hotspotActivity:"Aktivitas hotspot",provinceCoverage:"Cakupan provinsi prioritas",sixPriorityText:"Enam provinsi berada dalam prioritas penanganan.",fieldResponse:"Penanganan lapangan",airOperations:"Operasi udara",airQuality:"Kualitas udara",airQualityText:"Kondisi kualitas udara dan jarak pandang bervariasi di provinsi prioritas.",weatherContext:"Konteks cuaca",weatherContextText:"BMKG mengaitkan kondisi kering dan pengaruh El Niño sangat kuat dengan peningkatan risiko karhutla.",
    provinceCoverageMap:"Cakupan Provinsi",provinceCoverageSubtitle:"Provinsi prioritas ditampilkan pada peta administratif Indonesia",mapNote:"Enam provinsi yang disorot merupakan wilayah prioritas penanganan nasional. Intensitas warna menggunakan snapshot akumulasi luas terbakar hingga 9 Agustus 2026, bukan luas kebakaran hari ini.",provinceAreaChart:"Luas Terbakar per Provinsi Prioritas",provinceAreaSubtitle:"Perbandingan seragam hingga 9 Agustus 2026",
    hotspotChart:"Hotspot Kepercayaan Tinggi",responseOps:"Operasi Penanganan",sortiesToday:"Sortie yang dilaporkan hari ini",personnelComposition:"Komposisi Personel Gabungan",allInstitutions:"Dari kelompok penanganan yang berpartisipasi",airQualityPanel:"Kualitas Udara & Jarak Pandang",qualitativePanel:"Kondisi kualitatif yang dilaporkan di provinsi prioritas",
    latestSituation:"Situasi Terbaru",latestSituationSubtitle:"Pembaruan operasional 28–29 September 2026",haUnitShort:"ha (hektare)",haUnit:"1 ha (hektare) = 10.000 m² ≈ 100 × 100 m",reportedBurned:"Luas terbakar yang dilaporkan",handledArea:"Ditangani",unextinguished:"Masih belum padam",comparison:"Perubahan vs 27 Sep",scopeNote:"Metrik harian dan kumulatif dalam laporan ini berasal dari snapshot resmi dengan waktu yang berbeda. Tanggal dan cakupan metrik ditampilkan agar nilainya tidak dianggap berasal dari satu periode yang sama.",
    timeline:"Linimasa Penanganan Karhutla",milestones:"Tonggak pemantauan dan penanganan",timeline1Title:"Prioritas nasional diperkuat",timeline1Desc:"BNPB menekankan enam provinsi prioritas saat pemerintah mempersiapkan peningkatan risiko karhutla pada Agustus–September.",timeline2Title:"BMKG menandai kondisi kritis",timeline2Desc:"Kondisi kering, pengaruh El Niño sangat kuat, dan aktivitas hotspot tinggi tetap menjadi faktor risiko penting.",timeline3Title:"Konsentrasi hotspot & tekanan kualitas udara",timeline3Desc:"BMKG dan BNPB melaporkan konsentrasi hotspot tinggi di Kalimantan dan Sumatera, disertai dampak asap dan jarak pandang.",timeline4Title:"Pembaruan penanganan enam provinsi",timeline4Desc:"BNPB melaporkan 527,6 ha terbakar pada snapshot situasi terbaru, 431,53 ha ditangani dan 96,07 ha masih belum padam.",
    sources:"Sumber Data",sourcesSubtitle:"Referensi resmi yang digunakan dashboard dan scraper",officialReference:"Referensi resmi",validatedSource:"Sumber tervalidasi",referenceRetained:"Referensi dipertahankan",sourceAvailable:"Sumber tersedia",openSource:"Buka sumber ↗",validationScore:"Skor relevansi",dateUnavailable:"Tanggal referensi tidak tersedia",visibility:"Jarak pandang",priorityResponse:"Wilayah prioritas penanganan",burnedSnapshot:"Snapshot luas terbakar hingga 9 Agustus 2026",sourceSelection:"Pemilihan referensi",footerTitle:"Karhutla Indonesia 2026 — Dashboard Situasi & Penanganan",footerCredit:'Analisis data & dashboard oleh <strong>Kelvin Irawan</strong>',footerTech:"Dibangun dengan HTML, CSS, JavaScript, Chart.js, Leaflet, dan Python",footerNote:"Data dihimpun dari sumber resmi yang tersedia untuk publik. Perbandingan luas provinsi menggunakan cakupan tanggal 9 Agustus 2026; metrik snapshot operasional menggunakan cakupan 28–29 September 2026.",
    chartBurnedArea:"Luas terbakar (ha)",chartHotspots:"Hotspot kepercayaan tinggi",chartSorties:"Sortie",chartPersonnel:"Personel",
    unitPeople:"orang",unitPersonnel:"personel",unitAirUnits:"unit",unitHotspots:"hotspot",unitFireSpots:"titik api",unitKota:"kabupaten/kota",
    summaryHotspot:(h,f)=>`${h} hotspot dan ${f} titik api pada snapshot dashboard saat ini.`,
    summaryPersonnel:(p)=>`${p} personel gabungan dari kelompok penanganan yang berpartisipasi.`,
    summaryAir:(u)=>`${u} unit udara; 9 patroli, 21 water bombing, dan 8 sortie OMC dilaporkan secara terpisah.`,
    visibilityValue:(v)=>`Jarak pandang: ${v}`
  }
};

function t(key){
  const lang=I18N[state.lang]||I18N.en;
  return lang[key] ?? I18N.en[key] ?? key;
}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function fmt(v,d=1){const n=Number(v);return Number.isFinite(n)?new Intl.NumberFormat(state.lang==="id"?"id-ID":"en-US",{maximumFractionDigits:d}).format(n):"—"}
function set(id,v){const e=document.getElementById(id);if(e)e.textContent=v}
function clone(v){return JSON.parse(JSON.stringify(v))}

const provinceNames={
  en:{"Riau":"Riau","Jambi":"Jambi","Sumatera Selatan":"South Sumatra","Kalimantan Barat":"West Kalimantan","Kalimantan Tengah":"Central Kalimantan","Kalimantan Selatan":"South Kalimantan"},
  id:{"Riau":"Riau","Jambi":"Jambi","Sumatera Selatan":"Sumatera Selatan","Kalimantan Barat":"Kalimantan Barat","Kalimantan Tengah":"Kalimantan Tengah","Kalimantan Selatan":"Kalimantan Selatan"}
};
const airQualityNames={
  en:{"Good–Unhealthy":"Good–Unhealthy","Moderate–Unhealthy":"Moderate–Unhealthy","Good":"Good","Moderate":"Moderate","Unhealthy":"Unhealthy","Hazardous":"Hazardous"},
  id:{"Good–Unhealthy":"Baik–Tidak Sehat","Moderate–Unhealthy":"Sedang–Tidak Sehat","Good":"Baik","Moderate":"Sedang","Unhealthy":"Tidak Sehat","Hazardous":"Berbahaya"}
};

function translateProvince(name){return provinceNames[state.lang]?.[name]||name}
function translateAirQuality(v){return airQualityNames[state.lang]?.[v]||v}
function applyLang(){
  document.documentElement.lang=state.lang;
  document.querySelectorAll("[data-i18n]").forEach(e=>e.innerHTML=t(e.dataset.i18n));
  document.querySelectorAll(".lang-button").forEach(b=>b.classList.toggle("active",b.dataset.lang===state.lang));
  localStorage.setItem("karhutlaDashboardLang",state.lang);
  updateMobileToggleText();
  if(state.data){renderAll(state.data)}
}
function updateMobileToggleText(){
  const active=state.mobile;
  const button=document.getElementById("mobileToggle");
  if(button){button.classList.toggle("active",active);button.setAttribute("aria-pressed",String(active))}
  const text=document.getElementById("mobileToggleText");
  if(text)text.textContent=active?t("desktopView"):t("mobileView");
}
function setMobileMode(enabled){
  state.mobile=enabled;
  document.body.classList.toggle("mobile-mode",enabled);
  localStorage.setItem("karhutlaDashboardMobile",enabled?"1":"0");
  updateMobileToggleText();
  requestAnimationFrame(()=>{
    if(state.map){
      setTimeout(()=>{
        state.map.invalidateSize();
        fitMapToMode();
      },80);
    }
  });
}
function destroy(k){if(state.charts[k])state.charts[k].destroy()}

const barValueLabel={
  id:"karhutlaBarValueLabel",
  afterDatasetsDraw(chart,args,pluginOptions){
    const meta=chart.getDatasetMeta(0);
    const ds=chart.data.datasets[0];
    const ctx=chart.ctx;
    const axis=pluginOptions?.indexAxis||chart.options.indexAxis||"x";
    const decimals=Number.isFinite(pluginOptions?.decimals)?pluginOptions.decimals:0;
    ctx.save();
    ctx.font="700 11px Inter, sans-serif";
    ctx.fillStyle="#0f172a";
    ctx.textBaseline="middle";
    meta.data.forEach((bar,i)=>{
      const value=Number(ds.data[i]);
      if(!Number.isFinite(value))return;
      const text=fmt(value,decimals);
      if(axis==="y"){
        ctx.textAlign="left";
        ctx.fillText(text,bar.x+8,bar.y);
      }else{
        ctx.textAlign="center";
        ctx.textBaseline="bottom";
        ctx.fillText(text,bar.x,bar.y-7);
      }
    });
    ctx.restore();
  }
};

function bar(k,id,labels,data,label,indexAxis="x",maxX=null,decimals=0){
  destroy(k);
  const el=document.getElementById(id);if(!el)return;
  state.charts[k]=new Chart(el,{
    type:"bar",
    data:{labels,datasets:[{label,data,borderRadius:7,backgroundColor:"rgba(234,88,12,.72)",borderColor:"#ea580c",borderWidth:1}]},
    plugins:[barValueLabel],
    options:{
      indexAxis,responsive:true,maintainAspectRatio:false,
      layout:{padding:{right:indexAxis==="y"?66:12,top:indexAxis==="x"?22:6}},
      plugins:{legend:{display:!!label,position:"bottom",labels:{font:{size:11}}},karhutlaBarValueLabel:{indexAxis,decimals}},
      scales:{
        x:{beginAtZero:true,max:maxX??undefined,grid:{display:indexAxis==="y"?false:true},ticks:{font:{size:10}}},
        y:{beginAtZero:true,grid:{display:true,color:"#eef2f7"},ticks:{font:{size:10}}}
      }
    }
  });
}

function renderKPIs(d){
  set("kpiHotspots",fmt(d.current?.total_hotspots,0));
  set("kpiFireSpots",fmt(d.current?.fire_spots,0));
  set("kpiBurned24h",fmt(d.current?.burned_area_24h_ha,1));
  set("kpiHandledToday",fmt(d.current?.handled_area_today_ha,1));
  set("kpiPersonnel",fmt(d.current?.personnel,0));
  set("kpiAffectedKab",fmt(d.current?.affected_regencies_cities,0));
  set("statusDate",d.metadata?.last_updated_display||"—");
  set("overviewBurned",`${fmt(d.current?.burned_area_24h_ha,1)} ha`);
  set("overviewGround",`${fmt(d.current?.handled_area_ground_ha,1)} ha`);
  set("overviewAir",`${fmt(d.current?.handled_area_air_ha,1)} ha`);
  set("overviewRemaining",`${fmt(d.current?.uncontrolled_area_ha,2)} ha`);
  set("overviewAirUnits",`${fmt(d.current?.air_units,0)} ${t("unitAirUnits")}`);
  set("summaryHotspotText",I18N[state.lang].summaryHotspot(fmt(d.current?.total_hotspots,0),fmt(d.current?.fire_spots,0)));
  set("summaryPersonnelText",I18N[state.lang].summaryPersonnel(fmt(d.current?.personnel,0)));
  set("summaryAirText",I18N[state.lang].summaryAir(fmt(d.current?.air_units,0)));
  set("latestTotalBurned",`${fmt(d.current?.total_burned_area_situation_ha,1)} ha`);
  set("latestHandled",`${fmt(d.current?.handled_area_ground_ha+d.current?.handled_area_air_ha,2)} ha`);
  set("latestUnextinguished",`${fmt(d.current?.uncontrolled_area_ha,2)} ha`);
  set("latestChange","−62.29 ha");
  set("hotspotPeriod",d.hotspot_window_latest?.period||d.hotspot_window?.period||"—");
  set("overviewScope",state.lang==="id"?"Riau • Jambi • Sumatera Selatan • Kalimantan Barat • Kalimantan Tengah • Kalimantan Selatan":"Riau • Jambi • South Sumatra • West Kalimantan • Central Kalimantan • South Kalimantan");
}

function renderCharts(d){
  const p=[...(d.priority_provinces||[])].sort((a,b)=>Number(b.burned_area_snapshot_ha)-Number(a.burned_area_snapshot_ha));
  bar("province","provinceAreaChart",p.map(x=>translateProvince(x.name)),p.map(x=>x.burned_area_snapshot_ha),t("chartBurnedArea"),"y",null,2);
  const h=d.hotspot_window_latest?.high_confidence||d.hotspot_window?.high_confidence||[];
  bar("hotspots","hotspotChart",h.map(x=>translateProvince(x.province)),h.map(x=>x.hotspots),t("chartHotspots"),"y",null,0);
  const o=d.operations_today||[];
  const opNames=state.lang==="id"?{"Patroli":"Patroli","Water Bombing":"Water Bombing","OMC":"OMC"}:{"Patroli":"Patrol","Water Bombing":"Water Bombing","OMC":"OMC"};
  bar("ops","operationsChart",o.map(x=>opNames[x.operation]||x.operation),o.map(x=>x.sorties),t("chartSorties"),"x",null,0);
  const pe=(d.personnel_composition||[]).slice().sort((a,b)=>b.count-a.count);
  bar("personnel","personnelChart",pe.map(x=>x.group),pe.map(x=>x.count),t("chartPersonnel"),"y",null,0);
}

function renderAir(d){
  const el=document.getElementById("airQualityGrid");
  el.innerHTML=(d.province_air_quality||[]).map(x=>{
    const q=String(x.air_quality||"").toLowerCase();
    let c=q.includes("hazardous")?"danger":q.includes("unhealthy")?"warning":q.includes("moderate")?"moderate":"good";
    return `<div class="air-card"><div class="air-top"><strong>${esc(translateProvince(x.province))}</strong><span class="air-pill ${c}">${esc(translateAirQuality(x.air_quality))}</span></div><div class="air-meta">${esc(I18N[state.lang].visibilityValue(x.visibility_km))}</div></div>`
  }).join("");
}

async function renderMap(d){
  if(state.map)state.map.remove();
  state.map=null;
  const initialCenter=state.mobile?[-1.5,112.5]:[-1.1,113.2];
  const initialZoom=state.mobile?3.8:4.35;
  state.map=L.map("provinceMap",{scrollWheelZoom:!state.mobile,zoomControl:true}).setView(initialCenter,initialZoom);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:8,attribution:"&copy; OpenStreetMap contributors"}).addTo(state.map);

  const m=new Map((d.priority_provinces||[]).map(x=>[String(x.name).toLowerCase(),x]));
  const u="https://cdn.jsdelivr.net/gh/denyherianto/indonesia-geojson-topojson-maps-with-38-provinces@main/GeoJSON/indonesia-38-provinces.geojson";
  try{
    const r=await fetch(u,{cache:"no-store"});
    if(!r.ok)throw new Error(`Boundary HTTP ${r.status}`);
    const g=await r.json();
    const vals=[...m.values()].map(x=>Number(x.burned_area_snapshot_ha)).filter(Number.isFinite);
    const mx=Math.max(...vals),mn=Math.min(...vals);
    const color=v=>{if(!Number.isFinite(v))return"#eef2f6";const z=(v-mn)/(mx-mn||1);return z>.7?"#c2410c":z>.35?"#ea580c":"#fb923c"};
    state.priorityBounds=L.latLngBounds([]);
    state.mapLayer=L.geoJSON(g,{style:f=>{const n=String(f.properties?.PROVINSI||f.properties?.NAME_1||f.properties?.name||"").toLowerCase();const x=m.get(n);return x?{color:"#9a3412",weight:1.2,fillColor:color(Number(x.burned_area_snapshot_ha)),fillOpacity:.64}:{color:"#d5dce5",weight:.55,fillColor:"#f1f5f9",fillOpacity:.40}},onEachFeature:(f,l)=>{const raw=f.properties?.PROVINSI||f.properties?.NAME_1||f.properties?.name||"Unknown";const x=m.get(String(raw).toLowerCase());if(x){if(l.getBounds&&l.getBounds().isValid())state.priorityBounds.extend(l.getBounds());l.bindPopup(`<div class="map-popup-title">${esc(translateProvince(x.name))}</div><div class="map-popup-text"><strong>${esc(t("priorityResponse"))}</strong><br>${esc(t("burnedSnapshot"))}: ${fmt(x.burned_area_snapshot_ha,2)} ha</div>`)}else{l.bindTooltip(esc(translateProvince(raw)),{sticky:true,className:"province-label"})}}}).addTo(state.map);
    fitMapToMode();
  }catch(e){
    console.warn(e);
    (d.priority_provinces||[]).forEach(x=>L.circle([x.lat,x.lng],{radius:95000,fillColor:"#ea580c",color:"#9a3412",fillOpacity:.25,weight:1}).bindPopup(`<div class="map-popup-title">${esc(translateProvince(x.name))}</div><div class="map-popup-text">${esc(t("priorityResponse"))}<br>${esc(t("burnedSnapshot"))}: ${fmt(x.burned_area_snapshot_ha,2)} ha</div>`).addTo(state.map));
  }
  setTimeout(()=>state.map?.invalidateSize(),120);
}
function fitMapToMode(){
  if(!state.map)return;
  if(state.priorityBounds&&state.priorityBounds.isValid()){
    state.map.fitBounds(state.priorityBounds,{padding:state.mobile?[14,14]:[24,24],maxZoom:state.mobile?4.55:5.45,animate:false});
    if(state.mobile && state.map.getZoom()>4.55)state.map.setZoom(4.55,{animate:false});
    return;
  }
  state.map.setView(state.mobile?[-1.5,110.5]:[-1.2,111],state.mobile?4.0:4.8,{animate:false});
}

function localSourceDescription(s){
  const d=String(s.description||"");
  if(state.lang==="en")return d;
  const map={
    "Keyword candidate did not meet the relevance threshold; fixed reference used.":"Kandidat dari pencarian keyword tidak memenuhi ambang relevansi; referensi tetap digunakan.",
    "Keyword-discovered reference validated by relevance score.":"Referensi hasil pencarian keyword tervalidasi berdasarkan skor relevansi.",
    "Reference candidate did not meet the relevance threshold; fixed reference used.":"Kandidat referensi tidak memenuhi ambang relevansi; referensi tetap digunakan.",
    "Latest operational snapshot and Karhutla coverage.":"Snapshot operasional terbaru dan cakupan karhutla.",
    "Current situation, hotspot activity and affected priority provinces.":"Situasi terkini, aktivitas hotspot, dan provinsi prioritas terdampak.",
    "Cumulative burned-area comparison across the six priority provinces.":"Perbandingan akumulasi luas terbakar di enam provinsi prioritas.",
    "Hotspot monitoring, weather conditions and Karhutla risk context.":"Pemantauan hotspot, kondisi cuaca, dan konteks risiko karhutla.",
    "El Niño conditions and elevated Karhutla risk.":"Kondisi El Niño dan peningkatan risiko karhutla.",
    "Kalimantan Tengah response and ground firefighting measures.":"Penanganan Kalimantan Tengah dan upaya pemadaman darat.",
    "Weather modification and OMC response activity in Kalimantan Barat.":"Modifikasi cuaca dan aktivitas penanganan OMC di Kalimantan Barat."
  };
  return map[d]||d;
}
function sourceTitle(s){
  const title=String(s.title||"");
  if(state.lang==="en")return title;
  const map={
    "BNPB — Dashboard Karhutla 2026":"BNPB — Dashboard Karhutla 2026",
    "BNPB — Situasi Terkini 6 Provinsi Prioritas":"BNPB — Situasi Terkini 6 Provinsi Prioritas",
    "BNPB — Cumulative Province Snapshot":"BNPB — Snapshot Kumulatif Provinsi",
    "BMKG — Karhutla & Hotspot Monitoring":"BMKG — Pemantauan Karhutla & Hotspot",
    "BMKG — El Niño & Karhutla Risk":"BMKG — Risiko El Niño & Karhutla",
    "BNPB — Kalimantan Tengah Evaluation":"BNPB — Evaluasi Kalimantan Tengah",
    "BMKG — OMC Kalimantan Barat":"BMKG — OMC Kalimantan Barat"
  };
  return map[title]||title;
}
function sourceBadge(title){
  const x=String(title||"").toLowerCase();
  if(x.includes("bmkg"))return"WEATHER";
  if(x.includes("bnpb"))return"DISASTER";
  return"FIRE & LAND";
}
function renderSources(d){
  const el=document.getElementById("sourceList");
  el.innerHTML=(d.sources||[]).map(s=>{
    const method=s.reference_type==="keyword_match"?t("validatedSource"):t("officialReference");
    const available=String(s.fetch_status||"").toUpperCase()==="OK";
    const status=available?t("sourceAvailable"):t("referenceRetained");
    const pending=available?"":" pending";
    const date=s.date||t("dateUnavailable");
    const score=s.relevance_score!=null?`${fmt(s.relevance_score,0)} / ${fmt(s.validation_threshold??s.validation_threshold??0,0)}`:"—";
    return `<a class="source-card" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">
      <div class="source-card-top"><span class="source-badge">${sourceBadge(s.title)}</span><span class="source-status${pending}"><span class="dot"></span>${esc(method)}</span></div>
      <h3>${esc(sourceTitle(s))}</h3>
      <p>${esc(localSourceDescription(s))}</p>
      <div class="source-meta">${esc(date)} · ${esc(t("sourceSelection"))}: ${esc(method)}</div>
      <div class="source-link">${esc(t("openSource"))}</div>
      <div class="source-url">${esc(s.url)}</div>
    </a>`
  }).join("");
}

function renderAll(d){
  renderKPIs(d);renderCharts(d);renderAir(d);renderSources(d);
  if(state.map){renderMap(d)}
}

async function init(){
  const r=await fetch("data/karhutla_2026.json",{cache:"no-store"});
  if(!r.ok)throw new Error("Could not load data JSON");
  state.data=await r.json();
  document.body.classList.toggle("mobile-mode",state.mobile);
  updateMobileToggleText();
  applyLang();
  renderKPIs(state.data);renderCharts(state.data);renderAir(state.data);renderSources(state.data);await renderMap(state.data);
}

document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll(".lang-button").forEach(b=>b.addEventListener("click",()=>{
    state.lang=b.dataset.lang;
    applyLang();
  }));
  document.getElementById("mobileToggle")?.addEventListener("click",()=>setMobileMode(!state.mobile));
  init().catch(e=>document.querySelector("main").insertAdjacentHTML("afterbegin",`<div class="error-box">${esc(e.message)}</div>`));
});
