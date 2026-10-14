/**
 * Module: eval_stats.js
 * Dedicated Real Visitor Statistics Dashboard view renderer using Chart.js & Supabase Database.
 * 100% REAL DATABASE DATA: Counts unique visitors based strictly on Supabase database entries.
 */

window.evalStatsBarChart = null;

window.renderEvalStatsView = async function (container) {
  if (!container) return;
  const reportingYear = Number(new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Bangkok",
    year: "numeric"
  }).format(new Date())) + 543;

  // Hide top page header banner on eval_stats page
  const headerBanner = document.getElementById("page-header-banner");
  if (headerBanner) {
    headerBanner.style.display = "none";
  }

  // Render initial loading / skeleton structure
  container.innerHTML = `
    <div class="w-full font-kanit pb-12">
      
      <!-- Top Banner Header -->
      <div class="relative bg-gradient-to-r from-[#1B3834] via-[#008675] to-[#0A4D45] text-white p-6 sm:p-8 rounded-xl shadow-md mb-8 overflow-hidden">
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl sm:text-2xl font-medium mb-1.5">รายงานสถิติผู้เข้าชมเว็บไซต์ </h2>
            <p class="text-teal-100 text-xs sm:text-sm font-normal opacity-90">
              ศูนย์ข้อมูลข่าวสารอิเล็กทรอนิกส์ของราชการ เทศบาลนครเจ้าพระยาสุรศักดิ์
            </p>
          </div>

          <button onclick="renderEvalStatsView(document.querySelector('.content-box'))" class="self-start md:self-auto px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-normal rounded-lg transition-all cursor-pointer inline-flex items-center gap-2 backdrop-blur-xs">
            <i class="fi fi-rr-refresh text-xs"></i>
            <span>อัปเดตข้อมูล</span>
          </button>
        </div>
      </div>

      <div id="visitor-summary-container" class="mb-8">
        <div class="h-[420px] animate-pulse rounded-2xl border border-gray-200 bg-white shadow-sm"></div>
      </div>

      <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,.06)]" aria-labelledby="visitor-monthly-heading">
          <div class="flex items-center gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
            <span class="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-gray-200 bg-slate-50 text-brand-teal">
              <i class="fi fi-rr-stats text-base"></i>
            </span>
            <div class="min-w-0">
              <h3 id="visitor-monthly-heading" class="text-sm sm:text-base font-semibold leading-snug text-gray-800">สถิติผู้เข้าชมย้อนหลังรายเดือน</h3>
              <p class="mt-0.5 text-xs text-gray-500">จำนวนรายการเข้าชมที่บันทึกในแต่ละเดือนของปี ${reportingYear.toLocaleString("th-TH")}</p>
            </div>
          </div>
          <div class="mx-5 mt-4 border-t border-gray-100 sm:mx-6"></div>
          <div class="relative h-64 w-full px-4 py-4 sm:h-72 sm:px-6 sm:py-5">
            <canvas id="chart-visitor-monthly"></canvas>
          </div>
      </section>

    </div>
  `;

  // Fetch real visitor data from Supabase
  await recordAndLoadRealVisitorStats();
};

async function recordAndLoadRealVisitorStats() {
  if (window.visitorCounterPromise) {
    await window.visitorCounterPromise;
  }

  const sb = (typeof window !== "undefined" && window.supabase && typeof window.supabase.from === "function") ? window.supabase : (typeof supabase !== "undefined" ? supabase : null);
  const dateParts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  const dateValue = type => dateParts.find(part => part.type === type)?.value || "";
  const todayKey = `${dateValue("year")}-${dateValue("month")}-${dateValue("day")}`;
  const monthKey = todayKey.substring(0, 7); // YYYY-MM

  // Fetch ALL real visitor log records from Supabase
  let logs = [];
  let totalVisitorCount = null;
  try {
    if (sb) {
      const [logsRes, totalRes] = await Promise.all([
        loadAllVisitorLogs(sb),
        sb.from("visitor_stats").select("total_count").eq("key", "site_total").maybeSingle()
      ]);

      logs = logsRes;
      if (!totalRes.error && totalRes.data) {
        const parsedTotal = parseInt(totalRes.data.total_count, 10);
        if (Number.isFinite(parsedTotal) && parsedTotal > 0) {
          totalVisitorCount = parsedTotal;
        }
      } else if (totalRes.error) {
        console.warn("Unable to load lifetime visitor count; using visitor log count:", totalRes.error);
      }
    }
  } catch (err) {
    console.error("Error loading visitor logs:", err);
    const summaryContainer = document.getElementById("visitor-summary-container");
    if (summaryContainer) {
      summaryContainer.innerHTML = `
        <div role="alert" class="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
          โหลดข้อมูลสถิติผู้เข้าชมไม่สำเร็จ กรุณาลองใหม่อีกครั้ง
        </div>
      `;
    }
    return;
  }

  // Calculate Real Statistics from Database
  // Keep the site-wide lifetime counter separate from this year's log total.
  const totalCount = totalVisitorCount || logs.length;
  let todayCount = 0;
  let monthCount = 0;

  let mobileCount = 0;
  let desktopCount = 0;
  let tabletCount = 0;

  // 12-Month Bar Chart Array
  const currentYear = Number(todayKey.slice(0, 4));
  const monthlyCounts = new Array(12).fill(0);

  logs.forEach(log => {
    const dtStr = log.created_at || "";
    const datePart = log.visit_date || (dtStr ? dtStr.split('T')[0] : "");
    const dev = log.device_type || "Desktop";

    // Today & Month check
    if (datePart === todayKey) todayCount++;
    if (datePart.startsWith(monthKey)) monthCount++;

    // Device check
    if (dev === "Mobile") mobileCount++;
    else if (dev === "Tablet") tabletCount++;
    else desktopCount++;

    // Monthly check
    const [visitYear, visitMonth] = datePart.split("-").map(Number);
    if (visitYear === currentYear && visitMonth >= 1 && visitMonth <= 12) {
      monthlyCounts[visitMonth - 1]++;
    }
  });

  const yearCount = monthlyCounts.reduce((sum, count) => sum + count, 0);
  renderVisitorSummary(
    document.getElementById("visitor-summary-container"),
    yearCount,
    currentYear + 543,
    totalCount,
    todayCount,
    monthCount,
    mobileCount,
    desktopCount,
    tabletCount
  );

  // Update Footer Count with Real Count
  const footerTotal = document.getElementById("visitor-total");
  if (footerTotal) {
    footerTotal.textContent = totalCount.toLocaleString("th-TH");
  }

  // Render Charts with Real Database Data
  renderRealCharts(monthlyCounts);
}

async function loadAllVisitorLogs(sb) {
  const pageSize = 1000;
  const logs = [];

  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await sb
      .from("visitor_logs")
      .select("id, device_type, visit_date, created_at")
      .order("id", { ascending: true })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;
    if (!Array.isArray(data)) throw new Error("Visitor log query returned an invalid response");
    const page = data;
    logs.push(...page);
    if (page.length < pageSize) return logs;
  }
}

function renderVisitorSummary(container, yearCount, reportingYear, totalCount, todayCount, monthCount, mobile, desktop, tablet) {
  if (!container) return;

  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
  const devices = [
    { id: "Mobile", name: "มือถือ", color: "#008675", side: "#07584f", count: mobile },
    { id: "Desktop", name: "คอมพิวเตอร์", color: "#0284c7", side: "#07527a", count: desktop },
    { id: "Tablet", name: "แท็บเล็ต", color: "#f59e0b", side: "#a85b09", count: tablet }
  ].map(device => ({
    ...device,
    percent: mobile + desktop + tablet > 0
      ? Math.round(device.count / (mobile + desktop + tablet) * 100)
      : 0
  }));
  const deviceTotal = mobile + desktop + tablet;
  const selected = devices.find(device => device.id === window.selectedVisitorDevice) || devices[0];
  window.selectedVisitorDevice = selected.id;
  const topDevice = devices.reduce((top, device) => device.count > top.count ? device : top, devices[0]);
  const distribution = devices.map(device =>
    `<span style="width:${deviceTotal ? device.count / deviceTotal * 100 : 0}%;background:${device.color}" title="${escapeHtml(device.name)} ${device.percent}%"></span>`
  ).join("");

  const width = 640;
  const height = 230;
  const maximum = Math.max(1, ...devices.map(device => device.count));
  const project = (x, y, z = 0) => [(x - y) * 0.86, (x + y) * 0.43 - z];
  const pointList = points => points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const blocks = devices.map((device, index) => {
    const x = index * 1.55;
    const side = 1.05;
    const z = device.count ? Math.max(0.12, device.count / maximum * 1.12) : 0.04;
    return {
      ...device,
      depth: x,
      base: [project(x, 0), project(x + side, 0), project(x + side, side), project(x, side)],
      roof: [project(x, 0, z), project(x + side, 0, z), project(x + side, side, z), project(x, side, z)]
    };
  });
  const ground = [project(-0.35, -0.35), project(4.55, -0.35), project(4.55, 1.35), project(-0.35, 1.35)];
  const vertices = [...ground, ...blocks.flatMap(block => [...block.base, ...block.roof])];
  const minX = Math.min(...vertices.map(point => point[0]));
  const maxX = Math.max(...vertices.map(point => point[0]));
  const minY = Math.min(...vertices.map(point => point[1]));
  const maxY = Math.max(...vertices.map(point => point[1]));
  const scale = Math.min((width - 96) / (maxX - minX), (height - 30) / (maxY - minY));
  const fit = ([x, y]) => [
    (x - minX) * scale + (width - (maxX - minX) * scale) / 2,
    (y - minY) * scale + (height - (maxY - minY) * scale) / 2
  ];
  const blocksSvg = blocks.sort((a, b) => a.depth - b.depth).map((block, index) => {
    const base = block.base.map(fit);
    const roof = block.roof.map(fit);
    const centerX = roof.reduce((sum, point) => sum + point[0], 0) / 4;
    const centerY = roof.reduce((sum, point) => sum + point[1], 0) / 4;
    const isSelected = selected.id === block.id;
    return `
      <g class="visitor-block${isSelected ? " is-selected" : ""}" data-device="${block.id}" role="button" tabindex="0"
         aria-label="${escapeHtml(block.name)}: ${block.count.toLocaleString()} คน, ${block.percent}%"
         aria-pressed="${isSelected}" style="--visitor-color:${block.color};--visitor-side:${block.side}">
        <polygon class="visitor-block-left" points="${pointList([roof[3], roof[2], base[2], base[3]])}"></polygon>
        <polygon class="visitor-block-right" points="${pointList([roof[1], roof[2], base[2], base[1]])}"></polygon>
        <polygon class="visitor-block-roof" points="${pointList(roof)}"></polygon>
        <text x="${centerX.toFixed(1)}" y="${(centerY + 4).toFixed(1)}" text-anchor="middle">${index + 1}</text>
      </g>`;
  }).join("");

  container.innerHTML = `
    <style>
      .visitor-district{--vd-border:#e5e7eb;--vd-muted:#737373;--vd-ink:#17201f;--vd-surface:#fff;--vd-subtle:#f8faf9;--vd-ground:#f1f5f4;width:100%;color:var(--vd-ink);background:var(--vd-surface);border:1px solid var(--vd-border);border-radius:16px;box-shadow:0 4px 20px rgba(15,23,42,.06);overflow:hidden;font-size:13px}
      .visitor-district *{box-sizing:border-box}
      .vd-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:23px 24px 16px}
      .vd-stat{display:flex;flex-direction:column;min-width:0}
      .vd-stat+.vd-stat{padding-left:18px;border-left:1px solid var(--vd-border)}
      .vd-stat span{color:var(--vd-muted);font-size:11px}
      .vd-stat strong{margin-top:3px;font-size:22px;font-weight:600;line-height:1.35;font-variant-numeric:tabular-nums}
      .vd-stat small{margin-top:2px;color:var(--vd-muted);font-size:11px}
      .vd-capacity{display:flex;align-items:center;gap:11px;margin:0 24px 17px}
      .vd-meter{display:flex;flex:1;height:6px;overflow:hidden;border-radius:9px;background:var(--vd-ground)}
      .vd-meter span{height:100%;transition:width .25s ease}
      .vd-capacity-label{color:var(--vd-muted);font-size:11px;white-space:nowrap}
      .vd-browser{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 24px 7px;padding-top:13px;border-top:1px solid var(--vd-border)}
      .vd-breadcrumb{display:flex;align-items:center;gap:7px;min-width:0;color:var(--vd-muted);font-size:11px}
      .vd-breadcrumb strong{color:var(--vd-ink);font-weight:500}
      .vd-plot{position:relative;margin:0 12px}
      .vd-chart{display:block;width:100%;height:230px;user-select:none}
      .vd-ground{fill:var(--vd-ground)}
      .visitor-block{cursor:pointer;outline:none;transition:filter .16s ease,transform .16s ease}
      .visitor-block polygon{stroke:rgba(255,255,255,.7);stroke-width:1}
      .visitor-block-roof{fill:var(--visitor-color)}
      .visitor-block-left,.visitor-block-right{fill:var(--visitor-side)}
      .visitor-block-right{filter:brightness(.88)}
      .visitor-block text{fill:#fff;font:600 12px sans-serif;pointer-events:none}
      .visitor-block:hover,.visitor-block:focus-visible,.visitor-block.is-selected{filter:brightness(1.1) drop-shadow(0 5px 5px rgba(15,23,42,.18))}
      .vd-caption{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin:0 24px 14px;color:var(--vd-muted);font-size:11px}
      .vd-legend{display:flex;flex-wrap:wrap;gap:12px}
      .vd-legend span{display:inline-flex;align-items:center;gap:5px}
      .vd-dot{width:8px;height:8px;border-radius:50%}
      .vd-inspector{padding:14px 24px 15px;border-top:1px solid var(--vd-border);background:var(--vd-subtle)}
      .vd-selected-summary{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;color:var(--vd-muted);font-size:11px}
      .vd-selected-summary strong{color:var(--vd-ink);font-size:13px;font-weight:600}
      @media(max-width:560px){.vd-stats{gap:7px;margin:19px 16px 14px}.vd-stat+.vd-stat{padding-left:9px}.vd-stat strong{font-size:18px}.vd-stat span,.vd-stat small{font-size:10px}.vd-capacity{margin:0 16px 14px}.vd-browser{margin-inline:16px}.vd-plot{margin-inline:2px}.vd-chart{height:190px}.vd-caption{margin-inline:16px}.vd-inspector{padding-inline:16px}}
      @media(prefers-reduced-motion:reduce){.visitor-district *{scroll-behavior:auto!important;transition:none!important}}
    </style>
    <section class="visitor-district" aria-label="สรุปสถิติผู้เข้าชมเว็บไซต์">
      <div class="vd-stats">
        <div class="vd-stat"><span>ผู้เข้าชมปี ${reportingYear.toLocaleString("th-TH")}</span><strong>${yearCount.toLocaleString()}</strong><small>คน · ยอดสะสมเว็บ ${totalCount.toLocaleString()} คน</small></div>
        <div class="vd-stat"><span>ผู้เข้าชมวันนี้</span><strong>${todayCount.toLocaleString()}</strong><small>คน</small></div>
        <div class="vd-stat"><span>อุปกรณ์ที่ใช้มากที่สุด</span><strong>${escapeHtml(topDevice.name)}</strong><small>${topDevice.count.toLocaleString()} คน · ${topDevice.percent}%</small></div>
      </div>
      <div class="vd-capacity" aria-label="สัดส่วนผู้เข้าชมตามอุปกรณ์">
        <div class="vd-meter">${distribution}</div>
        <span class="vd-capacity-label">${deviceTotal.toLocaleString()} รายการ</span>
      </div>
      <div class="vd-browser"><div class="vd-breadcrumb"><span>สถิติผู้เข้าชม</span><span aria-hidden="true">›</span><strong>อุปกรณ์ที่ใช้</strong></div><span class="vd-capacity-label">${monthCount.toLocaleString()} คนในเดือนนี้</span></div>
      <div class="vd-plot">
        <svg class="vd-chart" viewBox="0 0 ${width} ${height}" role="group" aria-label="กราฟสามมิติแสดงจำนวนผู้เข้าชมตามอุปกรณ์">
          <polygon class="vd-ground" points="${pointList(ground.map(fit))}"></polygon>${blocksSvg}
        </svg>
      </div>
      <div class="vd-caption">
        <div class="vd-legend">${devices.map(device => `<span><i class="vd-dot" style="background:${device.color}"></i>${escapeHtml(device.name)} (${device.percent}%)</span>`).join("")}</div>
        <span>เลือกแท่งกราฟเพื่อดูรายละเอียด</span>
      </div>
      <div class="vd-inspector" aria-live="polite" aria-atomic="true">
        <div class="vd-selected-summary"><span><strong>${escapeHtml(selected.name)}</strong></span><span>${selected.percent}% ของผู้เข้าชมที่ระบุอุปกรณ์</span></div>
        <div class="vd-selected-summary"><span>${selected.count.toLocaleString()} คน</span><span>จาก ${deviceTotal.toLocaleString()} รายการ</span></div>
      </div>
    </section>
  `;

  container.querySelectorAll(".visitor-block").forEach(block => {
    const selectDevice = () => {
      window.selectedVisitorDevice = block.dataset.device;
      renderVisitorSummary(container, yearCount, reportingYear, totalCount, todayCount, monthCount, mobile, desktop, tablet);
    };
    block.addEventListener("click", selectDevice);
    block.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectDevice();
      }
    });
  });
}

function renderRealCharts(monthlyCounts) {
  if (typeof Chart === "undefined") return;

  if (window.evalStatsBarChart) window.evalStatsBarChart.destroy();

  const ctxMonthly = document.getElementById("chart-visitor-monthly");

  // Monthly Bar Chart
  if (ctxMonthly) {
    window.evalStatsBarChart = new Chart(ctxMonthly, {
      type: "bar",
      data: {
        labels: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
        datasets: [{
          label: "ผู้เข้าชม (คน)",
          data: monthlyCounts,
          backgroundColor: "#0284C7",
          borderRadius: 6,
          barThickness: 24
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0, font: { family: "Kanit" } },
            grid: { color: "#F1F5F9" }
          },
          x: {
            ticks: { font: { family: "Kanit" } },
            grid: { display: false }
          }
        }
      }
    });
  }
}
