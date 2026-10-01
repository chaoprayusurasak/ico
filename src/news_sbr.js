/**
 * Module: news_sbr.js
 * Handles rendering for "ข่าวสารจาก สขร." (News from OIC/SBR)
 */

window.renderNewsSbrView = function (container, items, currentPage = 1, itemsPerPage = 6, breadcrumbStack = []) {
  let html = ``;
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);

  // Hide top page header banner on #news_sbr page
  const headerBanner = document.getElementById("page-header-banner");
  if (headerBanner) {
    headerBanner.style.display = "none";
  }

  // Render Subfolder inline breadcrumbs when inside a subfolder
  if (breadcrumbStack && breadcrumbStack.length > 0) {
    let bNav = `
      <div class="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-800 mb-4 bg-slate-50/80 p-3 rounded-xl border border-slate-200">
        <a href="#home" onclick="navigateToPublicBreadcrumb(-1)" class="hover:underline hover:text-[#065757] text-slate-900 font-bold">หน้าหลัก</a>
        <span class="text-slate-400">/</span>
        <a href="#news_sbr" onclick="navigateToPublicBreadcrumb(-1)" class="hover:underline hover:text-[#065757] text-slate-800">ข่าวสารจาก สขร.</a>
    `;
    breadcrumbStack.forEach((folder, idx) => {
      bNav += `
        <span class="text-slate-400">/</span>
        <button onclick="navigateToPublicBreadcrumb(${idx})" class="hover:underline hover:text-[#065757] ${idx === breadcrumbStack.length - 1 ? 'text-[#065757] font-bold' : 'text-slate-700 font-medium'}">
          ${folder.title}
        </button>
      `;
    });
    bNav += `</div>`;
    html += bNav;
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
      <div class="relative w-full pt-10 sm:pt-14 md:pt-16 pb-2 mb-4 sm:mb-6 overflow-visible">
        <div class="group relative w-full h-36 sm:h-44 md:h-52 rounded-2xl md:rounded-3xl bg-gradient-to-r from-[#eef4f3] via-slate-50 to-[#f3f8f7] border border-slate-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_45px_rgba(6,87,87,0.18)] hover:border-[#065757]/30 transition-all duration-500 flex items-center justify-between cursor-pointer select-none overflow-visible">
          
          <!-- Left Unified Green Backdrop Behind Portrait (Continuous angled polygon, no white gaps) -->
          <div class="absolute inset-y-0 left-0 w-48 sm:w-64 md:w-80 bg-[#065757] rounded-l-2xl md:rounded-l-3xl overflow-hidden pointer-events-none"
               style="clip-path: polygon(0 0, 100% 0, calc(100% - 40px) 100%, 0 100%); -webkit-clip-path: polygon(0 0, 100% 0, calc(100% - 40px) 100%, 0 100%);">
            <div class="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent"></div>
          </div>

          <!-- Popping Out Person Image (Upper head pops out top, body neatly clipped to card frame at bottom/left) -->
          <div class="absolute inset-y-0 left-0 w-44 sm:w-64 md:w-80 pointer-events-none z-20 overflow-visible"
               style="clip-path: inset(-160px 0px 0px 0px round 24px 0 0 24px); -webkit-clip-path: inset(-160px 0px 0px 0px round 24px 0 0 24px);">
            <img src="./assets/นายก.png" alt="นายกเทศมนตรี" 
                 class="absolute bottom-0 left-2 sm:left-6 md:left-8 h-[125%] sm:h-[135%] md:h-[142%] max-w-none object-contain object-bottom filter drop-shadow-[0_10px_16px_rgba(0,0,0,0.25)] group-hover:scale-105 group-hover:-translate-y-1.5 transition-transform duration-500 ease-out origin-bottom">
          </div>

          <!-- Spacer so right content doesn't collide with person portrait -->
          <div class="w-32 sm:w-52 md:w-64 flex-shrink-0 pointer-events-none"></div>

          <!-- Title Content on Right -->
          <div class="relative z-10 flex-1 flex flex-col justify-center items-center px-4 sm:px-8 text-center">
            <span class="text-[10px] sm:text-xs md:text-sm font-extrabold tracking-widest text-[#05afae] uppercase mb-1 drop-shadow-xs">
              OIC NEWS & ANNOUNCEMENTS
            </span>
            <h2 class="text-xl sm:text-3xl md:text-4xl lg:text-[44px] font-black text-[#065757] tracking-tight leading-none uppercase group-hover:text-[#05afae] transition-colors duration-300">
              ข่าวสารจาก สขร
            </h2>
            <p class="text-[11px] sm:text-xs md:text-sm font-semibold text-slate-500 mt-1 sm:mt-2 hidden sm:block">
              ศูนย์ข้อมูลข่าวสารเทศบาลนครเจ้าพระยาสุรศักดิ์
            </p>
          </div>

          <!-- Decorative Right Colored Border Accent -->
          <div class="absolute right-0 top-0 bottom-0 w-2.5 sm:w-3.5 bg-gradient-to-b from-[#05afae] to-[#065757] rounded-r-2xl md:rounded-r-3xl"></div>

          <!-- Pin Overlay on the Right Corner/Edge (assets/ปัก.png) -->
          <div class="absolute -top-8 sm:-top-11 md:-top-13 -right-2 sm:-right-4 md:-right-5 z-30 pointer-events-none select-none">
            <img src="./assets/ปัก.png" alt="หมุดปัก" 
                 class="w-16 sm:w-24 md:w-28 h-auto object-contain -scale-x-100 filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.32)] group-hover:-rotate-12 group-hover:-scale-x-110 group-hover:scale-y-110 transition-transform duration-500 ease-out origin-center">
          </div>
        </div>
      </div>
    `;
  }

  // Layout แบบ Grid 3 คอลัมน์สำหรับหน้าข่าวสาร
  html += `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-2">`;

  itemsToShow.forEach((item, itemIndex) => {
    const defaultImg = "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80";
    const img = item.image_url || defaultImg;
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
        <div data-news-detail-index="${itemIndex}" tabindex="0" role="button" aria-label="อ่านรายละเอียดข่าว: ${escapeHtml(item.title || "ข่าวสาร")}" class="relative rounded-none rounded-br-[40px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_45px_rgba(0,134,117,0.22)] hover:-translate-y-1.5 transition-all duration-500 group h-80 sm:h-96 flex flex-col justify-end border border-gray-100/50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
          <img src="${escapeHtml(img)}" alt="${escapeHtml(item.title || "ข่าวสาร")}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out z-0">
          <div class="absolute inset-0 bg-gradient-to-t from-[#002b26]/95 via-[#004d43]/30 to-transparent z-10 transition-opacity duration-300"></div>

          <span class="absolute left-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full bg-[#087d72] px-3 py-1.5 text-xs font-bold text-white shadow-lg">
            <i class="fi fi-rr-calendar text-[11px]"></i> ${escapeHtml(item.created_at ? new Date(item.created_at).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" }) : "ข่าวสาร")}
          </span>
          <div class="relative z-20 p-5 sm:p-6 text-white">
            <h3 class="text-lg sm:text-xl font-bold leading-snug text-white drop-shadow-sm line-clamp-2 group-hover:text-teal-100 transition-colors mb-3">${escapeHtml(item.title || "ข่าวสาร")}</h3>
            <div class="flex items-center gap-2 border-t border-white/25 pt-3 text-xs font-semibold text-teal-100">
              <i class="fi fi-rr-megaphone"></i>
              <span>ข่าวสารจาก สขร.</span>
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

  const openNewsDetail = (item) => {
    const detail = document.createElement("article");
    detail.className = "mt-10 mx-auto w-full bg-white px-4 py-5 text-slate-700 sm:px-8 sm:py-8";

    const heading = document.createElement("div");
    const sectionTitle = document.createElement("h2");
    sectionTitle.className = "text-sm font-bold text-teal-800";
    const breadcrumb = document.createElement("div");
    breadcrumb.className = "flex items-center gap-2 text-xs text-slate-600";
    const homeLink = document.createElement("a");
    homeLink.href = "#home";
    homeLink.className = "hover:text-teal-700 hover:underline";
    const separator = document.createElement("span");
    const newsCrumb = document.createElement("button");
    newsCrumb.type = "button";
    newsCrumb.className = "font-semibold text-slate-700 hover:text-teal-700 hover:underline";
    breadcrumb.append(homeLink, separator, newsCrumb);
    heading.append(sectionTitle, breadcrumb);
    detail.appendChild(heading);
    const titleRow = document.createElement("div");
    titleRow.className = "flex flex-col justify-between gap-2 border-b border-dashed border-teal-700/60 py-4 sm:flex-row sm:items-start";
    const title = document.createElement("h1");
    title.className = "text-base font-bold leading-relaxed text-teal-800 sm:text-lg";
    title.textContent = item.title || "ข่าวสาร";
    const date = document.createElement("time");
    date.className = "shrink-0 text-xs font-medium text-slate-600";
    if (item.created_at) {
      date.dateTime = item.created_at;
      date.textContent = new Date(item.created_at).toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
        year: "2-digit"
      });
    }
    titleRow.append(title, date);
    detail.appendChild(titleRow);

    if (item.image_url) {
      const imageWrap = document.createElement("div");
      imageWrap.className = "flex justify-center py-6 sm:py-8";
      const image = document.createElement("img");
      image.src = item.image_url;
      image.alt = item.title || "";
      image.className = "max-h-[65vh] max-w-full object-contain";
      imageWrap.appendChild(image);
      detail.appendChild(imageWrap);
    }

    const description = document.createElement("div");
    description.className = "whitespace-pre-wrap break-words py-5 text-sm leading-relaxed text-slate-700";
    description.textContent = item.description || "ไม่มีรายละเอียดเพิ่มเติม";
    detail.appendChild(description);

    const actions = document.createElement("div");
    actions.className = "flex flex-wrap gap-3 border-t border-dashed border-teal-700/60 py-5";
    if (item.link) {
      try {
        const linkUrl = new URL(item.link, window.location.href);
        if (linkUrl.protocol === "http:" || linkUrl.protocol === "https:") {
          const link = document.createElement("a");
          link.href = linkUrl.href;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.className = "inline-flex items-center gap-2 rounded-lg bg-teal-50 px-4 py-2 text-sm font-bold text-teal-800 hover:bg-teal-100";
          link.innerHTML = '<i class="fi fi-rr-link"></i> เปิดลิงก์ที่เกี่ยวข้อง';
          actions.appendChild(link);
        }
      } catch (error) {
        console.warn("ไม่สามารถเปิดลิงก์ข่าวได้:", error);
      }
    }
    if (item.file_url && typeof window.downloadFile === "function") {
      const downloadButton = document.createElement("button");
      downloadButton.type = "button";
      downloadButton.className = "inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-bold text-white hover:bg-teal-800";
      downloadButton.innerHTML = '<i class="fi fi-rr-download"></i> ดาวน์โหลดเอกสาร';
      downloadButton.addEventListener("click", event => {
        window.downloadFile(event, item.file_url, item.title || "ข่าวสาร", item.id || "");
      });
      actions.appendChild(downloadButton);
    }
    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className = "inline-flex items-center gap-2 rounded-lg border border-teal-700 px-4 py-2 text-sm font-bold text-teal-800 hover:bg-teal-50";
    backButton.innerHTML = '<i class="fi fi-rr-arrow-left"></i> กลับไปหน้ารายการข่าว';
    backButton.addEventListener("click", () => {
      window.renderNewsSbrView(container, items, currentPage, itemsPerPage, breadcrumbStack);
    });
    newsCrumb.addEventListener("click", () => backButton.click());
    actions.prepend(backButton);
    detail.appendChild(actions);

    const recommendedItems = items
      .filter(candidate => !candidate.is_folder && candidate !== item && !(item.id && candidate.id === item.id))
      .slice(0, 3);
    if (recommendedItems.length > 0) {
      const recommendedSection = document.createElement("section");
      recommendedSection.className = "mt-6 border-t border-dashed border-teal-700/60 pt-5";

      const recommendedHeading = document.createElement("h2");
      recommendedHeading.className = "mb-4 text-base font-bold text-teal-800";
      recommendedHeading.textContent = "ข่าวอื่นที่น่าสนใจ";
      recommendedSection.appendChild(recommendedHeading);

      const recommendedGrid = document.createElement("div");
      recommendedGrid.className = "grid grid-cols-1 gap-3 sm:grid-cols-3";

      recommendedItems.forEach(recommendedItem => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "group overflow-hidden border border-slate-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md  ";
        card.setAttribute("aria-label", `อ่านข่าว: ${recommendedItem.title || "ข่าวสาร"}`);

        if (recommendedItem.image_url) {
          const imageFrame = document.createElement("div");
          imageFrame.className = "h-40 overflow-hidden bg-slate-100";
          const image = document.createElement("img");
          image.src = recommendedItem.image_url;
          image.alt = "";
          image.className = "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105";
          imageFrame.appendChild(image);
          card.appendChild(imageFrame);
        }

        const cardContent = document.createElement("div");
        cardContent.className = "p-3";
        if (recommendedItem.created_at) {
          const cardDate = document.createElement("time");
          cardDate.className = "mb-1 block text-[11px] text-slate-500";
          cardDate.dateTime = recommendedItem.created_at;
          cardDate.textContent = new Date(recommendedItem.created_at).toLocaleDateString("th-TH", {
            day: "numeric",
            month: "short",
            year: "2-digit"
          });
          cardContent.appendChild(cardDate);
        }

        const cardTitle = document.createElement("span");
        cardTitle.className = "line-clamp-2 block text-xs font-semibold leading-relaxed text-slate-800 group-hover:text-teal-800";
        cardTitle.textContent = recommendedItem.title || "ข่าวสาร";
        cardContent.appendChild(cardTitle);
        card.appendChild(cardContent);

        card.addEventListener("click", () => openNewsDetail(recommendedItem));
        recommendedGrid.appendChild(card);
      });

      recommendedSection.appendChild(recommendedGrid);
      detail.appendChild(recommendedSection);
    }

    container.replaceChildren(detail);
  };

  container.querySelectorAll("[data-news-detail-index]").forEach(card => {
    const item = itemsToShow[Number(card.dataset.newsDetailIndex)];
    const isInteractive = target => target instanceof Element && target.closest("a, button");
    card.addEventListener("click", event => {
      if (!isInteractive(event.target)) openNewsDetail(item);
    });
    card.addEventListener("keydown", event => {
      if ((event.key === "Enter" || event.key === " ") && event.target === card) {
        event.preventDefault();
        openNewsDetail(item);
      }
    });
  });
};
