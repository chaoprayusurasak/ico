function escapeAdminVisitorHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
}

window.loadAdminVisitorStats = async function (container) {
  container.innerHTML = `<div class="py-12 text-center text-sm text-slate-500">กำลังโหลดสถิติผู้เข้าชม...</div>`;

  try {
    const [logsResult, totalResult] = await Promise.all([
      window.supabase
        .from("evaluations")
        .select("id, category, level_label, comments, improvement_suggestion, created_at")
        .eq("category", "visitor_log")
        .order("created_at", { ascending: false }),
      window.supabase
        .from("items")
        .select("description")
        .eq("category", "site_stats")
        .eq("title", "visitor_count")
        .maybeSingle()
    ]);

    if (logsResult.error) throw logsResult.error;
    if (totalResult.error) {
      console.warn("Unable to load the site-wide visitor counter; using visitor log count:", totalResult.error);
    }

    const parsedTotal = Number.parseInt(totalResult.data?.description || "", 10);
    const totalVisitors = Number.isFinite(parsedTotal) && parsedTotal > 0
      ? parsedTotal
      : (logsResult.data || []).length;
    window.ADMIN_VISITOR_LOGS = logsResult.data || [];
    window.ADMIN_VISITOR_TOTAL = totalVisitors;
    renderAdminVisitorStats(container, window.ADMIN_VISITOR_LOGS, totalVisitors);
  } catch (error) {
    console.error("Unable to load visitor statistics in admin:", error);
    container.innerHTML = `
      <div class="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700" role="alert">
        โหลดสถิติผู้เข้าชมไม่สำเร็จ: ${escapeAdminVisitorHtml(error.message || error)}
        <p class="mt-2 text-xs">ตรวจสอบสิทธิ์ SELECT ของตาราง evaluations ใน Supabase RLS</p>
      </div>
    `;
  }
};

function renderAdminVisitorStats(container, logs, totalVisitors) {
  const pageSize = 10;
  const pageCount = Math.ceil(logs.length / pageSize);
  window.ADMIN_VISITOR_PAGE = Math.max(1, Math.min(window.ADMIN_VISITOR_PAGE || 1, pageCount || 1));
  const pageStart = (window.ADMIN_VISITOR_PAGE - 1) * pageSize;
  const visibleLogs = logs.slice(pageStart, pageStart + pageSize);
  const today = new Date().toISOString().slice(0, 10);
  const month = today.slice(0, 7);
  const countsByDevice = { Mobile: 0, Tablet: 0, Desktop: 0 };
  let todayCount = 0;
  let monthCount = 0;

  logs.forEach(log => {
    const logDate = log.comments || String(log.created_at || "").slice(0, 10);
    const device = countsByDevice[log.level_label] === undefined ? "Desktop" : log.level_label;
    countsByDevice[device]++;
    if (logDate === today) todayCount++;
    if (logDate.startsWith(month)) monthCount++;
  });

  const metrics = [
    { label: "ผู้เข้าชมทั้งหมด", value: totalVisitors.toLocaleString(), icon: "fi-rr-eye", color: "text-brand-teal" },
    { label: "ผู้เข้าชมวันนี้", value: todayCount.toLocaleString(), icon: "fi-rr-calendar", color: "text-sky-600" },
    { label: "ผู้เข้าชมเดือนนี้", value: monthCount.toLocaleString(), icon: "fi-rr-stats", color: "text-violet-600" },
    { label: "อุปกรณ์ที่บันทึก", value: logs.length.toLocaleString(), icon: "fi-rr-device", color: "text-amber-600" }
  ];

  const deviceNames = { Mobile: "มือถือ", Tablet: "แท็บเล็ต", Desktop: "คอมพิวเตอร์" };
  const logsHtml = visibleLogs.map(log => {
    const date = log.created_at ? new Date(log.created_at).toLocaleString("th-TH") : "-";
    const device = deviceNames[log.level_label] || "คอมพิวเตอร์";
    const userAgent = log.improvement_suggestion || "-";
    return `
      <tr class="hover:bg-slate-50/80 transition-colors">
        <td class="py-3 px-3.5 text-xs text-gray-500 whitespace-nowrap">${escapeAdminVisitorHtml(date)}</td>
        <td class="py-3 px-3.5 text-sm font-medium text-gray-800">${device}</td>
        <td class="py-3 px-3.5 text-xs text-gray-500 max-w-lg truncate" title="${escapeAdminVisitorHtml(userAgent)}">${escapeAdminVisitorHtml(userAgent)}</td>
      </tr>
    `;
  }).join("");

  container.innerHTML = `
    <div class="space-y-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        ${metrics.map(metric => `
          <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <i class="fi ${metric.icon} ${metric.color}"></i>
              <span>${metric.label}</span>
            </div>
            <div class="mt-2 text-2xl font-bold ${metric.color}">${metric.value}</div>
          </div>
        `).join("")}
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        ${Object.entries(countsByDevice).map(([device, count]) => `
          <div class="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-2xs flex items-center justify-between">
            <span class="text-sm text-gray-600">${deviceNames[device]}</span>
            <span class="text-sm font-bold text-gray-900">${count.toLocaleString()}</span>
          </div>
        `).join("")}
      </div>

      <div class="w-full min-w-0 overflow-x-auto rounded-2xl border border-gray-200/80 shadow-2xs bg-white">
        <table class="w-full min-w-[640px] text-left border-collapse">
          <thead>
            <tr class="bg-slate-100/90 text-slate-700 text-xs font-bold border-b border-slate-200">
              <th class="py-3 px-3.5 w-48 text-xs">วันที่เข้าชม</th>
              <th class="py-3 px-3.5 w-36 text-xs">อุปกรณ์</th>
              <th class="py-3 px-3.5 text-xs">ข้อมูลอุปกรณ์</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            ${logsHtml || '<tr><td colspan="3" class="py-12 text-center text-sm text-gray-500">ยังไม่มีข้อมูลผู้เข้าชมในระบบ</td></tr>'}
          </tbody>
        </table>
      </div>
      ${pageCount > 1 ? `
        <div class="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500" aria-label="เปลี่ยนหน้าสถิติผู้เข้าชม">
          <span>แสดง ${pageStart + 1}-${Math.min(pageStart + pageSize, logs.length)} จาก ${logs.length.toLocaleString()} รายการ</span>
          <div class="flex items-center gap-1.5">
            <button type="button" onclick="setAdminVisitorPage(${window.ADMIN_VISITOR_PAGE - 1})" ${window.ADMIN_VISITOR_PAGE === 1 ? "disabled" : ""}
              class="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">ก่อนหน้า</button>
            <span class="px-2">${window.ADMIN_VISITOR_PAGE} / ${pageCount}</span>
            <button type="button" onclick="setAdminVisitorPage(${window.ADMIN_VISITOR_PAGE + 1})" ${window.ADMIN_VISITOR_PAGE === pageCount ? "disabled" : ""}
              class="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">ถัดไป</button>
          </div>
        </div>
      ` : ""}
    </div>
  `;
}

window.setAdminVisitorPage = function (page) {
  const container = document.getElementById("items-list-container");
  const logs = window.ADMIN_VISITOR_LOGS || [];
  const totalVisitors = window.ADMIN_VISITOR_TOTAL || logs.length;
  const pageCount = Math.ceil(logs.length / 10);
  if (!container || !Number.isInteger(page) || page < 1 || page > pageCount) return;
  window.ADMIN_VISITOR_PAGE = page;
  renderAdminVisitorStats(container, logs, totalVisitors);
};
