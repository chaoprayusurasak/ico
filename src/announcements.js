/**
 * Module: announcements.js
 * Handles rendering for "ประกาศล่าสุด" (Announcements)
 */

window.renderAnnouncementsView = function (container, items, currentPage = 1, itemsPerPage = 8, breadcrumbStack = []) {
  let html = ``;

  // Sync Public Breadcrumb Navigation with top page header banner
  const breadcrumbEl = document.getElementById("content-breadcrumb");
  if (breadcrumbEl) {
    let bHTML = `
      <a href="#home" onclick="navigateToPublicBreadcrumb(-1)" class="hover:underline hover:text-[#008675] text-slate-900 font-bold">หน้าหลัก</a>
      <span class="text-slate-600 font-normal">/</span>
      <a href="#announcements" onclick="navigateToPublicBreadcrumb(-1)" class="hover:underline hover:text-[#008675] ${breadcrumbStack && breadcrumbStack.length > 0 ? 'text-slate-800 font-medium' : 'text-slate-900 font-bold'}">ประกาศล่าสุด</a>
    `;
    if (breadcrumbStack && breadcrumbStack.length > 0) {
      breadcrumbStack.forEach((folder, idx) => {
        bHTML += `
          <span class="text-slate-600 font-normal">/</span>
          <button onclick="navigateToPublicBreadcrumb(${idx})" class="hover:underline hover:text-[#008675] ${idx === breadcrumbStack.length - 1 ? 'text-[#008675] font-bold' : 'text-slate-800 font-medium'}">
            ${folder.title}
          </button>
        `;
      });
    }
    breadcrumbEl.innerHTML = bHTML;
  }

  if (!items || items.length === 0) {
    html += `
      <div class="flex flex-col items-center justify-center py-16 gap-3 text-gray-400 text-center">
        <i class="fi fi-rr-inbox text-4xl"></i>
        <p class="text-sm font-medium">ยังไม่มีประกาศล่าสุด หรือแฟ้มย่อยในระดับนี้</p>
      </div>
    `;
    container.innerHTML = html;
    return;
  }

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToShow = items.slice(startIndex, endIndex);

  html += `<div class="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">`;

  itemsToShow.forEach(item => {
    const formattedDate = item.created_at ? new Date(item.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
    const img = item.image_url;
    const isFolder = Boolean(item.is_folder);

    if (isFolder) {
      const escapedTitle = (item.title || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
      html += `
        <div onclick="openPublicFolder('${item.id}', '${escapedTitle}')" class="group p-6 bg-gradient-to-b from-teal-50/30 via-white to-white border border-gray-200/80 hover:border-brand-teal rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between gap-5 cursor-pointer">
          <div class="flex items-start justify-between gap-3">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <i class="fi fi-rr-folder"></i>
            </div>
            <span class="px-3 py-1 bg-amber-100/90 text-amber-800 font-bold text-xs rounded-full border border-amber-200">
              <i class="fi fi-rr-folder-tree"></i> แฟ้มประกาศย่อย
            </span>
          </div>
          <div>
            <h3 class="font-bold text-lg text-gray-800 group-hover:text-amber-700 transition-colors leading-snug">${item.title}</h3>
            ${item.description ? `<p class="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2 font-normal">${item.description}</p>` : ''}
          </div>
          <div class="pt-3 border-t border-amber-100/80 flex items-center justify-between text-xs font-bold text-amber-600 group-hover:text-amber-700">
            <span class="flex items-center gap-1.5"><i class="fi fi-rr-folder-open"></i> เข้าสู่แฟ้มประกาศ</span>
            <i class="fi fi-rr-arrow-right text-sm group-hover:translate-x-1 transition-transform"></i>
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="bg-white border border-teal-900/10 rounded-3xl overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(0,134,117,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full w-full">
          ${img ? `
            <div class="w-full h-64 sm:h-72 overflow-hidden border-b border-gray-100 relative group">
              <img src="${img}" alt="${item.title}" class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500">
            </div>
          ` : ''}
          <div class="p-8 sm:p-6 flex flex-col justify-between flex-1 gap-4">
            <div>
              <div class="flex items-center gap-1.5 text-xs font-semibold text-brand-teal mb-2">
                <i class="fi fi-rr-megaphone text-[11px]"></i> ${formattedDate}
              </div>
              <h3 class="text-base sm:text-lg font-bold text-gray-800 leading-snug line-clamp-3 mb-2 hover:text-brand-teal transition-colors">${item.title}</h3>
              ${item.description ? `<p class="text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed font-normal">${item.description}</p>` : ''}
            </div>

            <div class="flex items-center gap-2 pt-3 border-t border-gray-100 mt-auto">
              ${item.link ? `
                <a href="${item.link}" target="_blank" class="flex-1 py-2 px-3 bg-teal-50 text-brand-teal hover:bg-brand-teal hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border border-teal-100/80 shadow-2xs">
                  <i class="fi fi-rr-link"></i> ลิงก์รายละเอียด
                </a>
              ` : ''}
              ${item.file_url ? `
                <button onclick="downloadFile(event, '${(item.file_url || '').replace(/'/g, "\\'")}', '${(item.title || '').replace(/'/g, "\\'")}', '${item.id || ''}')" class="flex-1 py-2 px-3 bg-brand-teal text-white hover:bg-teal-700 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                  <i class="fi fi-rr-download"></i> ดาวน์โหลดประกาศ
                </button>
              ` : ''}
              ${!item.link && !item.file_url ? `
                <div class="flex-1 py-2 px-3 bg-gray-50 text-gray-400 font-normal text-xs rounded-xl flex items-center justify-center cursor-not-allowed">
                  ไม่มีเอกสารแนบ
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }
  });

  html += `</div>`;

  if (totalPages > 1 && typeof renderPaginationControls === "function") {
    html += renderPaginationControls(totalPages);
  }

  container.innerHTML = html;
};
