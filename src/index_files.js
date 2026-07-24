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
      <div class="bg-white border border-teal-900/10 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(0,134,117,0.08)] transition-all">
        <div class="flex items-center justify-between gap-3 border-b border-gray-100 pb-4 mb-5">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl bg-teal-50 text-brand-teal flex items-center justify-center border border-teal-100 shadow-sm shrink-0">
              <dotlottie-wc src="./assets/icons/document.json" autoplay loop class="w-8 h-8"></dotlottie-wc>
            </div>
            <div>
              <h3 class="font-bold text-gray-900 text-base flex items-center gap-2">
                รายการแฟ้มเอกสารดัชนีรวมประจำศูนย์
              </h3>
              <p class="text-xs text-gray-500 font-normal">เอกสารข่าวสารที่เผยแพร่ล่าสุดสำหรับประชาชน</p>
            </div>
          </div>
          <span class="px-3 py-1 bg-teal-500/10 text-brand-teal font-bold text-xs rounded-full border border-teal-500/20 shrink-0">
            ${items.length} รายการ
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    `;

    items.forEach(item => {
      const formattedDate = item.created_at ? new Date(item.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
      html += `
        <div class="group p-5 bg-gradient-to-b from-slate-50/80 to-white border border-gray-200/80 hover:border-brand-teal/40 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between gap-4">
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-teal-50 text-brand-teal text-[11px] font-bold border border-teal-100">
                <i class="fi fi-rr-file-pdf text-xs"></i> แฟ้มดัชนีข่าวสาร
              </span>
              ${formattedDate ? `<span class="text-[11px] text-gray-400 font-medium flex items-center gap-1"><i class="fi fi-rr-calendar"></i> ${formattedDate}</span>` : ''}
            </div>
            <h4 class="font-bold text-sm text-gray-800 group-hover:text-brand-teal leading-snug transition-colors">${item.title}</h4>
            ${item.description ? `<p class="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">${item.description}</p>` : ''}
          </div>

          <div class="flex items-center gap-2 pt-3 border-t border-gray-100">
            ${item.file_url ? `
              <a href="${item.file_url}" target="_blank" download class="px-4 py-2 bg-gradient-to-r from-brand-teal to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer">
                <i class="fi fi-rr-download text-xs"></i> ดาวน์โหลดเอกสาร
              </a>
            ` : ''}
            ${item.link ? `
              <a href="${item.link}" target="_blank" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer">
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
      <div class="bg-white border border-teal-900/10 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
        <div class="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 class="font-bold text-gray-900 text-base flex items-center gap-2.5">
            <span class="w-3.5 h-3.5 rounded-full bg-brand-teal shadow-sm inline-block"></span>
            ดัชนีข่าวสารตามมาตรา 7
          </h3>
          <span class="text-xs text-gray-400 font-normal">4 หมวดหมู่ย่อย</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <a href="#m7_1" class="p-4 bg-slate-50/70 border border-gray-200/70 hover:border-brand-teal hover:bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-between group">
            <div class="flex items-center gap-3.5">
              <div class="w-11 h-11 rounded-2xl bg-brand-teal/10 text-brand-teal flex items-center justify-center font-extrabold text-sm shrink-0 group-hover:bg-brand-teal group-hover:text-white transition-colors shadow-sm">
                7(1)
              </div>
              <div>
                <div class="font-bold text-sm text-gray-800 group-hover:text-brand-teal transition-colors">โครงสร้างและการจัดองค์กร</div>
                <div class="text-xs text-gray-500">การดำเนินงาน และแผนผังหน่วยงาน</div>
              </div>
            </div>
            <i class="fi fi-rr-arrow-right text-gray-300 group-hover:text-brand-teal group-hover:translate-x-1 transition-all text-sm"></i>
          </a>

          <a href="#m7_2" class="p-4 bg-slate-50/70 border border-gray-200/70 hover:border-brand-teal hover:bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-between group">
            <div class="flex items-center gap-3.5">
              <div class="w-11 h-11 rounded-2xl bg-brand-teal/10 text-brand-teal flex items-center justify-center font-extrabold text-sm shrink-0 group-hover:bg-brand-teal group-hover:text-white transition-colors shadow-sm">
                7(2)
              </div>
              <div>
                <div class="font-bold text-sm text-gray-800 group-hover:text-brand-teal transition-colors">สรุปอำนาจหน้าที่สำคัญ</div>
                <div class="text-xs text-gray-500">และวิธีการดำเนินงานของราชการ</div>
              </div>
            </div>
            <i class="fi fi-rr-arrow-right text-gray-300 group-hover:text-brand-teal group-hover:translate-x-1 transition-all text-sm"></i>
          </a>

          <a href="#m7_3" class="p-4 bg-slate-50/70 border border-gray-200/70 hover:border-brand-teal hover:bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-between group">
            <div class="flex items-center gap-3.5">
              <div class="w-11 h-11 rounded-2xl bg-brand-teal/10 text-brand-teal flex items-center justify-center font-extrabold text-sm shrink-0 group-hover:bg-brand-teal group-hover:text-white transition-colors shadow-sm">
                7(3)
              </div>
              <div>
                <div class="font-bold text-sm text-gray-800 group-hover:text-brand-teal transition-colors">สถานที่ติดต่อขอรับข้อมูล</div>
                <div class="text-xs text-gray-500">ช่องทางการขอรับข้อมูลข่าวสาร</div>
              </div>
            </div>
            <i class="fi fi-rr-arrow-right text-gray-300 group-hover:text-brand-teal group-hover:translate-x-1 transition-all text-sm"></i>
          </a>

          <a href="#m7_4" class="p-4 bg-slate-50/70 border border-gray-200/70 hover:border-brand-teal hover:bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-between group">
            <div class="flex items-center gap-3.5">
              <div class="w-11 h-11 rounded-2xl bg-brand-teal/10 text-brand-teal flex items-center justify-center font-extrabold text-sm shrink-0 group-hover:bg-brand-teal group-hover:text-white transition-colors shadow-sm">
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
      <div class="bg-white border border-teal-900/10 rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] space-y-4">
        <div class="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 class="font-bold text-gray-900 text-base flex items-center gap-2.5">
            <span class="w-3.5 h-3.5 rounded-full bg-teal-600 shadow-sm inline-block"></span>
            ดัชนีข่าวสารตามมาตรา 9
          </h3>
          <span class="text-xs text-gray-400 font-normal">8 หมวดหมู่ย่อย</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <a href="#m9_1" class="p-4 bg-slate-50/70 border border-gray-200/70 hover:border-brand-teal hover:bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-2 group">
            <span class="text-xs font-bold text-brand-teal bg-teal-50 px-2 py-0.5 rounded-md w-max border border-teal-100">ม.9 (1)</span>
            <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">ผลการพิจารณาอนุมัติ</span>
          </a>
          <a href="#m9_2" class="p-4 bg-slate-50/70 border border-gray-200/70 hover:border-brand-teal hover:bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-2 group">
            <span class="text-xs font-bold text-brand-teal bg-teal-50 px-2 py-0.5 rounded-md w-max border border-teal-100">ม.9 (2)</span>
            <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">นโยบายและการตีความ</span>
          </a>
          <a href="#m9_3" class="p-4 bg-slate-50/70 border border-gray-200/70 hover:border-brand-teal hover:bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-2 group">
            <span class="text-xs font-bold text-brand-teal bg-teal-50 px-2 py-0.5 rounded-md w-max border border-teal-100">ม.9 (3)</span>
            <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">แผนงาน/โครงการงบประมาณ</span>
          </a>
          <a href="#m9_4" class="p-4 bg-slate-50/70 border border-gray-200/70 hover:border-brand-teal hover:bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-2 group">
            <span class="text-xs font-bold text-brand-teal bg-teal-50 px-2 py-0.5 rounded-md w-max border border-teal-100">ม.9 (4)</span>
            <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">คู่มือและคำสั่งการทำงาน</span>
          </a>
          <a href="#m9_5" class="p-4 bg-slate-50/70 border border-gray-200/70 hover:border-brand-teal hover:bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-2 group">
            <span class="text-xs font-bold text-brand-teal bg-teal-50 px-2 py-0.5 rounded-md w-max border border-teal-100">ม.9 (5)</span>
            <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">สิ่งพิมพ์ราชการ</span>
          </a>
          <a href="#m9_6" class="p-4 bg-slate-50/70 border border-gray-200/70 hover:border-brand-teal hover:bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-2 group">
            <span class="text-xs font-bold text-brand-teal bg-teal-50 px-2 py-0.5 rounded-md w-max border border-teal-100">ม.9 (6)</span>
            <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">สัญญาสัมปทาน / ร่วมทุน</span>
          </a>
          <a href="#m9_7" class="p-4 bg-slate-50/70 border border-gray-200/70 hover:border-brand-teal hover:bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-2 group">
            <span class="text-xs font-bold text-brand-teal bg-teal-50 px-2 py-0.5 rounded-md w-max border border-teal-100">ม.9 (7)</span>
            <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">มติคณะรัฐมนตรี / คำสั่ง</span>
          </a>
          <a href="#m9_8" class="p-4 bg-slate-50/70 border border-gray-200/70 hover:border-brand-teal hover:bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-2 group">
            <span class="text-xs font-bold text-brand-teal bg-teal-50 px-2 py-0.5 rounded-md w-max border border-teal-100">ม.9 (8)</span>
            <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">ข้อมูลข่าวสารอื่นที่กำหนด</span>
          </a>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

window.renderIndexFilesView = renderIndexFilesView;
