/**
 * Module: news_sbr.js
 * Handles rendering for "ข่าวสารจาก สขร." (News from OIC/SBR)
 */

window.renderNewsSbrView = function (container, items, currentPage = 1, itemsPerPage = 6, breadcrumbStack = []) {
  let html = ``;

  // Hide breadcrumbs line specifically on news_sbr page
  const breadcrumbEl = document.getElementById("content-breadcrumb");
  if (breadcrumbEl) {
    breadcrumbEl.style.display = "none";
  }
    let bHTML = `
      <a href="#home" onclick="navigateToPublicBreadcrumb(-1)" class="hover:underline text-gray-600">หน้าหลัก</a>
      <span class="text-gray-400">/</span>
      <a href="#news_sbr" onclick="navigateToPublicBreadcrumb(-1)" class="hover:underline text-gray-600">ข่าวสารจาก สขร.</a>
    `;
    if (breadcrumbStack && breadcrumbStack.length > 0) {
      breadcrumbStack.forEach((folder, idx) => {
        bHTML += `
          <span class="text-gray-400">/</span>
          <button onclick="navigateToPublicBreadcrumb(${idx})" class="hover:underline ${idx === breadcrumbStack.length - 1 ? 'text-amber-600 font-semibold' : 'text-gray-600'}">
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
        <p class="text-sm font-medium">ยังไม่มีข้อมูลข่าวสาร หรือแฟ้มย่อยในระดับนี้</p>
      </div>
    `;
    container.innerHTML = html;
    return;
  }

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToShow = items.slice(startIndex, endIndex);

  // เพิ่มแบนเนอร์ด้านบนสุดสำหรับหน้า ข่าวสาร สขร. (เฉพาะหน้า 1 และไม่ได้อยู่ในโฟลเดอร์ย่อย)
  if (currentPage === 1 && (!breadcrumbStack || breadcrumbStack.length === 0)) {
    html += `
      <div class="w-100 h-80 md:h-85 rounded-2xl overflow-hidden shadow-sm relative bg-gray-100 mb-4">
        <video src="./assets/Man_in_uniform_and_statue_202607091447.mp4" class="w-full h-80 object-cover object-top" autoplay loop muted playsinline></video>
      </div>
    `;
  }

  // Layout แบบ Grid 3 คอลัมน์สำหรับหน้าข่าวสาร
  html += `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-2">`;

  itemsToShow.forEach(item => {
    const defaultImg = "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80";
    const img = item.image_url || defaultImg;
    const formattedDate = item.created_at ? new Date(item.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
    const isFolder = Boolean(item.is_folder);

    if (isFolder) {
      const escapedTitle = (item.title || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
      html += `
        <div onclick="openPublicFolder('${item.id}', '${escapedTitle}')" class="group p-6 bg-gradient-to-b from-teal-50/30 via-white to-white border border-gray-200/80 hover:border-brand-teal rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between gap-4 cursor-pointer">
          <div class="flex items-start justify-between gap-3">
            <div class="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <i class="fi fi-rr-folder"></i>
            </div>
            <span class="px-3 py-1 bg-amber-100/80 text-amber-800 font-bold text-[11px] rounded-full border border-amber-200">
              <i class="fi fi-rr-folder-tree"></i> แฟ้มย่อย
            </span>
          </div>
          <div>
            <h3 class="font-bold text-base text-gray-800 group-hover:text-amber-700 transition-colors leading-snug">${item.title}</h3>
            ${item.description ? `<p class="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">${item.description}</p>` : ''}
          </div>
          <div class="pt-3 border-t border-amber-100/80 flex items-center justify-between text-xs font-bold text-amber-600 group-hover:text-amber-700">
            <span>เปิดดูเอกสารภายใน</span>
            <i class="fi fi-rr-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="relative rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_45px_rgba(0,134,117,0.22)] hover:-translate-y-1.5 transition-all duration-500 group h-80 sm:h-96 flex flex-col justify-end border border-gray-100/50">
          <img src="${img}" alt="${item.title}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out z-0">
          <div class="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#002b26] via-[#004d43]/70 to-transparent z-10 transition-opacity duration-300"></div>

          <div class="relative z-20 p-5 sm:p-6 text-white flex flex-col justify-end h-full">
            <div class="mt-auto">
              <div class="flex items-center gap-1.5 text-xs font-semibold text-teal-200 uppercase tracking-wider mb-2">
                <i class="fi fi-rr-calendar text-[11px]"></i> ${formattedDate}
              </div>
              <h3 class="text-lg sm:text-xl font-bold leading-snug text-white drop-shadow-sm line-clamp-2 group-hover:text-teal-100 transition-colors mb-2">${item.title}</h3>
              ${item.description ? `<p class="text-xs text-teal-100/90 line-clamp-2 mb-4 font-normal leading-relaxed">${item.description}</p>` : ''}
              
              <div class="flex items-center gap-2 pt-3 border-t border-white/20">
                ${item.link ? `
                  <a href="${item.link}" target="_blank" class="flex-1 py-2 px-3 bg-white/20 hover:bg-white text-white hover:text-[#005a4e] backdrop-blur-md font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm">
                    <i class="fi fi-rr-link"></i> ลิงก์
                  </a>
                ` : ''}
                ${item.file_url ? `
                  <button onclick="downloadFile(event, '${(item.file_url || '').replace(/'/g, "\\'")}', '${(item.title || '').replace(/'/g, "\\'")}', '${item.id || ''}')" class="flex-2 py-2 px-3 bg-brand-teal text-white hover:bg-white hover:text-[#005a4e] font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                    <i class="fi fi-rr-download"></i> ดาวน์โหลด
                  </button>
                ` : ''}
                ${!item.link && !item.file_url ? `
                  <div class="flex-1 py-2 px-3 bg-white/10 text-white/50 font-medium text-xs rounded-xl flex items-center justify-center cursor-not-allowed">
                    ไม่มีเอกสารแนบ
                  </div>
                ` : ''}
              </div>
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
