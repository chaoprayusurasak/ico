/**
 * Module: eval_summary.js
 * Dedicated Satisfaction Summary & Analytics Dashboard view renderer using Chart.js & Supabase data.
 */

window.evalDoughnutChart = null;
window.evalBarChart = null;

window.renderEvalSummaryView = async function (container) {
  if (!container) return;

  // Hide top page header banner on eval_summary page
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
            <h2 class="text-xl sm:text-2xl font-medium mb-1.5">รายงานสถิติและผลสรุปความพึงพอใจ</h2>
            <p class="text-teal-100 text-xs sm:text-sm font-normal opacity-90">
              ศูนย์ข้อมูลข่าวสารอิเล็กทรอนิกส์ของราชการ เทศบาลนครเจ้าพระยาสุรศักดิ์
            </p>
          </div>

          <button onclick="renderEvalSummaryView(document.querySelector('.content-box'))" class="self-start md:self-auto px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-normal rounded-lg transition-all cursor-pointer inline-flex items-center gap-2 backdrop-blur-xs">
            <i class="fi fi-rr-refresh text-xs"></i>
            <span>อัปเดตข้อมูล</span>
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards Skeleton / Container -->
      <div id="eval-kpi-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs animate-pulse h-28"></div>
        <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs animate-pulse h-28"></div>
        <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs animate-pulse h-28"></div>
        <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs animate-pulse h-28"></div>
      </div>

      <!-- Charts Section (2 Columns) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        <!-- Chart 1: Doughnut Chart (สัดส่วนระดับความพึงพอใจ) -->
        <div class="bg-white p-6 rounded-xl border border-gray-200/90 shadow-2xs flex flex-col justify-between">
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-5 bg-[#008675] rounded-full inline-block"></span>
              <h3 class="font-medium text-sm sm:text-base text-gray-800">สัดส่วนระดับความพึงพอใจรวม</h3>
            </div>
          </div>

          <div class="relative w-full aspect-square max-h-72 mx-auto flex items-center justify-center py-2">
            <canvas id="chart-satisfaction-doughnut"></canvas>
          </div>

          <div id="doughnut-legend" class="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 text-center text-xs">
            <!-- Legend Populated Dynamically -->
          </div>
        </div>

        <!-- Chart 2: Bar Chart (จำนวนผู้ตอบในแต่ละระดับ) -->
        <div class="bg-white p-6 rounded-xl border border-gray-200/90 shadow-2xs flex flex-col justify-between">
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-5 bg-sky-600 rounded-full inline-block"></span>
              <h3 class="font-medium text-sm sm:text-base text-gray-800">จำนวนผู้ประเมิน</h3>
            </div>
          </div>

          <div class="relative w-full h-64 sm:h-72 mx-auto flex items-center justify-center">
            <canvas id="chart-satisfaction-bar"></canvas>
          </div>

          <div class="pt-4 border-t border-gray-100 text-xs text-gray-500 font-normal text-center">
            สถิติผู้ใช้บริการทั้งหมด
          </div>
        </div>

      </div>

      <!-- Citizens Comments & Feedback Table List -->
      <div class="py-2">
        <div class="flex items-center justify-between mb-5 pb-3">
          <div class="flex items-center gap-2">
            <i class="fi fi-rr-comment-alt text-brand-teal text-lg"></i>
            <h3 class="font-medium text-sm sm:text-base text-gray-800">ข้อเสนอแนะและข้อแนะนำจากผู้ใช้บริการ</h3>
          </div>
          <span id="feedback-count-badge" class="text-xs bg-teal-50 text-[#008675] px-2.5 py-1 rounded-full font-medium">0 รายการ</span>
        </div>

        <div id="eval-comments-list" class="space-y-3">
          <div class="text-center py-10 text-gray-400 text-xs font-normal">กำลังดึงรายการข้อคิดเห็น...</div>
        </div>
      </div>

    </div>
  `;

  // Fetch Data from Supabase & Render Charts
  await loadAndRenderEvalSummaryData();
};

async function loadAndRenderEvalSummaryData() {
  const sb = (typeof window !== "undefined" && window.supabase && typeof window.supabase.from === "function") ? window.supabase : (typeof supabase !== "undefined" ? supabase : null);

  let rawEvaluations = [];

  try {
    if (!sb) throw new Error("Supabase client is not initialized");
    const { data, error } = await sb
      .from("evaluations")
      .select("*")
      .eq("category", "evaluations")
      .order("created_at", { ascending: false });
    if (error) throw error;
    rawEvaluations = data || [];
  } catch (err) {
    console.error("Error fetching evaluations data:", err);
  }

  // Filter ONLY real evaluation submissions (category = evaluations and satisfaction_level > 0)
  rawEvaluations = (rawEvaluations || []).filter(item => item && item.category === "evaluations" && parseInt(item.satisfaction_level, 10) > 0);

  // Calculate Aggregates
  const totalCount = rawEvaluations.length;
  let countLevel1 = 0; // พึงพอใจมาก
  let countLevel2 = 0; // พึงพอใจ
  let countLevel3 = 0; // ควรปรับปรุง

  rawEvaluations.forEach(item => {
    const lvl = parseInt(item.satisfaction_level || item.level || 1, 10);
    if (lvl === 1) countLevel1++;
    else if (lvl === 2) countLevel2++;
    else if (lvl === 3) countLevel3++;
    else countLevel1++;
  });

  const percentLevel1 = totalCount > 0 ? Math.round((countLevel1 / totalCount) * 100) : 0;
  const percentLevel2 = totalCount > 0 ? Math.round((countLevel2 / totalCount) * 100) : 0;
  const percentLevel3 = totalCount > 0 ? Math.round((countLevel3 / totalCount) * 100) : 0;

  // Average score out of 3 or converted to 100%
  const overallSatisfactionPercent = totalCount > 0 ? Math.round(((countLevel1 * 1.0 + countLevel2 * 0.75 + countLevel3 * 0.3) / totalCount) * 100) : 100;

  // 1. Render KPI Cards (Silpakorn Card Style with Top-Left Curve)
  const kpiContainer = document.getElementById("eval-kpi-container");
  if (kpiContainer) {
    kpiContainer.innerHTML = `
      <!-- Card 1: Filled Dark Teal Card with Curved Corner -->
      <div class="bg-[#008675] text-white p-6 rounded-tl-[32px] rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-lg shadow-[#008675]/20 flex flex-col justify-between min-h-[170px] transition-transform hover:-translate-y-1">
        <div>
          <i class="fi fi-rr-users text-3xl text-emerald-300 mb-3 block"></i>
          <div class="text-sm font-normal text-teal-100/90 mb-1">ผู้ตอบแบบประเมินทั้งหมด</div>
          <div class="text-3xl sm:text-4xl font-bold tracking-tight text-white">${totalCount.toLocaleString()}</div>
        </div>
        <div class="text-xs text-emerald-200/90 font-normal mt-2">ท่าน</div>
      </div>

      <!-- Card 2: White Card with Dark Teal Icon & Top-Left Curve -->
      <div class="bg-white p-6 rounded-tl-[32px] rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-md shadow-gray-200/60 border border-gray-100 flex flex-col justify-between min-h-[170px] transition-transform hover:-translate-y-1">
        <div>
          <i class="fi fi-rr-smile text-3xl text-[#008675] mb-3 block"></i>
          <div class="text-sm font-normal text-gray-600 mb-1">อัตราความพึงพอใจรวม</div>
          <div class="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">${overallSatisfactionPercent}%</div>
        </div>
        <div class="text-xs text-gray-400 font-normal mt-2">ภาพรวมสถิติ</div>
      </div>

      <!-- Card 3: White Card with Dark Teal Icon & Top-Left Curve -->
      <div class="bg-white p-6 rounded-tl-[32px] rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-md shadow-gray-200/60 border border-gray-100 flex flex-col justify-between min-h-[170px] transition-transform hover:-translate-y-1">
        <div>
          <span class="text-3xl mb-3 block">😍</span>
          <div class="text-sm font-normal text-gray-600 mb-1">พึงพอใจมาก (ระดับ 1)</div>
          <div class="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">${countLevel1} <span class="text-xs font-normal text-emerald-600">(${percentLevel1}%)</span></div>
        </div>
        <div class="text-xs text-gray-400 font-normal mt-2">ท่าน</div>
      </div>

      <!-- Card 4: White Card with Dark Teal Icon & Top-Left Curve -->
      <div class="bg-white p-6 rounded-tl-[32px] rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-md shadow-gray-200/60 border border-gray-100 flex flex-col justify-between min-h-[170px] transition-transform hover:-translate-y-1">
        <div>
          <span class="text-3xl mb-3 block">🙁</span>
          <div class="text-sm font-normal text-gray-600 mb-1">ควรปรับปรุง (ระดับ 3)</div>
          <div class="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">${countLevel3} <span class="text-xs font-normal text-amber-600">(${percentLevel3}%)</span></div>
        </div>
        <div class="text-xs text-gray-400 font-normal mt-2">ท่าน</div>
      </div>
    `;
  }

  // 2. Render Chart.js Visualizations
  renderChartJsVisualizations(countLevel1, countLevel2, countLevel3);

  // 3. Render Comments List
  renderCommentsList(rawEvaluations);
}

function renderChartJsVisualizations(c1, c2, c3) {
  if (typeof Chart === "undefined") {
    console.warn("Chart.js library is not loaded yet.");
    return;
  }

  // Destroy previous chart instances to prevent memory leaks or duplicate renders
  if (window.evalDoughnutChart) window.evalDoughnutChart.destroy();
  if (window.evalBarChart) window.evalBarChart.destroy();

  const ctxDoughnut = document.getElementById("chart-satisfaction-doughnut");
  const ctxBar = document.getElementById("chart-satisfaction-bar");

  // Chart 1: Doughnut Chart
  if (ctxDoughnut) {
    window.evalDoughnutChart = new Chart(ctxDoughnut, {
      type: "doughnut",
      data: {
        labels: ["พึงพอใจมาก (ระดับ 1)", "พึงพอใจ (ระดับ 2)", "ควรปรับปรุง (ระดับ 3)"],
        datasets: [{
          data: [c1, c2, c3],
          backgroundColor: ["#008675", "#0284C7", "#F59E0B"],
          hoverBackgroundColor: ["#0B5C52", "#0369A1", "#D97706"],
          borderWidth: 2,
          borderColor: "#FFFFFF"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) {
                const total = c1 + c2 + c3;
                const val = context.raw || 0;
                const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                return ` ${context.label}: ${val} ท่าน (${pct}%)`;
              }
            }
          }
        },
        cutout: "68%"
      }
    });

    // Populate Custom Legend
    const legendEl = document.getElementById("doughnut-legend");
    if (legendEl) {
      legendEl.innerHTML = `
        <div class="flex flex-col items-center">
          <span class="inline-block w-3 h-3 rounded-full bg-[#008675] mb-1"></span>
          <span class="text-gray-700 font-medium">พึงพอใจมาก</span>
          <span class="text-gray-400 font-normal">${c1} ท่าน</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="inline-block w-3 h-3 rounded-full bg-[#0284C7] mb-1"></span>
          <span class="text-gray-700 font-medium">พึงพอใจ</span>
          <span class="text-gray-400 font-normal">${c2} ท่าน</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="inline-block w-3 h-3 rounded-full bg-[#F59E0B] mb-1"></span>
          <span class="text-gray-700 font-medium">ควรปรับปรุง</span>
          <span class="text-gray-400 font-normal">${c3} ท่าน</span>
        </div>
      `;
    }
  }

  // Chart 2: Bar Chart
  if (ctxBar) {
    window.evalBarChart = new Chart(ctxBar, {
      type: "bar",
      data: {
        labels: ["พึงพอใจมาก", "พึงพอใจ", "ควรปรับปรุง"],
        datasets: [{
          label: "จำนวนผู้ตอบ (ท่าน)",
          data: [c1, c2, c3],
          backgroundColor: ["#008675", "#0284C7", "#F59E0B"],
          borderRadius: 8,
          barThickness: 36
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
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
}

function renderCommentsList(evaluations) {
  const container = document.getElementById("eval-comments-list");
  const badge = document.getElementById("feedback-count-badge");

  if (!container) return;

  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
  const validFeedback = evaluations
    .filter(item => Boolean(String(item.comments ?? "").trim() || String(item.improvement_suggestion ?? "").trim()))
    .sort((a, b) => (Date.parse(b.created_at || "") || 0) - (Date.parse(a.created_at || "") || 0));

  if (badge) {
    badge.textContent = `${validFeedback.length} รายการ`;
  }

  if (validFeedback.length === 0) {
    container.innerHTML = `
      <div class="py-10 text-center text-xs font-normal text-gray-400">
        ยังไม่มีข้อเสนอแนะเพิ่มเติมจากผู้ใช้งาน
      </div>
    `;
    return;
  }

  const renderCard = (item, isDuplicate = false) => {
    const lvl = parseInt(item.satisfaction_level || 1, 10);
    const date = item.created_at ? new Date(item.created_at) : null;
    const dateText = date && !Number.isNaN(date.getTime())
      ? date.toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" })
      : "ไม่ระบุวันที่";
    const satisfaction = lvl === 3
      ? { label: "ควรปรับปรุง", classes: "bg-amber-50 text-amber-800" }
      : lvl === 2
        ? { label: "พึงพอใจ", classes: "bg-sky-50 text-sky-800" }
        : { label: "พึงพอใจมาก", classes: "bg-emerald-50 text-emerald-800" };
    const comment = String(item.comments ?? "").trim();
    const suggestion = String(item.improvement_suggestion ?? "").trim();

    return `
      <article class="eval-feedback-card${isDuplicate ? " eval-feedback-extra" : ""}"${isDuplicate ? ' aria-hidden="true"' : ""} role="listitem">
        <div class="eval-feedback-meta">
          <span class="eval-feedback-person">
            <span class="eval-feedback-avatar" aria-hidden="true">
              <svg viewBox="0 0 40 40" focusable="false">
                <circle cx="20" cy="20" r="20" fill="#e8e8e8"/>
                <circle cx="20" cy="14.5" r="7" fill="#8a8a8a"/>
                <path d="M6.5 36c.9-8.1 6-12.5 13.5-12.5S32.6 27.9 33.5 36v4h-27z" fill="#8a8a8a"/>
              </svg>
            </span>
            <span class="eval-feedback-rating ${satisfaction.classes}">${satisfaction.label}</span>
          </span>
          <time class="eval-feedback-date"${date ? ` datetime="${escapeHtml(item.created_at)}"` : ""}>${dateText}</time>
        </div>
        ${comment ? `<blockquote class="eval-feedback-quote">${escapeHtml(comment)}</blockquote>` : ""}
        ${suggestion ? `
          <div class="eval-feedback-suggestion">
            <span class="font-semibold text-amber-900">ข้อแนะนำ</span>
            <p>${escapeHtml(suggestion)}</p>
          </div>
        ` : ''}
      </article>
    `;
  };

  const useScrollingColumns = validFeedback.length >= 9;
  if (!useScrollingColumns) {
    container.innerHTML = `
      <style>
        .eval-feedback-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:20px;padding:6px}
        .eval-feedback-card{list-style:none;min-width:0;padding:18px;border:1px solid #e5ebe8;border-radius:18px;background:linear-gradient(145deg,#fff,#fbfdfc);box-shadow:0 5px 18px rgba(25,59,55,.045)}
        .eval-feedback-meta{display:flex;align-items:center;justify-content:space-between;gap:8px}
        .eval-feedback-person{display:inline-flex;align-items:center;gap:9px;min-width:0}
        .eval-feedback-avatar{display:grid;width:34px;height:34px;flex:none;place-items:center;overflow:hidden;border:1px solid #d9e8e2;border-radius:50%;background:#e5f2ee}
        .eval-feedback-avatar svg{display:block;width:100%;height:100%}
        .eval-feedback-rating{border-radius:999px;padding:4px 10px;font-size:11px;font-weight:600}
        .eval-feedback-date{color:#83918c;font-size:11px;white-space:nowrap}
        .eval-feedback-quote{margin:14px 0 0;color:#34443e;font-size:13px;line-height:1.85;white-space:pre-wrap;overflow-wrap:anywhere}
        .eval-feedback-suggestion{margin-top:12px;border-left:2px solid #f2c76c;padding:2px 0 2px 12px;color:#795b25;font-size:12px;line-height:1.8}
        .eval-feedback-suggestion p{margin:3px 0 0;white-space:pre-wrap;overflow-wrap:anywhere}
      </style>
      <div class="eval-feedback-grid" role="list">${validFeedback.map(item => renderCard(item)).join("")}</div>
    `;
    return;
  }

  const columns = [[], [], []];
  validFeedback.forEach((item, index) => columns[index % columns.length].push(item));
  const durations = [34, 40, 37];

  container.innerHTML = `
    <style>
      .eval-feedback-wall{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;padding:6px;max-height:560px;overflow:hidden;mask-image:linear-gradient(to bottom,transparent,#000 7%,#000 93%,transparent);-webkit-mask-image:linear-gradient(to bottom,transparent,#000 7%,#000 93%,transparent)}
      .eval-feedback-column{min-width:0;padding:0 4px;overflow:hidden}
      .eval-feedback-track{display:flex;flex-direction:column;gap:0;will-change:transform;animation:eval-feedback-scroll var(--eval-feedback-duration) linear infinite}
      .eval-feedback-column:nth-child(2) .eval-feedback-track{animation-delay:-11s}
      .eval-feedback-column:nth-child(3) .eval-feedback-track{animation-delay:-22s}
      .eval-feedback-column:hover .eval-feedback-track,.eval-feedback-column:focus-within .eval-feedback-track{animation-play-state:paused}
      .eval-feedback-group{display:flex;flex-direction:column;gap:18px;padding-bottom:18px;flex:none}
      .eval-feedback-card{list-style:none;min-width:0;min-height:160px;padding:18px;border:1px solid #e5ebe8;border-radius:18px;background:linear-gradient(145deg,#fff,#fbfdfc);box-shadow:0 5px 18px rgba(25,59,55,.045)}
      .eval-feedback-meta{display:flex;align-items:center;justify-content:space-between;gap:8px}
      .eval-feedback-person{display:inline-flex;align-items:center;gap:9px;min-width:0}
      .eval-feedback-avatar{display:grid;width:34px;height:34px;flex:none;place-items:center;overflow:hidden;border:1px solid #d9e8e2;border-radius:50%;background:#e5f2ee}
      .eval-feedback-avatar svg{display:block;width:100%;height:100%}
      .eval-feedback-rating{border-radius:999px;padding:4px 10px;font-size:11px;font-weight:600}
      .eval-feedback-date{color:#83918c;font-size:11px;white-space:nowrap}
      .eval-feedback-quote{margin:14px 0 0;color:#34443e;font-size:13px;line-height:1.85;white-space:pre-wrap;overflow-wrap:anywhere}
      .eval-feedback-suggestion{margin-top:12px;border-left:2px solid #f2c76c;padding:2px 0 2px 12px;color:#795b25;font-size:12px;line-height:1.8}
      .eval-feedback-suggestion p{margin:3px 0 0;white-space:pre-wrap;overflow-wrap:anywhere}
      @keyframes eval-feedback-scroll{to{transform:translateY(-50%)}}
      @media(max-width:767px){.eval-feedback-wall{grid-template-columns:minmax(0,1fr);max-height:none;overflow:visible;mask-image:none;-webkit-mask-image:none}.eval-feedback-column{overflow:visible}.eval-feedback-track{animation:none}.eval-feedback-group[aria-hidden="true"],.eval-feedback-extra{display:none}}
      @media(prefers-reduced-motion:reduce){.eval-feedback-wall{max-height:none;overflow:visible;mask-image:none;-webkit-mask-image:none}.eval-feedback-track{animation:none!important}.eval-feedback-group[aria-hidden="true"],.eval-feedback-extra{display:none}.eval-feedback-column{display:block!important;overflow:visible}}
    </style>
    <div class="eval-feedback-wall" role="region" aria-label="ข้อเสนอแนะจากผู้ใช้บริการ">
      ${columns.map((column, index) => {
        const minCardsPerLoop = Math.max(column.length, Math.ceil(560 / 188));
        const repeatedItems = Array.from({ length: minCardsPerLoop }, (_, itemIndex) => column[itemIndex % column.length]);
        const group = repeatedItems.map((item, itemIndex) => renderCard(item, itemIndex >= column.length)).join("");
        return `
          <div class="eval-feedback-column">
            <div class="eval-feedback-track" style="--eval-feedback-duration:${durations[index]}s">
              <div class="eval-feedback-group" role="list">${group}</div>
              <div class="eval-feedback-group" aria-hidden="true" role="list">${group}</div>
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}
