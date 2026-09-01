/**
 * Module: eval_stats.js
 * Dedicated Real Visitor Statistics Dashboard view renderer using Chart.js & Supabase Database.
 * 100% REAL DATABASE DATA: Counts unique visitors based strictly on Supabase database entries.
 */

window.evalStatsLineChart = null;
window.evalStatsBarChart = null;
window.evalStatsDeviceChart = null;

window.renderEvalStatsView = async function (container) {
  if (!container) return;

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
            <span>รีเฟรชข้อมูลจริง</span>
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards (4 Columns - Silpakorn Card Layout) -->
      <div id="stats-kpi-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs animate-pulse h-28"></div>
        <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs animate-pulse h-28"></div>
        <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs animate-pulse h-28"></div>
        <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs animate-pulse h-28"></div>
      </div>

      <!-- Charts Section (2 Columns) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        <!-- Chart 1: Line Chart (แนวโน้มผู้เข้าชม 7 วันล่าสุด - 2 Columns wide) -->
        <div class="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200/90 shadow-2xs flex flex-col justify-between">
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-5 bg-[#008675] rounded-full inline-block"></span>
              <h3 class="font-medium text-sm sm:text-base text-gray-800">ผู้เข้าชมเว็บไซต์</h3>
            </div>
            <span class="text-xs text-gray-400 font-normal">Line Chart (7 วันล่าสุด)</span>
          </div>

          <div class="relative w-full h-64 sm:h-72 mx-auto">
            <canvas id="chart-visitor-line"></canvas>
          </div>
        </div>

        <!-- Chart 2: Doughnut Chart (สัดส่วนอุปกรณ์ผู้ใช้งาน) -->
        <div class="bg-white p-6 rounded-xl border border-gray-200/90 shadow-2xs flex flex-col justify-between">
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-5 bg-sky-600 rounded-full inline-block"></span>
              <h3 class="font-medium text-sm sm:text-base text-gray-800">สัดส่วนอุปกรณ์ผู้ใช้บริการจริง</h3>
            </div>
            <span class="text-xs text-gray-400 font-normal">Device Distribution</span>
          </div>

          <div class="relative w-full aspect-square max-h-60 mx-auto flex items-center justify-center">
            <canvas id="chart-visitor-device"></canvas>
          </div>

          <div id="stats-device-legend" class="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 text-center text-xs">
            <!-- Populated Dynamically from Real Supabase Logs -->
          </div>
        </div>

      </div>

      <!-- Chart 3: Monthly Comparison Bar Chart -->
      <div class="bg-white p-6 sm:p-8 rounded-xl border border-gray-200/90 shadow-2xs">
        <div class="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
          <div class="flex items-center gap-2">
            <i class="fi fi-rr-stats text-brand-teal text-lg"></i>
            <h3 class="font-medium text-sm sm:text-base text-gray-800">สถิติผู้เข้าชมเว็บไซต์ย้อนหลังรายเดือน (ปี 2569)</h3>
          </div>
          <span class="text-xs text-gray-400 font-normal">Bar Chart</span>
        </div>

        <div class="relative w-full h-64 sm:h-72">
          <canvas id="chart-visitor-monthly"></canvas>
        </div>
      </div>

    </div>
  `;

  // Log current visit & fetch real data from Supabase
  await recordAndLoadRealVisitorStats();
};

async function recordAndLoadRealVisitorStats() {
  const sb = (typeof window !== "undefined" && window.supabase && typeof window.supabase.from === "function") ? window.supabase : (typeof supabase !== "undefined" ? supabase : null);
  
  const todayKey = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const monthKey = todayKey.substring(0, 7); // YYYY-MM

  // Detect Device Type
  const ua = navigator.userAgent || "";
  let deviceType = "Desktop";
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) deviceType = "Mobile";
  else if (/Tablet|iPad/i.test(ua)) deviceType = "Tablet";

  // Check unique visit session token
  const isNewSession = !sessionStorage.getItem("ico_unique_visitor_logged");

  if (isNewSession && sb) {
    sessionStorage.setItem("ico_unique_visitor_logged", "true");
    
    // Insert real visitor log into Supabase 'evaluations' table with category 'visitor_log'
    try {
      await sb.from("evaluations").insert([{
        category: "visitor_log",
        satisfaction_level: 0,
        level_label: deviceType,
        improvement_suggestion: ua.substring(0, 200),
        comments: todayKey,
        created_at: new Date().toISOString()
      }]);
    } catch (e) {
      console.warn("Visitor log insert error:", e);
    }
  }

  // Fetch ALL real visitor log records from Supabase
  let logs = [];
  try {
    if (sb) {
      const res = await sb.from("evaluations").select("*").eq("category", "visitor_log").order("created_at", { ascending: false });
      if (!res.error && res.data) {
        logs = res.data;
      }
    }
  } catch (err) {
    console.error("Error loading visitor logs:", err);
  }

  // Calculate Real Statistics from Database
  const totalCount = logs.length;
  let todayCount = 0;
  let monthCount = 0;

  let mobileCount = 0;
  let desktopCount = 0;
  let tabletCount = 0;

  // 7-Day Line Chart Map (Date -> Count)
  const last7DaysMap = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    last7DaysMap[key] = 0;
  }

  // 12-Month Bar Chart Array
  const currentYear = new Date().getFullYear();
  const monthlyCounts = new Array(12).fill(0);

  logs.forEach(log => {
    const dtStr = log.created_at || "";
    const datePart = log.comments || (dtStr ? dtStr.split('T')[0] : "");
    const dev = log.level_label || "Desktop";

    // Today & Month check
    if (datePart === todayKey) todayCount++;
    if (datePart.startsWith(monthKey)) monthCount++;

    // Device check
    if (dev === "Mobile") mobileCount++;
    else if (dev === "Tablet") tabletCount++;
    else desktopCount++;

    // 7-day map check
    if (last7DaysMap.hasOwnProperty(datePart)) {
      last7DaysMap[datePart]++;
    }

    // Monthly check
    if (dtStr) {
      const logDate = new Date(dtStr);
      if (logDate.getFullYear() === currentYear) {
        const mIdx = logDate.getMonth(); // 0-11
        if (mIdx >= 0 && mIdx < 12) monthlyCounts[mIdx]++;
      }
    }
  });

  // Render KPI Cards (Silpakorn Card Style with Top-Left Curve)
  const kpiContainer = document.getElementById("stats-kpi-container");
  if (kpiContainer) {
    kpiContainer.innerHTML = `
      <!-- Card 1: Filled Dark Teal Card with Curved Corner -->
      <div class="bg-[#008675] text-white p-6 rounded-tl-[32px] rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-lg shadow-[#008675]/20 flex flex-col justify-between min-h-[170px] transition-transform ">
        <div>
          <i class="fi fi-rr-eye text-3xl text-emerald-300 mb-3 block"></i>
          <div class="text-sm font-normal text-teal-100/90 mb-1">ผู้เข้าชมทั้งหมด</div>
          <div class="text-3xl sm:text-4xl font-bold tracking-tight text-white">${totalCount.toLocaleString()}</div>
        </div>
        <div class="text-xs text-emerald-200/90 font-normal mt-2">คน </div>
      </div>

      <!-- Card 2: White Card with Dark Teal Icon & Top-Left Curve -->
      <div class="bg-white p-6 rounded-tl-[32px] rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-md shadow-gray-200/60 border border-gray-100 flex flex-col justify-between min-h-[170px] transition-transform hover:-translate-y-1">
        <div>
          <i class="fi fi-rr-calendar text-3xl text-[#008675] mb-3 block"></i>
          <div class="text-sm font-normal text-gray-600 mb-1">ผู้เข้าชมวันนี้</div>
          <div class="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">${todayCount.toLocaleString()}</div>
        </div>
        <div class="text-xs text-gray-400 font-normal mt-2">คน</div>
      </div>

      <!-- Card 3: White Card with Dark Teal Icon & Top-Left Curve -->
      <div class="bg-white p-6 rounded-tl-[32px] rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-md shadow-gray-200/60 border border-gray-100 flex flex-col justify-between min-h-[170px] transition-transform hover:-translate-y-1">
        <div>
          <i class="fi fi-rr-stats text-3xl text-[#008675] mb-3 block"></i>
          <div class="text-sm font-normal text-gray-600 mb-1">ผู้เข้าชมเดือนนี้</div>
          <div class="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">${monthCount.toLocaleString()}</div>
        </div>
        <div class="text-xs text-gray-400 font-normal mt-2">คน</div>
      </div>

      <!-- Card 4: White Card with Dark Teal Icon & Top-Left Curve -->
      <div class="bg-white p-6 rounded-tl-[32px] rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-md shadow-gray-200/60 border border-gray-100 flex flex-col justify-between min-h-[170px] transition-transform hover:-translate-y-1">
        <div>
          <i class="fi fi-rr-document text-3xl text-[#008675] mb-3 block"></i>
          <div class="text-sm font-normal text-gray-600 mb-1">บันทึกสถิติรวม</div>
          <div class="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">${totalCount.toLocaleString()}</div>
        </div>
        <div class="text-xs text-gray-400 font-normal mt-2">รายการ</div>
      </div>
    `;
  }

  // Update Footer Count with Real Count
  const footerTotal = document.getElementById("visitor-total");
  if (footerTotal && totalCount > 0) {
    footerTotal.textContent = totalCount.toLocaleString("th-TH");
  }

  // Render Charts with Real Database Data
  renderRealCharts(last7DaysMap, mobileCount, desktopCount, tabletCount, monthlyCounts);
}

function renderRealCharts(last7DaysMap, mobile, desktop, tablet, monthlyCounts) {
  if (typeof Chart === "undefined") return;

  if (window.evalStatsLineChart) window.evalStatsLineChart.destroy();
  if (window.evalStatsBarChart) window.evalStatsBarChart.destroy();
  if (window.evalStatsDeviceChart) window.evalStatsDeviceChart.destroy();

  const ctxLine = document.getElementById("chart-visitor-line");
  const ctxDevice = document.getElementById("chart-visitor-device");
  const ctxMonthly = document.getElementById("chart-visitor-monthly");

  // 1. Line Chart Data
  const lineLabels = Object.keys(last7DaysMap).map(k => {
    const parts = k.split('-');
    return `${parseInt(parts[2], 10)}/${parseInt(parts[1], 10)}`;
  });
  const lineValues = Object.values(last7DaysMap);

  if (ctxLine) {
    window.evalStatsLineChart = new Chart(ctxLine, {
      type: "line",
      data: {
        labels: lineLabels,
        datasets: [{
          label: "ผู้เข้าชมจริง (คน)",
          data: lineValues,
          borderColor: "#008675",
          backgroundColor: "rgba(0, 134, 117, 0.08)",
          fill: true,
          tension: 0.35,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: "#008675",
          pointBorderColor: "#FFFFFF",
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ผู้เข้าชมจริง: ${ctx.raw} คน`
            }
          }
        },
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

  // 2. Device Chart
  const totalDev = mobile + desktop + tablet;
  const mobPct = totalDev > 0 ? Math.round((mobile / totalDev) * 100) : 0;
  const deskPct = totalDev > 0 ? Math.round((desktop / totalDev) * 100) : 0;
  const tabPct = totalDev > 0 ? Math.round((tablet / totalDev) * 100) : 0;

  if (ctxDevice) {
    window.evalStatsDeviceChart = new Chart(ctxDevice, {
      type: "doughnut",
      data: {
        labels: ["สมาร์ตโฟน (Mobile)", "คอมพิวเตอร์ (Desktop)", "แท็บเล็ต (Tablet)"],
        datasets: [{
          data: [mobile, desktop, tablet],
          backgroundColor: ["#008675", "#0284C7", "#F59E0B"],
          borderWidth: 2,
          borderColor: "#FFFFFF"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        cutout: "65%"
      }
    });

    const legendEl = document.getElementById("stats-device-legend");
    if (legendEl) {
      legendEl.innerHTML = `
        <div class="flex flex-col items-center">
          <span class="w-2.5 h-2.5 rounded-full bg-[#008675] mb-1"></span>
          <span class="text-gray-700 font-normal">มือถือ (${mobPct}%)</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="w-2.5 h-2.5 rounded-full bg-[#0284C7] mb-1"></span>
          <span class="text-gray-700 font-normal">คอมพิวเตอร์ (${deskPct}%)</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="w-2.5 h-2.5 rounded-full bg-[#F59E0B] mb-1"></span>
          <span class="text-gray-700 font-normal">แท็บเล็ต (${tabPct}%)</span>
        </div>
      `;
    }
  }

  // 3. Monthly Bar Chart
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
