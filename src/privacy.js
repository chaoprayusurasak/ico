// ============================================================
// privacy.js - Privacy Policy View Component
// (#privacy page standalone module)
// ============================================================

function renderPrivacyView(container, items = []) {
  if (!container) return;

  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-20 gap-3 text-gray-400 text-center font-prompt min-h-[300px]">
        <i class="fi fi-rr-shield-check text-5xl text-brand-teal opacity-40"></i>
        <p class="text-sm font-medium">ยังไม่มีรายการนโยบายการคุ้มครองข้อมูลส่วนบุคคล</p>
      </div>
    `;
    return;
  }

  let html = `<div class="grid grid-cols-1 md:grid-cols-2 gap-6 py-2 font-prompt">`;

  items.forEach(item => {
    const formattedDate = item.created_at ? new Date(item.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : '';

    html += `
      <div class="p-6 md:p-7 bg-white border border-gray-200/80 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between min-h-[260px] gap-4 w-full">
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-50 text-brand-teal text-xs font-bold border border-teal-100/80 shadow-2xs">
              <i class="fi fi-rr-shield-check"></i> นโยบายคุ้มครองข้อมูลส่วนบุคคล
            </span>
            ${formattedDate ? `<span class="text-xs text-gray-400 font-normal flex items-center gap-1"><i class="fi fi-rr-clock"></i> ${formattedDate}</span>` : ''}
          </div>
          <h4 class="font-bold text-base md:text-lg text-gray-800 leading-snug mb-2">${item.title || ''}</h4>
          ${item.description ? `<p class="text-xs md:text-sm text-gray-600 leading-relaxed line-clamp-4">${item.description}</p>` : ''}
        </div>
        <div class="flex items-center gap-2 pt-3 border-t border-gray-100 mt-auto">
          ${item.file_url ? `
            <a href="${item.file_url}" target="_blank" download class="px-4 py-2 bg-brand-teal text-white font-bold text-xs rounded-xl shadow-sm hover:bg-teal-700 transition-all inline-flex items-center gap-1.5 cursor-pointer">
              <i class="fi fi-rr-download"></i> ดาวน์โหลดเอกสาร
            </a>
          ` : ''}
          ${item.link ? `
            <a href="${item.link}" target="_blank" class="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200 transition-all inline-flex items-center gap-1.5 cursor-pointer">
              <i class="fi fi-rr-link"></i> เปิดลิงก์
            </a>
          ` : ''}
          ${!item.file_url && !item.link ? `
            <span class="text-xs text-gray-400 font-normal">ไม่มีเอกสารแนบ</span>
          ` : ''}
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
}

window.renderPrivacyView = renderPrivacyView;
