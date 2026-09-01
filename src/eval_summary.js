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
            <span class="text-xs text-gray-400 font-normal">Doughnut Chart</span>
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
              <h3 class="font-medium text-sm sm:text-base text-gray-800">จำนวนผู้ประเมินแยกตามระดับ</h3>
            </div>
            <span class="text-xs text-gray-400 font-normal">Bar Chart</span>
          </div>

          <div class="relative w-full h-64 sm:h-72 mx-auto flex items-center justify-center">
            <canvas id="chart-satisfaction-bar"></canvas>
          </div>

          <div class="pt-4 border-t border-gray-100 text-xs text-gray-500 font-normal text-center">
            สถิติอัปเดตแบบ Real-time จากผู้ใช้บริการทั้งหมด
          </div>
        </div>

      </div>

      <!-- Citizens Comments & Feedback Table List -->
      <div class="bg-white p-6 sm:p-8 rounded-xl border border-gray-200/90 shadow-2xs">
        <div class="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
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
    if (sb) {
      // 1. Fetch from 'evaluations' table
      const res1 = await sb.from("evaluations").select("*").order("created_at", { ascending: false });
      if (!res1.error && res1.data && res1.data.length > 0) {
        rawEvaluations = res1.data;
      } else {
        // 2. Fallback to 'items' or 'oic_documents' table where category = 'evaluations'
        const res2 = await sb.from("oic_documents").select("*").eq("category", "evaluations").order("created_at", { ascending: false });
        if (!res2.error && res2.data && res2.data.length > 0) {
          rawEvaluations = res2.data.map(item => parseItemToEval(item));
        } else {
          const res3 = await sb.from("items").select("*").eq("category", "evaluations").order("created_at", { ascending: false });
          if (!res3.error && res3.data) {
            rawEvaluations = res3.data.map(item => parseItemToEval(item));
          }
        }
      }
    }
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

function parseItemToEval(item) {
  let level = 1;
  if (item.title && item.title.includes("ระดับ 2")) level = 2;
  if (item.title && item.title.includes("ระดับ 3")) level = 3;

  return {
    id: item.id,
    satisfaction_level: level,
    level_label: level === 1 ? "พึงพอใจมาก" : (level === 2 ? "พึงพอใจ" : "ควรปรับปรุง"),
    improvement_suggestion: item.description || "",
    comments: item.description || "",
    created_at: item.created_at || new Date().toISOString()
  };
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

  const validFeedback = evaluations.filter(e => Boolean(e.comments || e.improvement_suggestion));

  if (badge) {
    badge.textContent = `${validFeedback.length} รายการ`;
  }

  if (validFeedback.length === 0) {
    container.innerHTML = `
      <div class="text-center py-10 text-gray-400 text-xs font-normal bg-gray-50 rounded-xl border border-gray-100">
        ยังไม่มีข้อเสนอแนะเพิ่มเติมจากผู้ใช้งาน
      </div>
    `;
    return;
  }

  let html = ``;
  validFeedback.forEach(item => {
    const lvl = parseInt(item.satisfaction_level || 1, 10);
    const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) : 'ไม่ระบุวันที่';
    
    let tagBg = "bg-emerald-50 text-emerald-700 border-emerald-200";
    let tagIcon = "😍";
    let tagText = "พึงพอใจมาก";

    if (lvl === 2) {
      tagBg = "bg-teal-50 text-teal-700 border-teal-200";
      tagIcon = "🙂";
      tagText = "พึงพอใจ";
    } else if (lvl === 3) {
      tagBg = "bg-amber-50 text-amber-700 border-amber-200";
      tagIcon = "🙁";
      tagText = "ควรปรับปรุง";
    }

    html += `
      <div class="p-4 bg-gray-50/70 hover:bg-gray-50 border border-gray-200/80 rounded-xl transition-all space-y-2">
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-normal border ${tagBg}">
            <span>${tagIcon}</span>
            <span>${tagText}</span>
          </div>
          <span class="text-[11px] text-gray-400 font-normal">${dateStr}</span>
        </div>

        ${item.comments ? `
          <p class="text-xs sm:text-sm text-gray-700 font-normal leading-relaxed whitespace-normal break-words">
            "${item.comments}"
          </p>
        ` : ''}

        ${item.improvement_suggestion ? `
          <div class="text-xs text-amber-800 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200/60 font-normal">
            <span class="font-medium text-amber-900">ข้อแนะนำปรับปรุง:</span> ${item.improvement_suggestion}
          </div>
        ` : ''}
      </div>
    `;
  });

  container.innerHTML = html;
}
