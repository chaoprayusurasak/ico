/**
 * Module: oic_sections.js
 * Dedicated minimal rendering module for OIC Legal Sections (มาตรา 7, มาตรา 9) and general file/folder views
 * Design: Sharp & Clean Rounded Corners (rounded-md / rounded-lg แทน rounded-2xl เพื่อความเฉียบคมและเป็นระเบียบ)
 */

window.oicSearchQuery = "";
window.oicSortOrder = "name"; // default sort order: name (ก-ฮ)

window.renderOicSectionsView = function (container, items, currentPage = 1, itemsPerPage = 8, breadcrumbStack = [], categoryHash = "", categoryTitle = "") {
  let html = ``;

  // 1. Update Page Header Banner (Matching Reference Image: Soft Grey Banner + Dark Title + / Breadcrumbs)
  const titleEl = document.querySelector(".content-title");
  if (titleEl) {
    titleEl.textContent = categoryTitle || 'ข้อมูลข่าวสาร';
  }

  const breadcrumbEl = document.getElementById("content-breadcrumb");
  if (breadcrumbEl) {
    let bHTML = `
      <a href="#home" onclick="navigateToPublicBreadcrumb(-1)" class="hover:underline hover:text-[#008675] text-slate-900 font-bold">หน้าหลัก</a>
      <span class="text-slate-600 font-normal">/</span>
      <span class="${breadcrumbStack && breadcrumbStack.length > 0 ? 'text-slate-800 font-medium' : 'text-slate-900 font-bold'}">${categoryTitle || 'ข้อมูลข่าวสาร'}</span>
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

  // 2. Top Controls Bar: Search & Sort (Clean rounded-md inputs)
  html += `
    <div class="flex items-center justify-end gap-3 flex-wrap sm:flex-nowrap mb-5 w-full">
      <!-- Search Box (Short & Compact, rounded-md) -->
      <div class="relative w-48 sm:w-60 shrink-0 ml-auto">
        <input type="text" id="oic-search-input" value="${window.oicSearchQuery}" oninput="onOicSearchInput(this.value)" placeholder="ค้นหา..." class="w-full pl-4 pr-9 py-2.5 bg-white border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/10 transition-all shadow-2xs">
        <i class="fi fi-rr-search absolute right-3 top-3 text-gray-400 text-sm pointer-events-none"></i>
      </div>

      <!-- Sort Dropdown (rounded-md) -->
      <div class="relative shrink-0">
        <select id="oic-sort-select" onchange="onOicSortChange(this.value)" class="py-2.5 pl-3 pr-8 bg-white border border-gray-300 rounded-md text-xs sm:text-sm font-semibold text-gray-700 focus:outline-none focus:border-brand-teal transition-all shadow-2xs cursor-pointer appearance-none">
          <option value="name" ${window.oicSortOrder === 'name' ? 'selected' : ''}>เรียงลำดับข้อมูล :ตามชื่อ (ก-ฮ)</option>
          <option value="newest" ${window.oicSortOrder === 'newest' ? 'selected' : ''}>เรียงลำดับข้อมูล :ที่มาใหม่</option>
          <option value="oldest" ${window.oicSortOrder === 'oldest' ? 'selected' : ''}>เรียงลำดับข้อมูล :ที่มาเก่า</option>
        </select>
        <i class="fi fi-rr-angle-small-down absolute right-2.5 top-3 text-gray-400 text-sm pointer-events-none"></i>
      </div>
    </div>
  `;

  // Filter out folder items to build Left Category Sidebar and sort ascending by created_at (Uploaded first -> top to bottom)
  const allFoldersInContext = (items || []).filter(item => Boolean(item.is_folder));
  allFoldersInContext.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));

  // 3. Main 2-Column Container (Left Sidebar + Right Table Panel aligned at same top height)
  html += `<div class="flex flex-col md:flex-row gap-6 items-start">`;

  // --------------------------------------------------------------------------
  // LEFT SIDEBAR: กล่องหมวดหมู่ ( Category Folder Sidebar Widget - rounded-md / rounded-lg )
  // --------------------------------------------------------------------------
  html += `
    <div class="w-full md:w-72 lg:w-80 shrink-0 overflow-hidden">
      <!-- Dark Teal Widget Header (rounded-t-md, font-medium, text-xs sm:text-sm) -->
      <div class="bg-[#2F4F4F] text-white rounded-t-md px-5 py-3 font-medium text-xs sm:text-sm shadow-sm flex items-center justify-between">
        <span>หมวดหมู่</span>
      </div>
      
      <!-- White List Box with Clean Styling & Truncated Labels (rounded-b-md) -->
      <div class="bg-white rounded-b-md border border-gray-200/80 p-3 shadow-2xs">
        <ul class="flex flex-col gap-1.5 text-xs sm:text-sm text-gray-700">
          <!-- Item 1: ทั้งหมด (Main Title - font-semibold) -->
          <li>
            <button onclick="navigateToPublicBreadcrumb(${breadcrumbStack.length - 1})" class="w-full text-left flex items-center gap-2 text-brand-teal font-semibold py-2 px-3 bg-teal-50/80 rounded-md transition-all">
              <span class="w-2 h-2 rounded-full bg-brand-teal shrink-0"></span>
              <span class="truncate block min-w-0 flex-1">ทั้งหมด</span>
            </button>
          </li>

          <!-- Dynamic Subfolders List (Uploaded First, Slim Font Weight, Single-line Truncate with ...) -->
          ${allFoldersInContext.length > 0 ? allFoldersInContext.map(folder => {
    const escapedTitle = (folder.title || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
    return `
              <li>
                <button onclick="openPublicFolder('${folder.id}', '${escapedTitle}')" title="${escapedTitle}" class="w-full text-left flex items-center gap-2 text-gray-600 hover:text-brand-teal hover:bg-slate-50 py-1.5 px-3 rounded-md transition-all group font-normal hover:font-medium">
                  <span class="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-brand-teal shrink-0"></span>
                  <span class="truncate block min-w-0 flex-1 text-xs sm:text-sm">${folder.title}</span>
                </button>
              </li>
            `;
  }).join('') : `
            <li class="text-gray-400 text-xs italic px-3 py-2">ไม่มีโฟลเดอร์ย่อย</li>
          `}
        </ul>
      </div>
    </div>
  `;

  // --------------------------------------------------------------------------
  // RIGHT MAIN PANEL: Dark Table Header + Document Files List
  // --------------------------------------------------------------------------
  html += `<div class="flex-1 min-w-0 w-full">`;

  // Filter & Sort Items Logic for the Right Main Panel
  let filteredItems = (items || []).slice();

  if (window.oicSearchQuery.trim()) {
    const q = window.oicSearchQuery.trim().toLowerCase();
    filteredItems = filteredItems.filter(item =>
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  }

  if (window.oicSortOrder === "newest") {
    filteredItems.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  } else if (window.oicSortOrder === "oldest") {
    filteredItems.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
  } else if (window.oicSortOrder === "name") {
    filteredItems.sort((a, b) => (a.title || "").localeCompare(b.title || "", "th"));
  }

  // Ensure folders stay on top in main list if any
  filteredItems.sort((a, b) => (Boolean(b.is_folder) ? 1 : 0) - (Boolean(a.is_folder) ? 1 : 0));

  // Dark Teal Table Header Bar (rounded-md, font-medium, text-xs sm:text-sm)
  html += `
    <div class="bg-[#2F4F4F] text-white rounded-md px-5 py-3 mb-4 flex items-center justify-between font-medium text-xs sm:text-sm shadow-sm">
      <div class="flex-1">ชื่อไฟล์</div>
      <div class="w-24 text-center hidden md:block">ขนาด</div>
      <div class="w-32 text-right">ดาวน์โหลด</div>
    </div>
  `;

  // Empty State
  if (filteredItems.length === 0) {
    html += `
      <div class="flex flex-col items-center justify-center py-16 gap-3 text-gray-400 text-center bg-[#f8f9fa] rounded-md border border-gray-200">
        <div class="w-14 h-14 rounded-full bg-white flex items-center justify-center text-xl text-gray-300 mb-1 shadow-2xs">
          <i class="fi fi-rr-inbox"></i>
        </div>
        <p class="text-sm font-medium text-gray-500">ไม่พบข้อมูลในรายการนี้</p>
      </div>
    `;
    html += `</div></div>`; // Close panel & outer container
    container.innerHTML = html;
    return;
  }

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToShow = filteredItems.slice(startIndex, endIndex);

  // File & Folder List Items (font-normal / font-medium slim titles)
  html += `<div class="flex flex-col gap-4">`;

  itemsToShow.forEach(item => {
    const formattedDate = item.created_at ? new Date(item.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
    const isFolder = Boolean(item.is_folder);
    const itemKeyId = item.id || hashCode(item.title || '');
    const views = getStoredDownloadCount(item);

    if (isFolder) {
      // 📁 macOS Big Sur Style Folder Item Row (font-normal slim & smaller title)
      const escapedTitle = (item.title || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
      html += `
        <div class="bg-[#f8f9fa] rounded-md p-3.5 md:p-4 shadow-xs hover:shadow-md transition-all duration-300 border border-gray-200/80">
          <h3 class="font-normal text-sm sm:text-base text-gray-800 mb-2 leading-snug whitespace-normal break-words">${item.title}</h3>
          
          <div onclick="openPublicFolder('${item.id}', '${escapedTitle}')" class="bg-white rounded-md p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-200 shadow-2xs hover:border-brand-teal transition-all cursor-pointer group">
            <div class="flex items-center gap-3 flex-1">
              <!-- macOS Glossy Blue Folder Icon (mariotreo650 style) -->
              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <svg class="w-7 h-7 drop-shadow-xs" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 16C7 13.2386 9.23858 11 12 11H24.5C26.1569 11 27.6953 11.8213 28.5912 13.2003L30.8 16.6H52C54.7614 16.6 57 18.8386 57 21.6V48C57 50.7614 54.7614 53 52 53H12C9.23858 53 7 50.7614 7 48V16Z" fill="url(#mac_folder_back_${item.id || 'def'})" />
                  <path d="M7 22C7 19.2386 9.23858 17 12 17H52C54.7614 17 57 19.2386 57 22V48C57 50.7614 54.7614 53 52 53H12C9.23858 53 7 50.7614 7 48V22Z" fill="url(#mac_folder_front_${item.id || 'def'})" />
                  <path d="M8 23H56V25H8V23Z" fill="white" opacity="0.3"/>
                  <defs>
                    <linearGradient id="mac_folder_back_${item.id || 'def'}" x1="32" y1="11" x2="32" y2="53" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#2563EB"/>
                      <stop offset="1" stop-color="#1D4ED8"/>
                    </linearGradient>
                    <linearGradient id="mac_folder_front_${item.id || 'def'}" x1="32" y1="17" x2="32" y2="53" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#60A5FA"/>
                      <stop offset="1" stop-color="#2563EB"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="font-normal text-xs sm:text-sm text-gray-800 group-hover:text-amber-600 transition-colors leading-snug whitespace-normal break-words">${item.title}</h4>
                ${formattedDate ? `<div class="mt-0.5 text-[11px] text-gray-400 font-normal">${formattedDate}</div>` : ''}
              </div>
            </div>

            <div class="w-24 text-center hidden md:block text-xs font-normal text-gray-400">
              -
            </div>

            <div class="w-32 flex items-center justify-end gap-2 shrink-0">
              <button class="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs rounded-md shadow-xs transition-all inline-flex items-center gap-1.5">
                <i class="fi fi-rr-folder-open text-[11px]"></i> เปิดดูเอกสาร
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      // 📄 Ext PDF Filetype Icon (font-normal slim & smaller title)
      const elemSizeId = `file-size-${itemKeyId}`;
      let displaySize = '-';

      if (item.file_size && Number(item.file_size) > 0) {
        displaySize = formatBytes(Number(item.file_size));
      } else if (item.file_url) {
        displaySize = 'กำลังคำนวณ...';
        setTimeout(() => fetchAndSetFileSize(item.file_url, elemSizeId), 50);
      } else {
        displaySize = 'ไม่ระบุ';
      }

      const escapedTitle = (item.title || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
      const escapedUrl = (item.file_url || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');

      html += `
        <div class="bg-[#f8f9fa] rounded-md p-3.5 md:p-4 shadow-xs hover:shadow-md transition-all duration-300 border border-gray-200/80">
          <h3 class="font-normal text-sm sm:text-base text-gray-800 mb-2 leading-snug whitespace-normal break-words">${item.title}</h3>
          
          <div class="bg-white rounded-md p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-200 shadow-2xs hover:border-teal-300 transition-all group">
            <div class="flex items-start sm:items-center gap-3 flex-1">
              <!-- Ext PDF File Icon with Red PDF Extension Badge -->
              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <svg class="w-7 h-7 drop-shadow-xs" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="12" y="6" width="40" height="52" rx="6" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
                  <path d="M38 6V18H52" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2"/>
                  <path d="M38 6L52 18H38V6Z" fill="#94A3B8"/>
                  <rect x="8" y="32" width="48" height="20" rx="5" fill="#E11D48"/>
                  <text x="32" y="46" font-family="'Kanit', sans-serif" font-weight="900" font-size="12" fill="white" text-anchor="middle" letter-spacing="1">PDF</text>
                </svg>
              </div>
              
              <div class="flex-1">
                <a ${item.file_url ? `href="${item.file_url}" target="_blank"` : (item.link ? `href="${item.link}" target="_blank"` : '')} class="font-normal text-xs sm:text-sm text-gray-800 hover:text-brand-teal transition-colors leading-snug whitespace-normal break-words block cursor-pointer">
                  ${item.title}
                </a>
                <div class="flex items-center gap-2.5 mt-1 text-[11px] text-gray-400 flex-wrap font-normal">
                  <span>${formattedDate || 'ไม่ระบุวันที่'}</span>
                  ${item.description ? `<span class="text-gray-500 font-normal whitespace-normal break-words">${item.description}</span>` : ''}
                </div>
              </div>
            </div>

            <!-- File Size -->
            <div id="${elemSizeId}" class="w-24 text-center hidden md:block text-xs font-normal text-gray-500">
              ${displaySize}
            </div>

            <!-- Downloads Count & Action Button -->
            <div class="w-36 flex items-center justify-end gap-3 shrink-0">
              <span id="download-count-${itemKeyId}" class="text-xs text-gray-500 font-medium inline-flex items-center gap-1">
                <i class="fi fi-rr-download text-gray-400"></i> ${views.toLocaleString()} ครั้ง
              </span>

              ${item.file_url ? `
                <button onclick="downloadFile(event, '${escapedUrl}', '${escapedTitle}', '${itemKeyId}')" title="ดาวน์โหลดไฟล์จริง" class="w-8 h-8 rounded-md bg-gray-100 hover:bg-brand-teal hover:text-white text-gray-600 flex items-center justify-center transition-all shadow-2xs cursor-pointer">
                  <i class="fi fi-rr-download text-xs"></i>
                </button>
              ` : (item.link ? `
                <a href="${item.link}" target="_blank" title="เปิดลิงก์" class="w-8 h-8 rounded-md bg-gray-100 hover:bg-brand-teal hover:text-white text-gray-600 flex items-center justify-center transition-all shadow-2xs">
                  <i class="fi fi-rr-link text-xs"></i>
                </a>
              ` : '')}
            </div>
          </div>
        </div>
      `;
    }
  });

  html += `</div>`; // Close list container

  // Pagination Controls
  if (totalPages > 1 && typeof renderPaginationControls === "function") {
    html += renderPaginationControls(totalPages);
  }

  html += `</div></div>`; // Close Right Panel & Outer Flex Container

  container.innerHTML = html;
};

// Helper Search & Sort Event Listeners
window.onOicSearchInput = function (val) {
  window.oicSearchQuery = val;
  const boxEl = document.querySelector(".content-box");
  const hash = window.location.hash.replace("#", "") || "home";
  if (boxEl && typeof loadCategoryItems === "function") {
    loadCategoryItems(hash);
  }
};

window.onOicSortChange = function (val) {
  window.oicSortOrder = val;
  const boxEl = document.querySelector(".content-box");
  const hash = window.location.hash.replace("#", "") || "home";
  if (boxEl && typeof loadCategoryItems === "function") {
    loadCategoryItems(hash);
  }
};

// Cache for fetched file sizes to prevent duplicate network calls
window.fileSizeCache = window.fileSizeCache || {};

// Simple Hash Helper
function hashCode(str) {
  let hash = 0;
  if (!str) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

// Get Persistent Download Count Helper (LocalStorage + Database fallback)
function getStoredDownloadCount(item) {
  if (!item) return 0;
  const key = `dl_cnt_${item.id || hashCode(item.title || '')}`;
  const localVal = localStorage.getItem(key);
  if (localVal !== null && !isNaN(localVal)) {
    return parseInt(localVal, 10);
  }
  if (item.download_count !== undefined && item.download_count !== null && !isNaN(item.download_count)) {
    return Number(item.download_count);
  }
  if (item.view_count !== undefined && item.view_count !== null && !isNaN(item.view_count)) {
    return Number(item.view_count);
  }
  return 0;
}
window.getStoredDownloadCount = getStoredDownloadCount;

// Format Bytes Helper
function formatBytes(bytes, decimals = 1) {
  if (bytes === null || bytes === undefined || isNaN(bytes) || Number(bytes) <= 0) return '-';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
window.formatBytes = formatBytes;

/**
 * Fetch file size via HEAD request if not available in database record
 */
async function fetchAndSetFileSize(url, elementId) {
  if (!url || !elementId) return;
  const el = document.getElementById(elementId);
  if (!el) return;

  if (window.fileSizeCache[url]) {
    el.textContent = window.fileSizeCache[url];
    return;
  }

  try {
    const res = await fetch(url, { method: 'HEAD' });
    if (res.ok) {
      const length = res.headers.get('content-length');
      if (length && !isNaN(length) && Number(length) > 0) {
        const formatted = formatBytes(Number(length));
        window.fileSizeCache[url] = formatted;
        const currentEl = document.getElementById(elementId);
        if (currentEl) currentEl.textContent = formatted;
        return;
      }
    }
  } catch (e) {
    console.warn("Could not fetch file size via HEAD:", e);
  }

  const currentEl = document.getElementById(elementId);
  if (currentEl && (currentEl.textContent === 'กำลังคำนวณ...' || currentEl.textContent === '...')) {
    currentEl.textContent = 'ไม่ระบุ';
  }
}
window.fetchAndSetFileSize = fetchAndSetFileSize;

/**
 * Real file download handler: fetches blob to trigger actual browser file save prompt & updates download counter persistently
 */
async function downloadFile(event, url, fileName, itemId) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (!url) {
    alert("ไม่พบลิงก์เอกสารสำหรับดาวน์โหลด");
    return;
  }

  const btn = event ? (event.currentTarget || event.target) : null;
  let oldHTML = "";
  if (btn) {
    oldHTML = btn.innerHTML;
    btn.innerHTML = `<i class="fi fi-rr-spinner animate-spin text-xs"></i>`;
    btn.style.pointerEvents = "none";
  }

  // 1. Persistent Storage in LocalStorage & Supabase
  const countKey = `dl_cnt_${itemId || url}`;
  let currentCount = 0;
  const savedVal = localStorage.getItem(countKey);
  if (savedVal !== null && !isNaN(savedVal)) {
    currentCount = parseInt(savedVal, 10);
  }
  const newCount = currentCount + 1;
  localStorage.setItem(countKey, newCount);

  const countEl = document.getElementById(`download-count-${itemId}`);
  if (countEl) {
    countEl.innerHTML = `<i class="fi fi-rr-download text-gray-400"></i> ${newCount.toLocaleString()} ครั้ง`;
  }

  // Also sync to Supabase in background
  if (itemId && (window.supabase || typeof supabase !== "undefined")) {
    const sb = window.supabase || supabase;
    try {
      const targetTable = window.ACTIVE_TABLE_NAME || 'oic_documents';
      await sb
        .from(targetTable)
        .update({ view_count: newCount, download_count: newCount })
        .eq("id", itemId);
    } catch (err) {
      console.warn("Could not update download count in Supabase:", err);
    }
  }

  // 2. Real Download via Blob Fetch
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP status ${response.status}`);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;

    let cleanName = (fileName || '').trim() || url.split('/').pop().split('?')[0] || 'document';
    cleanName = cleanName.replace(/[/\\?%*:|"<>]/g, '_');
    if (!cleanName.toLowerCase().endsWith('.pdf') && !cleanName.includes('.')) {
      cleanName += '.pdf';
    }
    a.download = cleanName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
  } catch (err) {
    console.warn("Blob fetch failed, fallback to direct link open:", err);
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.download = fileName || "document.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } finally {
    if (btn) {
      btn.innerHTML = oldHTML;
      btn.style.pointerEvents = "auto";
    }
  }
}
window.downloadFile = downloadFile;

