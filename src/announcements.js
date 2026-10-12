/**
 * Module: announcements.js
 * Shows the newest OIC news in a lightweight, vanilla-JavaScript carousel.
 */

let announcementsCarouselTimer = null;
let announcementsCarouselResizeObserver = null;

window.cleanupAnnouncementsCarousel = function () {
  if (announcementsCarouselTimer) {
    window.clearInterval(announcementsCarouselTimer);
    announcementsCarouselTimer = null;
  }
  if (announcementsCarouselResizeObserver) {
    announcementsCarouselResizeObserver.disconnect();
    announcementsCarouselResizeObserver = null;
  }
};

window.renderAnnouncementsView = function (container, items, currentPage = 1, itemsPerPage = 15, breadcrumbStack = []) {
  window.cleanupAnnouncementsCarousel();

  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);

  const sortedItems = [...(items || [])].sort((a, b) => {
    const dateA = Date.parse(a.created_at || "") || 0;
    const dateB = Date.parse(b.created_at || "") || 0;
    return dateB - dateA;
  });

  const breadcrumbEl = document.getElementById("content-breadcrumb");
  if (breadcrumbEl) {
    let breadcrumbHtml = `
      <a href="#home" onclick="navigateToPublicBreadcrumb(-1)" class="hover:underline hover:text-[#008675] text-slate-900 font-bold">หน้าหลัก</a>
      <span class="text-slate-600 font-normal">/</span>
      <a href="#announcements" onclick="navigateToPublicBreadcrumb(-1)" class="hover:underline hover:text-[#008675] text-slate-900 font-bold">ประกาศล่าสุด</a>
    `;
    breadcrumbStack.forEach((folder, index) => {
      breadcrumbHtml += `
        <span class="text-slate-600 font-normal">/</span>
        <button onclick="navigateToPublicBreadcrumb(${index})" class="hover:underline hover:text-[#008675] ${index === breadcrumbStack.length - 1 ? 'text-[#008675] font-bold' : 'text-slate-800 font-medium'}">${escapeHtml(folder.title)}</button>
      `;
    });
    breadcrumbEl.innerHTML = breadcrumbHtml;
  }

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const pageItems = sortedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const newsItems = pageItems.filter(item => !item.is_folder);
  const folders = pageItems.filter(item => item.is_folder);

  let html = `
    <style>
      .oic-carousel{--oic-ink:#193b37;--oic-muted:#647873;position:relative;overflow:visible;color:var(--oic-ink)}
      .oic-carousel:focus-visible{outline:3px solid #0b8171;outline-offset:3px}
      .oic-carousel-head{position:relative;z-index:2;padding:26px 24px 0;text-align:center}
      .oic-carousel-kicker{font-size:11px;font-weight:700;letter-spacing:.18em;color:#0b8171}
      .oic-carousel-heading{margin:6px 0 0;font-size:clamp(20px,3vw,30px);font-weight:700;letter-spacing:-.03em}
      .oic-carousel-intro{margin:7px auto 0;max-width:520px;font-size:13px;line-height:1.8;color:var(--oic-muted)}
      .oic-carousel-stage{position:relative;height:545px;touch-action:pan-y;overflow:visible}
      .oic-carousel-string{position:absolute;top:34px;left:8%;width:84%;height:92px;pointer-events:none}
      .oic-polaroid{position:absolute;top:68px;left:50%;width:min(300px,64vw);padding:10px 10px 0;border:0;background:#fffefa;box-shadow:0 12px 32px #163d351c,0 2px 5px #193b3712;text-align:left;cursor:pointer;transform-origin:50% 0;transition:transform .58s cubic-bezier(.22,1,.36,1),opacity .4s ease,filter .4s ease;will-change:transform}
      .oic-polaroid:focus-visible{outline:3px solid #0b8171;outline-offset:4px}
      .oic-polaroid-photo{position:relative;display:block;aspect-ratio:3/4;overflow:hidden;background:linear-gradient(145deg,#d5e7df,#eef1e5 50%,#b8cec5)}
      .oic-polaroid-photo:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,#102b241a)}
      .oic-polaroid-photo img{width:100%;height:100%;object-fit:cover;display:block}
      .oic-polaroid-placeholder{height:100%;display:grid;place-items:center;color:#66857b;font-size:34px}
      .oic-polaroid-label{height:44px;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:0 5px;color:#394b43;font-family:Georgia,'Noto Sans Thai',serif;font-size:13px;text-align:center;white-space:nowrap;text-overflow:ellipsis}
      .oic-carousel-copy{max-width:680px;min-height:125px;margin:-3px auto 0;padding:4px 24px 0;text-align:center}
      .oic-carousel-date{font-size:11px;font-weight:600;color:#0b8171}
      .oic-carousel-title{display:-webkit-box;overflow:hidden;margin:6px 0 0;color:#193b37;font-size:clamp(16px,2.5vw,21px);font-weight:700;line-height:1.5;-webkit-box-orient:vertical;-webkit-line-clamp:2}
      .oic-carousel-description{display:-webkit-box;overflow:hidden;margin:5px auto 0;color:var(--oic-muted);font-size:12px;line-height:1.75;-webkit-box-orient:vertical;-webkit-line-clamp:2}
      .oic-carousel-footer{display:flex;align-items:center;justify-content:center;gap:14px;padding:14px 20px 22px}
      .oic-carousel-arrow{display:grid;width:38px;height:38px;place-items:center;border:1px solid #d5e2dc;border-radius:50%;background:#ffffffb8;color:#31594f;cursor:pointer;transition:background .2s,color .2s,transform .2s}
      .oic-carousel-arrow:hover{transform:translateY(-1px);background:#0b8171;color:white}
      .oic-carousel-count{min-width:55px;color:#72827c;font:500 11px/1.2 ui-monospace,monospace;letter-spacing:.12em;text-align:center}
      .oic-carousel-count b{color:#193b37;font-weight:700}
      .oic-carousel-read{display:inline-flex;align-items:center;gap:8px;margin-left:5px;padding:9px 15px;border-radius:999px;background:#0b8171;color:white;font-size:12px;font-weight:700;transition:background .2s,transform .2s}
      .oic-carousel-read:hover{transform:translateY(-1px);background:#08695d}
      .oic-folder-section{margin-top:24px}
      .oic-folder-card{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 20px;border:1px solid #e4e9e6;border-radius:18px;background:#fff;color:#33443e;transition:border-color .2s,box-shadow .2s}
      .oic-folder-card:hover{border-color:#a6cbc0;box-shadow:0 8px 24px #163d350d}
      @media(max-width:520px){.oic-carousel-head{padding-top:22px}.oic-carousel-stage{height:460px}.oic-carousel-string{top:28px}.oic-polaroid{top:61px}.oic-carousel-copy{min-height:138px;padding-inline:18px}.oic-carousel-footer{gap:9px;flex-wrap:wrap}.oic-carousel-read{margin-left:0}.oic-carousel-intro{font-size:12px}}
      @media(prefers-reduced-motion:reduce){.oic-polaroid,.oic-carousel-arrow,.oic-carousel-read{transition:none}}
    </style>
  `;

  if (newsItems.length > 0) {
    const first = newsItems[0];
    html += `
      <section class="oic-carousel mb-5" data-oic-carousel tabindex="0" role="region" aria-roledescription="carousel" aria-label="ประกาศล่าสุดจากศูนย์ข้อมูลข่าวสาร">
        <div class="oic-carousel-stage" data-carousel-stage>
          <svg class="oic-carousel-string" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 5 Q500 100 1000 5" fill="none" stroke="#82978c" stroke-width="2"/>
          </svg>
          ${newsItems.map((item, index) => {
            const image = item.image_url ? `<img src="${escapeHtml(item.image_url)}" alt="" loading="${index < 3 ? 'eager' : 'lazy'}">` : `<span class="oic-polaroid-placeholder"><i class="fi fi-rr-megaphone"></i></span>`;
            return `
              <button type="button" class="oic-polaroid" data-slide-index="${index}" aria-label="แสดงข่าว: ${escapeHtml(item.title || "ข่าวสาร")}">
                <span class="oic-polaroid-photo">${image}</span>
                <span class="oic-polaroid-label">${escapeHtml(item.title || "ข่าวสารจาก สขร.")}</span>
              </button>
            `;
          }).join("")}
        </div>
        <div class="oic-carousel-copy" aria-live="polite">
          <time class="oic-carousel-date" data-slide-date></time>
          <h3 class="oic-carousel-title" data-slide-title></h3>
          <p class="oic-carousel-description" data-slide-description></p>
        </div>
        <footer class="oic-carousel-footer">
          <button type="button" class="oic-carousel-arrow" data-carousel-prev aria-label="ข่าวก่อนหน้า"><i class="fi fi-rr-arrow-left"></i></button>
          <span class="oic-carousel-count" data-slide-count><b>01</b> / ${String(newsItems.length).padStart(2, "0")}</span>
          <button type="button" class="oic-carousel-arrow" data-carousel-next aria-label="ข่าวถัดไป"><i class="fi fi-rr-arrow-right"></i></button>
          ${first.id ? `<a class="oic-carousel-read" data-slide-link href="#news_sbr?detail=${encodeURIComponent(first.id)}">อ่านข่าวฉบับเต็ม <i class="fi fi-rr-arrow-up-right"></i></a>` : ""}
        </footer>
      </section>
    `;
  } else if (folders.length === 0) {
    html += `
      <div class="flex flex-col items-center justify-center gap-3 py-16 text-center text-slate-400">
        <i class="fi fi-rr-inbox text-4xl"></i>
        <p class="text-sm font-medium">ยังไม่มีข่าวสารจาก สขร. ในขณะนี้</p>
      </div>
    `;
  }

  if (folders.length > 0) {
    html += `
      <section class="oic-folder-section">
        <h2 class="mb-3 text-sm font-bold text-slate-700">แฟ้มข่าวสาร</h2>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          ${folders.map((folder, index) => `
            <button type="button" class="oic-folder-card text-left" data-folder-index="${index}">
              <span class="flex min-w-0 items-center gap-3">
                <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700"><i class="fi fi-rr-folder"></i></span>
                <span class="min-w-0">
                  <span class="block truncate text-sm font-bold">${escapeHtml(folder.title || "แฟ้มข่าวสาร")}</span>
                  ${folder.description ? `<span class="mt-1 block truncate text-xs text-slate-500">${escapeHtml(folder.description)}</span>` : ""}
                </span>
              </span>
              <i class="fi fi-rr-arrow-right shrink-0 text-xs text-slate-400"></i>
            </button>
          `).join("")}
        </div>
      </section>
    `;
  }

  if (totalPages > 1 && typeof renderPaginationControls === "function") {
    html += renderPaginationControls(totalPages);
  }
  container.innerHTML = html;

  container.querySelectorAll("[data-folder-index]").forEach(button => {
    const folder = folders[Number(button.dataset.folderIndex)];
    button.addEventListener("click", () => window.openPublicFolder(folder.id, folder.title || "แฟ้มข่าวสาร"));
  });

  const carousel = container.querySelector("[data-oic-carousel]");
  if (!carousel || newsItems.length === 0) return;

  const slides = [...carousel.querySelectorAll("[data-slide-index]")];
  const stage = carousel.querySelector("[data-carousel-stage]");
  const dateEl = carousel.querySelector("[data-slide-date]");
  const titleEl = carousel.querySelector("[data-slide-title]");
  const descriptionEl = carousel.querySelector("[data-slide-description]");
  const countEl = carousel.querySelector("[data-slide-count]");
  const linkEl = carousel.querySelector("[data-slide-link]");
  let activeIndex = 0;
  let pointerStart = null;
  let suppressClick = false;

  const showSlide = index => {
    activeIndex = (index + newsItems.length) % newsItems.length;
    const spacing = Math.min(210, Math.max(126, stage.clientWidth * 0.34));

    slides.forEach((slide, slideIndex) => {
      let offset = slideIndex - activeIndex;
      if (offset > newsItems.length / 2) offset -= newsItems.length;
      if (offset < -newsItems.length / 2) offset += newsItems.length;
      const distance = Math.abs(offset);
      slide.style.transform = `translate3d(calc(-50% + ${offset * spacing}px), ${distance * 20}px, 0) rotate(${offset * 5}deg) scale(${Math.max(0.68, 1 - distance * 0.11)})`;
      slide.style.opacity = distance > 2 ? "0" : String(1 - distance * 0.19);
      slide.style.zIndex = String(10 - distance);
      slide.style.pointerEvents = distance > 2 ? "none" : "auto";
      slide.tabIndex = slideIndex === activeIndex ? 0 : -1;
      slide.setAttribute("aria-hidden", String(distance > 0));
    });

    const item = newsItems[activeIndex];
    if (item.created_at) {
      dateEl.dateTime = item.created_at;
      dateEl.textContent = new Date(item.created_at).toLocaleDateString("th-TH", {
        day: "numeric",
        month: "long",
        year: "numeric"
      });
    } else {
      dateEl.removeAttribute("datetime");
      dateEl.textContent = "ข่าวสารล่าสุด";
    }
    titleEl.textContent = item.title || "ข่าวสารจาก สขร.";
    descriptionEl.textContent = item.description || "ติดตามรายละเอียดและความเคลื่อนไหวเพิ่มเติมจากศูนย์ข้อมูลข่าวสาร";
    countEl.innerHTML = `<b>${String(activeIndex + 1).padStart(2, "0")}</b> / ${String(newsItems.length).padStart(2, "0")}`;
    if (linkEl) {
      if (item.id) {
        linkEl.href = `#news_sbr?detail=${encodeURIComponent(item.id)}`;
        linkEl.hidden = false;
      } else {
        linkEl.hidden = true;
      }
    }
  };

  carousel.querySelector("[data-carousel-prev]").addEventListener("click", () => showSlide(activeIndex - 1));
  carousel.querySelector("[data-carousel-next]").addEventListener("click", () => showSlide(activeIndex + 1));
  slides.forEach((slide, index) => slide.addEventListener("click", () => showSlide(index)));
  carousel.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") showSlide(activeIndex - 1);
    if (event.key === "ArrowRight") showSlide(activeIndex + 1);
  });
  stage.addEventListener("pointerdown", event => {
    pointerStart = event.clientX;
  });
  stage.addEventListener("pointerup", event => {
    if (pointerStart === null) return;
    const distance = event.clientX - pointerStart;
    pointerStart = null;
    if (Math.abs(distance) > 45) {
      suppressClick = true;
      showSlide(activeIndex + (distance < 0 ? 1 : -1));
    }
  });
  stage.addEventListener("click", event => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClick = false;
  }, true);
  stage.addEventListener("pointercancel", () => {
    pointerStart = null;
  });
  announcementsCarouselResizeObserver = new ResizeObserver(() => showSlide(activeIndex));
  announcementsCarouselResizeObserver.observe(stage);
  showSlide(0);

  if (newsItems.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    announcementsCarouselTimer = window.setInterval(() => {
      if (!document.hidden && !carousel.matches(":hover") && !carousel.contains(document.activeElement)) {
        showSlide(activeIndex + 1);
      }
    }, 5500);
  }
};
