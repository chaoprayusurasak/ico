// ============================================================
// index_files.js - Index Directory & Catalog View Component
// (#index_files page standalone module)
// ============================================================

function renderIndexFolderIcon(label) {
  const colorVariant = label.startsWith("9") ? " index-folder-art--section-9" : "";
  return `
    <span class="index-folder-art${colorVariant}" role="img" aria-label="หมวด ${label}">
      <span class="index-folder-layer index-folder-layer-back"></span>
      <span class="index-folder-layer index-folder-layer-middle"></span>
      <span class="index-folder-layer index-folder-layer-front"></span>
      <span class="index-folder-label" aria-hidden="true">${label}</span>
    </span>
  `;
}

function renderIndexFilesView(container, items = []) {
  if (!container) return;

  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
  const safeUrl = value => {
    if (!value) return "";
    try {
      const url = new URL(value, window.location.href);
      return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
    } catch {
      return "";
    }
  };
  const uploadedFiles = (Array.isArray(items) ? items : []).filter(item =>
    !item.is_folder && (safeUrl(item.file_url) || safeUrl(item.link))
  );

  let html = `
    <section class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
      <div class="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl  text-brand-teal flex items-center justify-center  shrink-0">
            <i class="fi fi-rr-folder-open text-lg"></i>
          </div>
          <div>
            <h3 class="font-bold text-gray-900 text-base">เอกสารดัชนีรวม</h3>
          </div>
        </div>
        <span class="px-2.5 py-1 bg-slate-100 text-slate-600 font-semibold text-xs rounded-md border border-slate-200 shrink-0">
          ${uploadedFiles.length} รายการ
        </span>
      </div>
  `;

  if (uploadedFiles.length > 0) {
    html += `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">`;
    uploadedFiles.forEach(item => {
      const fileUrl = safeUrl(item.file_url);
      const linkUrl = safeUrl(item.link);
      const date = item.created_at ? new Date(item.created_at) : null;
      const formattedDate = date && !Number.isNaN(date.getTime())
        ? date.toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" })
        : "";
      html += `
        <article class="group p-4 bg-white border border-slate-200 hover:border-slate-400 rounded-xl hover:shadow-sm transition-all duration-200 flex flex-col justify-between gap-4">
          <div>
            <div class="flex items-start justify-between gap-3 mb-2">
              <h4 class="min-w-0 font-semibold text-sm text-slate-800 group-hover:text-slate-950 leading-snug transition-colors">${escapeHtml(item.title || "เอกสารดัชนีรวม")}</h4>
              ${formattedDate ? `<span class="shrink-0 flex items-center justify-end gap-1 whitespace-nowrap text-right text-[11px] text-gray-400 font-medium"><i class="fi fi-rr-calendar"></i> ${formattedDate}</span>` : ""}
            </div>
            ${item.description ? `<p class="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">${escapeHtml(item.description)}</p>` : ""}
          </div>
          <div class="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
            ${fileUrl ? `
              <button type="button" data-index-file-url="${escapeHtml(fileUrl)}" data-index-file-name="${escapeHtml(item.title || "เอกสารดัชนีรวม")}" data-index-file-id="${escapeHtml(item.id || "")}" class="px-3.5 py-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
                <i class="fi fi-rr-download text-xs"></i> ดาวน์โหลดเอกสาร
              </button>
            ` : ""}
            ${linkUrl ? `
              <a href="${escapeHtml(linkUrl)}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center gap-2">
                <i class="fi fi-rr-link text-xs"></i> เปิดลิงก์เอกสาร
              </a>
            ` : ""}
          </div>
        </article>
      `;
    });
    html += `</div>`;
  } else {
    html += `
      <div class="flex flex-col items-center justify-center py-8 gap-2 text-gray-400 text-center">
        <i class="fi fi-rr-inbox text-3xl text-teal-600/40"></i>
        <p class="text-sm font-medium text-gray-500">ยังไม่มีเอกสารดัชนีรวม</p>
        <p class="text-xs text-gray-400">เจ้าหน้าที่สามารถเพิ่มเอกสารได้จากระบบบริหารจัดการ</p>
      </div>
    `;
  }

  html += `</section>`;

  // 2. SECOND: Section 7 Category Cards (ม.7) & Section 9 Category Cards (ม.9)
  html += `
      <!-- Section 7 Category Cards -->
      <div class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="font-bold text-gray-900 text-base flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full bg-slate-900 inline-block"></span>
            ดัชนีข่าวสารตามมาตรา 7
          </h3>
          <span class="text-xs text-gray-400 font-normal">8 หมวดหมู่ย่อย</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <a href="#m7_1" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex items-center justify-between group">
            <div class="flex items-center gap-3.5">
              ${renderIndexFolderIcon("7(1)")}
              <div>
                <div class="font-bold text-sm text-gray-800 group-hover:text-brand-teal transition-colors">โครงสร้างและการจัดตั้งองค์กร</div>
                <div class="text-xs text-gray-500">การดำเนินงานของสำนักปลัดเทศบาล</div>
              </div>
            </div>
            <i class="fi fi-rr-arrow-right text-gray-300 group-hover:text-brand-teal group-hover:translate-x-1 transition-all text-sm"></i>
          </a>

          <a href="#m7_2" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex items-center justify-between group">
            <div class="flex items-center gap-3.5">
              ${renderIndexFolderIcon("7(2)")}
              <div>
                <div class="font-bold text-sm text-gray-800 group-hover:text-brand-teal transition-colors">สรุปอำนาจและหน้าที่สำคัญ</div>
                <div class="text-xs text-gray-500">วิธีการดำเนินงานของทุกกอง</div>
              </div>
            </div>
            <i class="fi fi-rr-arrow-right text-gray-300 group-hover:text-brand-teal group-hover:translate-x-1 transition-all text-sm"></i>
          </a>

          <a href="#m7_3" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex items-center justify-between group">
            <div class="flex items-center gap-3.5">
              ${renderIndexFolderIcon("7(3)")}
              <div>
                <div class="font-bold text-sm text-gray-800 group-hover:text-brand-teal transition-colors">สถานที่ติดต่อขอรับข้อมูลข่าวสาร</div>
                <div class="text-xs text-gray-500">ศูนย์ข้อมูลข่าวสารและคำแนะนำ</div>
              </div>
            </div>
            <i class="fi fi-rr-arrow-right text-gray-300 group-hover:text-brand-teal group-hover:translate-x-1 transition-all text-sm"></i>
          </a>

          <a href="#m7_4" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex items-center justify-between group">
            <div class="flex items-center gap-3.5">
              ${renderIndexFolderIcon("7(4)")}
              <div>
                <div class="font-bold text-sm text-gray-800 group-hover:text-brand-teal transition-colors">กฎ มติ ครม. และระเบียบ</div>
                <div class="text-xs text-gray-500">ข้อบังคับ คำสั่ง หนังสือเวียน แผน และนโยบาย</div>
              </div>
            </div>
            <i class="fi fi-rr-arrow-right text-gray-300 group-hover:text-brand-teal group-hover:translate-x-1 transition-all text-sm"></i>
          </a>

          <a href="#m7_5" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex items-center justify-between group">
            <div class="flex items-center gap-3.5">
              ${renderIndexFolderIcon("7(5)")}
              <div><div class="font-bold text-sm text-gray-800 group-hover:text-brand-teal transition-colors">ข้อมูลข่าวสารอื่น ๆ</div><div class="text-xs text-gray-500">ตามที่คณะกรรมการกำหนด</div></div>
            </div>
            <i class="fi fi-rr-arrow-right text-gray-300 group-hover:text-brand-teal group-hover:translate-x-1 transition-all text-sm"></i>
          </a>

          <a href="#m7_6" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex items-center justify-between group">
            <div class="flex items-center gap-3.5">
              ${renderIndexFolderIcon("7(6)")}
              <div><div class="font-bold text-sm text-gray-800 group-hover:text-brand-teal transition-colors">ผลการดำเนินงาน</div><div class="text-xs text-gray-500">ตามโครงการต่าง ๆ</div></div>
            </div>
            <i class="fi fi-rr-arrow-right text-gray-300 group-hover:text-brand-teal group-hover:translate-x-1 transition-all text-sm"></i>
          </a>

          <a href="#m7_7" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex items-center justify-between group">
            <div class="flex items-center gap-3.5">
              ${renderIndexFolderIcon("7(7)")}
              <div><div class="font-bold text-sm text-gray-800 group-hover:text-brand-teal transition-colors">คู่มือการดำเนินงาน</div><div class="text-xs text-gray-500">และการขอใบอนุญาต</div></div>
            </div>
            <i class="fi fi-rr-arrow-right text-gray-300 group-hover:text-brand-teal group-hover:translate-x-1 transition-all text-sm"></i>
          </a>

          <a href="#m7_8" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex items-center justify-between group">
            <div class="flex items-center gap-3.5">
              ${renderIndexFolderIcon("7(8)")}
              <div><div class="font-bold text-sm text-gray-800 group-hover:text-brand-teal transition-colors">ระเบียบที่ควรแจ้งให้ทราบ</div><div class="text-xs text-gray-500">เอกสารจากทุกกอง</div></div>
            </div>
            <i class="fi fi-rr-arrow-right text-gray-300 group-hover:text-brand-teal group-hover:translate-x-1 transition-all text-sm"></i>
          </a>
        </div>
      </div>

      <!-- Section 9 Category Cards -->
      <div class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="font-bold text-gray-900 text-base flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full bg-slate-900 inline-block"></span>
            ดัชนีข่าวสารตามมาตรา 9
          </h3>
          <span class="text-xs text-gray-400 font-normal">8 หมวดหมู่ย่อย</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <a href="#m9_1" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex flex-col justify-between gap-2 group">
            ${renderIndexFolderIcon("9(1)")}
            <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">รายงานการประชุมสภา</span>
          </a>
          <a href="#m9_2" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex flex-col justify-between gap-2 group">
            ${renderIndexFolderIcon("9(2)")}
            <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">งบประมาณรายจ่ายประจำปี</span>
          </a>
          <a href="#m9_3" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex flex-col justify-between gap-2 group">
            ${renderIndexFolderIcon("9(3)")}
            <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">แผนการดำเนินงานประจำปี</span>
          </a>
          <a href="#m9_4" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex flex-col justify-between gap-2 group">
            ${renderIndexFolderIcon("9(4)")}
            <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">แผนยุทธศาสตร์และแผนพัฒนาเทศบาล</span>
          </a>
          <a href="#m9_5" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex flex-col justify-between gap-2 group">
            ${renderIndexFolderIcon("9(5)")}
            <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">แผนอัตรากำลัง 3 ปี</span>
          </a>
          <a href="#m9_6" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex flex-col justify-between gap-2 group">
            ${renderIndexFolderIcon("9(6)")}
            <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">คู่มือขออนุญาตสิ่งปลูกสร้าง</span>
          </a>
          <a href="#m9_7" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex flex-col justify-between gap-2 group">
            ${renderIndexFolderIcon("9(7)")}
            <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">ประกาศประกวดราคาจัดซื้อจัดจ้าง</span>
          </a>
          <a href="#m9_8" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex flex-col justify-between gap-2 group">
            ${renderIndexFolderIcon("9(8)")}
            <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">สรุปผลจัดซื้อจัดจ้าง (สขร. 1)</span>
          </a>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
  container.querySelectorAll("[data-index-file-url]").forEach(button => {
    button.addEventListener("click", event => {
      const target = event.currentTarget;
      if (typeof window.downloadFile === "function") {
        window.downloadFile(
          event,
          target.dataset.indexFileUrl,
          target.dataset.indexFileName,
          target.dataset.indexFileId
        );
      } else {
        window.open(target.dataset.indexFileUrl, "_blank", "noopener");
      }
    });
  });
  const headerBanner = document.getElementById("page-header-banner");
  if (headerBanner) headerBanner.classList.remove("route-loading");
}

window.renderIndexFilesView = renderIndexFilesView;
