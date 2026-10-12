/**
 * Module: eval_summary.js
 * Dedicated Satisfaction Summary & Analytics Dashboard view renderer using Chart.js & Supabase data.
 */

let selectedEvalLevel = 1;

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

      <div id="eval-satisfaction-district" class="mb-8"></div>

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
  renderSatisfactionDistrict(
    [countLevel1, countLevel2, countLevel3],
    totalCount,
    overallSatisfactionPercent
  );

  // 3. Render Comments List
  renderCommentsList(rawEvaluations);
}

function renderSatisfactionDistrict(counts, total, satisfactionPercent) {
  const container = document.getElementById("eval-satisfaction-district");
  if (!container) return;

  const levels = [
    { id: 1, name: "พึงพอใจมาก", color: "#008675", side: "#07584f" },
    { id: 2, name: "พึงพอใจ", color: "#0284c7", side: "#07527a" },
    { id: 3, name: "ควรปรับปรุง", color: "#f59e0b", side: "#a85b09" }
  ].map((level, index) => ({
    ...level,
    count: counts[index],
    percent: total > 0 ? Math.round(counts[index] / total * 100) : 0
  }));
  const selected = levels.find(level => level.id === selectedEvalLevel) || levels[0];
  const topLevel = levels.reduce((top, level) => level.count > top.count ? level : top, levels[0]);
  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
  const pointList = vertices => vertices.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  const width = 640;
  const height = 230;
  const maximum = Math.max(1, ...levels.map(level => level.count));
  const project = (x, y, z = 0) => [(x - y) * 0.86, (x + y) * 0.43 - z];
  const blocks = levels.map((level, index) => {
    const x = index * 1.55;
    const y = 0;
    const side = 1.05;
    const z = level.count ? Math.max(0.12, level.count / maximum * 1.12) : 0.04;
    return {
      ...level,
      depth: x + y,
      base: [project(x, y), project(x + side, y), project(x + side, y + side), project(x, y + side)],
      roof: [project(x, y, z), project(x + side, y, z), project(x + side, y + side, z), project(x, y + side, z)]
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
  const fittedGround = pointList(ground.map(fit));
  const blocksSvg = blocks.sort((a, b) => a.depth - b.depth).map(block => {
    const base = block.base.map(fit);
    const roof = block.roof.map(fit);
    const centerX = roof.reduce((sum, point) => sum + point[0], 0) / 4;
    const centerY = roof.reduce((sum, point) => sum + point[1], 0) / 4;
    const isSelected = selected.id === block.id;
    return `
      <g class="ed-block${isSelected ? " is-selected" : ""}" data-level="${block.id}" role="button" tabindex="0"
         aria-label="${escapeHtml(block.name)} ${block.count.toLocaleString()} ท่าน ${block.percent}%"
         aria-pressed="${isSelected}" style="--ed-color:${block.color};--ed-side:${block.side}">
        <polygon class="ed-side-left" points="${pointList([roof[3], roof[2], base[2], base[3]])}"></polygon>
        <polygon class="ed-side-right" points="${pointList([roof[1], roof[2], base[2], base[1]])}"></polygon>
        <polygon class="ed-roof" points="${pointList(roof)}"></polygon>
        <text x="${centerX.toFixed(1)}" y="${(centerY + 4).toFixed(1)}" text-anchor="middle">${block.id}</text>
      </g>`;
  }).join("");
  const distribution = levels.map(level =>
    `<span style="width:${total ? level.count / total * 100 : 0}%;background:${level.color}" title="${escapeHtml(level.name)} ${level.percent}%"></span>`
  ).join("");

  container.innerHTML = `
    <style>
      .eval-district{--ed-border:#e5e7eb;--ed-muted:#737373;--ed-ink:#17201f;--ed-surface:#fff;--ed-subtle:#f8faf9;--ed-ground:#f1f5f4;width:100%;max-width:none;margin:0;color:var(--ed-ink);background:var(--ed-surface);border:1px solid var(--ed-border);border-radius:16px;box-shadow:0 4px 20px rgba(15,23,42,.06);overflow:hidden;font-size:13px}
      .eval-district *{box-sizing:border-box}
      .ed-header{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:22px 24px 0}
      .ed-heading{display:flex;align-items:center;gap:11px;min-width:0}
      .ed-emblem{display:grid;place-items:center;width:36px;height:36px;flex:none;border:1px solid var(--ed-border);border-radius:10px;background:var(--ed-subtle);color:#087d72}
      .ed-heading h3{margin:0;font-size:15px;font-weight:600;line-height:1.4}
      .ed-heading p{margin:3px 0 0;color:var(--ed-muted);font-size:12px}
      .ed-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:23px 24px 16px}
      .ed-stat{display:flex;flex-direction:column;min-width:0}
      .ed-stat+.ed-stat{padding-left:18px;border-left:1px solid var(--ed-border)}
      .ed-stat span{color:var(--ed-muted);font-size:11px}
      .ed-stat strong{margin-top:3px;font-size:22px;font-weight:600;line-height:1.35;font-variant-numeric:tabular-nums}
      .ed-stat small{margin-top:2px;color:var(--ed-muted);font-size:11px}
      .ed-capacity{display:flex;align-items:center;gap:11px;margin:0 24px 17px}
      .ed-meter{display:flex;flex:1;height:6px;overflow:hidden;border-radius:9px;background:var(--ed-ground)}
      .ed-meter span{height:100%;transition:width .25s ease}
      .ed-capacity-label{color:var(--ed-muted);font-size:11px;white-space:nowrap}
      .ed-browser{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 24px 7px;padding-top:13px;border-top:1px solid var(--ed-border)}
      .ed-breadcrumb{display:flex;align-items:center;gap:7px;min-width:0;color:var(--ed-muted);font-size:11px}
      .ed-breadcrumb strong{color:var(--ed-ink);font-weight:500}
      .ed-plot{position:relative;margin:0 12px}
      .ed-chart{display:block;width:100%;height:230px;user-select:none}
      .ed-ground{fill:var(--ed-ground)}
      .ed-block{cursor:pointer;outline:none;transition:filter .16s ease,transform .16s ease}
      .ed-block polygon{stroke:rgba(255,255,255,.7);stroke-width:1}
      .ed-roof{fill:var(--ed-color)}
      .ed-side-left,.ed-side-right{fill:var(--ed-side)}
      .ed-side-right{filter:brightness(.88)}
      .ed-block text{fill:#fff;font:600 12px sans-serif;pointer-events:none}
      .ed-block:hover,.ed-block:focus-visible{filter:brightness(1.12) drop-shadow(0 5px 5px rgba(15,23,42,.18))}
      .ed-block.is-selected{filter:brightness(1.08) drop-shadow(0 4px 4px rgba(15,23,42,.2))}
      .ed-caption{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;margin:0 24px 14px;color:var(--ed-muted);font-size:11px}
      .ed-legend{display:flex;flex-wrap:wrap;gap:12px}
      .ed-legend span{display:inline-flex;align-items:center;gap:5px}
      .ed-dot{width:8px;height:8px;border-radius:50%}
      .ed-inspector{padding:14px 24px 15px;border-top:1px solid var(--ed-border);background:var(--ed-subtle)}
      .ed-selected-summary{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;color:var(--ed-muted);font-size:11px}
      .ed-selected-summary strong{color:var(--ed-ink);font-size:13px;font-weight:600}
      .ed-empty{padding:35px 15px;color:var(--ed-muted);text-align:center;font-size:12px}
      @media(max-width:560px){.ed-header{align-items:flex-start;gap:10px;padding:18px 16px 0}.ed-heading{gap:8px}.ed-heading h3{font-size:13px}.ed-heading p{font-size:11px}.ed-stats{gap:7px;margin:19px 16px 14px}.ed-stat+.ed-stat{padding-left:9px}.ed-stat strong{font-size:19px}.ed-stat span,.ed-stat small{font-size:10px}.ed-capacity{margin:0 16px 14px}.ed-browser{margin-inline:16px}.ed-plot{margin-inline:2px}.ed-chart{height:190px}.ed-caption{margin-inline:16px}.ed-inspector{padding-inline:16px}}
      @media(prefers-reduced-motion:reduce){.eval-district *{scroll-behavior:auto!important;transition:none!important}}
    </style>
    <section class="eval-district" aria-label="สรุปผลระดับความพึงพอใจ">
      <div class="ed-stats">
        <div class="ed-stat"><span>ผู้ตอบแบบประเมิน</span><strong>${total.toLocaleString()}</strong><small>ท่าน</small></div>
        <div class="ed-stat"><span>ความพึงพอใจรวม</span><strong>${satisfactionPercent}%</strong><small>คะแนนภาพรวม</small></div>
        <div class="ed-stat"><span>ระดับที่พบมากที่สุด</span><strong>${escapeHtml(topLevel.name)}</strong><small>${topLevel.count.toLocaleString()} ท่าน</small></div>
      </div>
      <div class="ed-capacity" aria-label="สัดส่วนคำตอบในแต่ละระดับ">
        <div class="ed-meter">${distribution}</div>
        <span class="ed-capacity-label">${total.toLocaleString()} คำตอบ</span>
      </div>
      <div class="ed-browser"><div class="ed-breadcrumb"><span>ผลประเมิน</span><span aria-hidden="true">›</span><strong>ระดับความพึงพอใจ</strong></div><span class="ed-capacity-label"></span></div>
      <div class="ed-plot">
        <svg class="ed-chart" viewBox="0 0 ${width} ${height}" role="group" aria-label="แผนผังสามมิติแสดงจำนวนผู้ตอบในแต่ละระดับ">
          <polygon class="ed-ground" points="${fittedGround}"></polygon>${blocksSvg}
        </svg>
      </div>
      <div class="ed-caption">
        <div class="ed-legend">${levels.map(level => `<span><i class="ed-dot" style="background:${level.color}"></i>${escapeHtml(level.name)}</span>`).join("")}</div>
        <span>เลือกแท่งกราฟเพื่อดูรายละเอียด</span>
      </div>
      <div class="ed-inspector" aria-live="polite" aria-atomic="true">
        <div class="ed-selected-summary"><span><strong>${escapeHtml(selected.name)}</strong> · ระดับ ${selected.id}</span><span>${selected.percent}% ของผู้ตอบทั้งหมด</span></div>
        <div class="ed-selected-summary"><span>${selected.count.toLocaleString()} ท่าน</span><span>จาก ${total.toLocaleString()} ท่าน</span></div>
      </div>
    </section>
  `;

  container.querySelectorAll("[data-eval-level]").forEach(button => {
    button.addEventListener("click", () => {
      selectedEvalLevel = Number(button.dataset.evalLevel);
      renderSatisfactionDistrict(counts, total, satisfactionPercent);
    });
  });
  container.querySelectorAll(".ed-block").forEach(block => {
    const selectLevel = () => {
      selectedEvalLevel = Number(block.dataset.level);
      renderSatisfactionDistrict(counts, total, satisfactionPercent);
    };
    block.addEventListener("click", selectLevel);
    block.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectLevel();
      }
    });
  });
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
