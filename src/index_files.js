// ============================================================
// index_files.js - Index Directory & Catalog View Component
// (#index_files page standalone module)
// ============================================================

function renderIndexFilesView(container, items = []) {
  if (!container) return;

  let html = `
  `;

  // 1. FIRST: Render uploaded items list for index_files if available
  if (items && items.length > 0) {
    html += `
      <div class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div class="flex items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 shrink-0">
              <dotlottie-wc src="./assets/icons/document.json" autoplay loop class="w-8 h-8"></dotlottie-wc>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 text-base flex items-center gap-2">
                รายการแฟ้มเอกสารดัชนีรวมประจำศูนย์
              </h3>
            </div>
          </div>
          <span class="px-2.5 py-1 bg-slate-100 text-slate-600 font-semibold text-xs rounded-md border border-slate-200 shrink-0">
            ${items.length} รายการ
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    `;

    items.forEach(item => {
      const formattedDate = item.created_at ? new Date(item.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
      html += `
        <div class="group p-4 bg-white border border-slate-200 hover:border-slate-400 rounded-xl shadow-none hover:shadow-sm transition-all duration-200 flex flex-col justify-between gap-4">
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold border border-slate-200">
                <i class="fi fi-rr-file-pdf text-xs"></i> แฟ้มดัชนีข่าวสาร
              </span>
              ${formattedDate ? `<span class="text-[11px] text-gray-400 font-medium flex items-center gap-1"><i class="fi fi-rr-calendar"></i> ${formattedDate}</span>` : ''}
            </div>
            <h4 class="font-semibold text-sm text-slate-800 group-hover:text-slate-950 leading-snug transition-colors">${item.title}</h4>
            ${item.description ? `<p class="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">${item.description}</p>` : ''}
          </div>

          <div class="flex items-center gap-2 pt-3 border-t border-slate-100">
            ${item.file_url ? `
              <button onclick="downloadFile(event, '${(item.file_url || '').replace(/'/g, "\\'")}', '${(item.title || '').replace(/'/g, "\\'")}', '${item.id || ''}')" class="px-3.5 py-2 bg-slate-900 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
                <i class="fi fi-rr-download text-xs"></i> ดาวน์โหลดเอกสาร
              </button>
            ` : ''}
            ${item.link ? `
              <a href="${item.link}" target="_blank" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer">
                <i class="fi fi-rr-link text-xs"></i> เปิดลิงก์เอกสาร
              </a>
            ` : ''}
            ${!item.file_url && !item.link ? `
              <span class="text-xs text-gray-400 font-normal">ไม่มีเอกสารแนบ</span>
            ` : ''}
          </div>
        </div>
      `;
    });

    html += `</div></div>`;
  }

  // 2. SECOND: Section 7 Category Cards (ม.7) & Section 9 Category Cards (ม.9)
  html += `
      <!-- Section 7 Category Cards -->
      <div class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="font-bold text-gray-900 text-base flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full bg-slate-900 inline-block"></span>
            ดัชนีข่าวสารตามมาตรา 7
          </h3>
          <span class="text-xs text-gray-400 font-normal">4 หมวดหมู่ย่อย</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <a href="#m7_1" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex items-center justify-between group">
            <div class="flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-white text-slate-700 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                7(1)
              </div>
              <div>
                <div class="font-bold text-sm text-gray-800 group-hover:text-brand-teal transition-colors">โครงสร้างและการจัดองค์กร</div>
                <div class="text-xs text-gray-500">การดำเนินงาน และแผนผังหน่วยงาน</div>
              </div>
            </div>
            <i class="fi fi-rr-arrow-right text-gray-300 group-hover:text-brand-teal group-hover:translate-x-1 transition-all text-sm"></i>
          </a>

          <a href="#m7_2" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex items-center justify-between group">
            <div class="flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-white text-slate-700 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                7(2)
              </div>
              <div>
                <div class="font-bold text-sm text-gray-800 group-hover:text-brand-teal transition-colors">สรุปอำนาจหน้าที่สำคัญ</div>
                <div class="text-xs text-gray-500">และวิธีการดำเนินงานของราชการ</div>
              </div>
            </div>
            <i class="fi fi-rr-arrow-right text-gray-300 group-hover:text-brand-teal group-hover:translate-x-1 transition-all text-sm"></i>
          </a>

          <a href="#m7_3" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex items-center justify-between group">
            <div class="flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-white text-slate-700 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                7(3)
              </div>
              <div>
                <div class="font-bold text-sm text-gray-800 group-hover:text-brand-teal transition-colors">สถานที่ติดต่อขอรับข้อมูล</div>
                <div class="text-xs text-gray-500">ช่องทางการขอรับข้อมูลข่าวสาร</div>
              </div>
            </div>
            <i class="fi fi-rr-arrow-right text-gray-300 group-hover:text-brand-teal group-hover:translate-x-1 transition-all text-sm"></i>
          </a>

          <a href="#m7_4" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex items-center justify-between group">
            <div class="flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-white text-slate-700 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                7(4)
              </div>
              <div>
                <div class="font-bold text-sm text-gray-800 group-hover:text-brand-teal transition-colors">กฎ มติ ครม. และคำสั่งระเบียบ</div>
                <div class="text-xs text-gray-500">ที่เกี่ยวข้องโดยตรงกับการปฏิบัติงาน</div>
              </div>
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
            <span class="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md w-max border border-slate-200">ม.9 (1)</span>
            <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">ผลการพิจารณาอนุมัติ</span>
          </a>
          <a href="#m9_2" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex flex-col justify-between gap-2 group">
            <span class="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md w-max border border-slate-200">ม.9 (2)</span>
            <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">นโยบายและการตีความ</span>
          </a>
          <a href="#m9_3" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex flex-col justify-between gap-2 group">
            <span class="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md w-max border border-slate-200">ม.9 (3)</span>
            <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">แผนงาน/โครงการงบประมาณ</span>
          </a>
          <a href="#m9_4" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex flex-col justify-between gap-2 group">
            <span class="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md w-max border border-slate-200">ม.9 (4)</span>
            <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">คู่มือและคำสั่งการทำงาน</span>
          </a>
          <a href="#m9_5" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex flex-col justify-between gap-2 group">
            <span class="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md w-max border border-slate-200">ม.9 (5)</span>
            <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">สิ่งพิมพ์ราชการ</span>
          </a>
          <a href="#m9_6" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex flex-col justify-between gap-2 group">
            <span class="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md w-max border border-slate-200">ม.9 (6)</span>
            <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">สัญญาสัมปทาน / ร่วมทุน</span>
          </a>
          <a href="#m9_7" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex flex-col justify-between gap-2 group">
            <span class="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md w-max border border-slate-200">ม.9 (7)</span>
            <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">มติคณะรัฐมนตรี / คำสั่ง</span>
          </a>
          <a href="#m9_8" class="p-4 bg-slate-50 border border-slate-200 hover:border-slate-400 hover:bg-white rounded-xl shadow-none hover:shadow-sm transition-all flex flex-col justify-between gap-2 group">
            <span class="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md w-max border border-slate-200">ม.9 (8)</span>
            <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">ข้อมูลข่าวสารอื่นที่กำหนด</span>
          </a>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
  const headerBanner = document.getElementById("page-header-banner");
  if (headerBanner) headerBanner.classList.remove("route-loading");
}

window.renderIndexFilesView = renderIndexFilesView;
