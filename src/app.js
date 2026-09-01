// Category Mapping to friendly Thai names
const CATEGORY_NAMES = {
  // Nav Menu Categories
  "home": "หน้าแรก",
  "news_sbr": "ข่าวสารจาก สขร.",
  "announcements": "ประกาศล่าสุด",
  "popular_services": "บริการยอดนิยม",
  "about_history": "ประวัติความเป็นมาเทศบาลนครเจ้าพระยาสุรศักดิ์",
  "executives": "คณะผู้บริหารเทศบาลนครเจ้าพระยาสุรศักดิ์",
  "officers": "เจ้าหน้าที่ผู้รับผิดชอบ",
  "agency_form": "แบบฟอร์มรายงาน พ.ร.บ. ข้อมูลข่าวสาร 2540",
  "agency_report": "ระบบรายงาน Template ศูนย์ข้อมูลข่าวสาร 2540",
  "agency_contest": "สมัครเข้าร่วมโครงการประกวดศูนย์ข้อมูลโดดเด่น",
  "public_complaint": "ระบบร้องเรียน/อุทธรณ์ออนไลน์",
  "link_agencies": "หน่วยงานที่มีศูนย์ข้อมูลข่าวสาร",
  "link_infocenter": "หน่วยงานที่ใช้ INFOCENTER",
  "link_testing": "ระบบทดสอบความรู้ตาม พ.ร.บ. ข้อมูลฯ",
  "downloads": "ดาวน์โหลดเอกสาร",
  "sitemap": "แผนผังเว็บไซต์",
  "contact": "ติดตามหน่วยงาน (Contact Us)",
  "privacy": "Privacy Policy นโยบายการคุ้มครองข้อมูลส่วนบุคคล",

  // Main Section Categories (Sidebar & Index)
  "index_files": "ดัชนีรวม / ดัชนีประจำแฟ้ม",
  "m7_1": "มาตรา 7 (1) โครงสร้างและการจัดองค์กรในการดำเนินงาน",
  "m7_2": "มาตรา 7 (2) สรุปอำนาจหน้าที่ที่สำคัญและวิธีการดำเนินงาน",
  "m7_3": "มาตรา 7 (3) สถานที่ติดต่อเพื่อขอรับข้อมูลข่าวสาร",
  "m7_4": "มาตรา 7 (4) กฎ มติ ครม. ข้อบังคับ คำสั่ง และระเบียบที่เกี่ยวข้อง",
  "m9_1": "มาตรา 9 (1) ผลการพิจารณา",
  "m9_2": "มาตรา 9 (2) นโยบายหรือการตีความที่ไม่เข้าข่ายต้องลงพิมพ์ในราชกิจจานุเบกษา ตามมาตรา 7 (4)",
  "m9_3": "มาตรา 9 (3) แผนงาน โครงการ งบประมาณรายจ่ายประจำปี",
  "m9_4": "มาตรา 9 (4) คู่มือหรือคำสั่งเกี่ยวกับวิธีปฏิบัติงานของเจ้าหน้าที่ของรัฐ ซึ่งมีผลกระทบถึงสิทธิหน้าที่ของเอกชน",
  "m9_5": "มาตรา 9 (5) สิ่งพิมพ์ที่อ้างถึงตาม ม. 7 วรรคสอง",
  "m9_6": "มาตรา 9 (6) สัญญาสัมปทาน สัญญาผูกขาดตัดตอน / สัญญาร่วมทุนกับเอกชนในการจัดทำบริการสาธารณะ",
  "m9_7": "มาตรา 9 (7) มติคณะรัฐมนตรี หรือมติคณะกรรมการที่แต่งตั้งโดยกฎหมาย หรือโดยมติคณะรัฐมนตรี",
  "m9_8": "มาตรา 9 (8) ข้อมูลข่าวสารอื่นที่คณะกรรมการกำหนด",
  "eval_form": "เเบบฟอร์มสำรวจความพึงพอใจ",
  "eval_summary": "สรุปความพึงพอใจ",
  "eval_stats": "สถิติผ้ใช้บริการ",
  "eval_faq": "กระดานถาม-ตอบ / ข้อคิดเห็น",
  "article_sbr": "บทความ สขร."
};

let defaultContentTitle = "";
let defaultContentBoxHTML = "";

// Initialize App
document.addEventListener("componentsLoaded", () => {
  const titleEl = document.querySelector(".content-title");
  const boxEl = document.querySelector(".content-box");

  if (titleEl && boxEl && !defaultContentBoxHTML) {
    defaultContentTitle = titleEl.innerHTML;
    defaultContentBoxHTML = boxEl.innerHTML;
  }

  // Initial route handling
  handleRouting();

  // Initialize Visitor Counter Statistics
  initVisitorCounter();

  // Initialize Cookie Consent Banner
  initCookieConsent();
});

// Setup routing listener
window.addEventListener("hashchange", handleRouting);

// Auto-close mobile drawer when clicking a mobile navigation link
document.addEventListener("click", (e) => {
  if (e.target.closest(".mobile-submenu-list a") || e.target.closest(".mobile-drawer-container a")) {
    const toggle = document.getElementById("mobile-nav-toggle");
    if (toggle) toggle.checked = false;
  }
});

let currentItems = [];
let currentPage = 1;
let ITEMS_PER_PAGE = 8;

const DEFAULT_EXECUTIVES = [
  {
    title: "นายอาคมเจตน์ พันเฉลิมชัยโชค",
    pos: "นายกเทศมนตรีนครเจ้าพระยาสุรศักดิ์",
    dept: "ควบคุม กำกับดูแล สำนักปลัดเทศบาล, กองช่าง, กองการเจ้าหน้าที่ และหน่วยตรวจสอบภายใน",
    phone: "0-3834-8205-6",
    level: 1,
    image_url: "./assets/executives/person_153.jpg"
  },
  {
    title: "นายมานะ ฉิมชา",
    pos: "รองนายกเทศมนตรีนครเจ้าพระยาสุรศักดิ์",
    dept: "กำกับดูแล กองสาธารณสุขและสิ่งแวดล้อม",
    phone: "0-3834-8205-6 ต่อ 308",
    level: 2,
    image_url: "./assets/executives/person_154.jpg"
  },
  {
    title: "นางนัยนา จุ่งพิวัฒน์",
    pos: "รองนายกเทศมนตรีนครเจ้าพระยาสุรศักดิ์",
    dept: "กำกับดูแล สำนักคลัง และกองยุทธศาสตร์และงบประมาณ",
    phone: "0-3834-8205-6 ต่อ 403",
    level: 2,
    image_url: "./assets/executives/person_194.jpg"
  },
  {
    title: "นายสมเจตร พันธ์เฉลิมชัย",
    pos: "รองนายกเทศมนตรีนครเจ้าพระยาสุรศักดิ์",
    dept: "กำกับดูแล กองการศึกษา",
    phone: "0-3834-8205-6 ต่อ 403",
    level: 2,
    image_url: "./assets/executives/person_157.jpg"
  },
  {
    title: "นายสงกรานต์ ภาชนะ",
    pos: "รองนายกเทศมนตรีนครเจ้าพระยาสุรศักดิ์",
    dept: "กำกับดูแล กองสวัสดิการสังคม",
    phone: "0-3834-8205-6 ต่อ 308",
    level: 2,
    image_url: "./assets/executives/person_192.jpg"
  },
  {
    title: "นายเสริมชาติ ลออคุณูปการ",
    pos: "เลขานุการนายกเทศมนตรี",
    dept: "",
    phone: "0-3834-8205-6",
    level: 4,
    image_url: "./assets/executives/person_162.jpg"
  },
  {
    title: "นางจีรนันท์ เกตุสาลี",
    pos: "ที่ปรึกษานายกเทศมนตรี",
    dept: "",
    phone: "0-3834-8205-6",
    level: 3,
    image_url: "./assets/executives/person_158.png"
  },
  {
    title: "นายสมชาย ทองศิริ",
    pos: "ที่ปรึกษานายกเทศมนตรี",
    dept: "",
    phone: "0-3834-8205-6",
    level: 3,
    image_url: "./assets/executives/person_160.png"
  },
  {
    title: "นายประชุม เปรมอ่อน",
    pos: "ที่ปรึกษานายกเทศมนตรี",
    dept: "",
    phone: "0-3834-8205-6",
    level: 3,
    image_url: "./assets/executives/person_159.png"
  },
  {
    title: "นายประโยชน์ คงทน",
    pos: "ที่ปรึกษานายกเทศมนตรี",
    dept: "",
    phone: "0-3834-8205-6",
    level: 3,
    image_url: "./assets/executives/person_193.png"
  }
];

// Typewriter Effect for Page Titles matching user's requested animation
let currentTypewriterTimeout = null;

function typewriterEffect(element, text, speed = 55) {
  if (!element) return;
  if (currentTypewriterTimeout) {
    clearTimeout(currentTypewriterTimeout);
    currentTypewriterTimeout = null;
  }

  element.innerHTML = '<span class="typewriter-text"></span><span class="typewriter-cursor">_</span>';
  const textSpan = element.querySelector('.typewriter-text');

  let i = 0;
  function type() {
    if (i < text.length) {
      textSpan.textContent += text.charAt(i);
      i++;
      currentTypewriterTimeout = setTimeout(type, speed);
    }
  }
  type();
}

let currentPublicParentId = null;
let publicBreadcrumbStack = []; // [{ id, title }]

// Route handler
async function handleRouting() {
  let hash = window.location.hash.replace("#", "");
  if (!hash) hash = "home";

  // Reset public folder level on hash navigation
  currentPublicParentId = null;
  publicBreadcrumbStack = [];

  // ตั้งค่าจำนวนรายการต่อหน้า (ข่าวสารใช้ 6 รายการ เพื่อให้เป็น 2 แถว แถวละ 3)
  ITEMS_PER_PAGE = hash === "news_sbr" ? 6 : 8;

  // Highlight active sidebar and top nav links
  highlightSidebarLink(hash);

  const titleEl = document.querySelector(".content-title");
  const boxEl = document.querySelector(".content-box");

  if (!titleEl || !boxEl) return;

  // Hide page loader if visible and show content box immediately
  const pageLoader = document.getElementById("page-loader");
  if (pageLoader) pageLoader.style.display = "none";
  boxEl.style.display = "";

  // Manage top header banner display (Hide on home page and evaluation group pages)
  const headerBanner = document.getElementById("page-header-banner");
  if (headerBanner) {
    if (hash === "home" || hash === "" || hash.startsWith("eval_")) {
      headerBanner.style.display = "none";
    } else {
      headerBanner.style.display = "";
    }
  }

  // Manage breadcrumb text line visibility (Hide specifically on news_sbr page, show on all other pages)
  const breadcrumbEl = document.getElementById("content-breadcrumb");
  if (breadcrumbEl) {
    if (hash === "news_sbr") {
      breadcrumbEl.style.display = "none";
    } else {
      breadcrumbEl.style.display = "";
    }
  }

  // Set page header banner title & breadcrumbs matching reference image
  const thaiTitle = CATEGORY_NAMES[hash] || "หน้าแรก";
  titleEl.textContent = thaiTitle;

  const breadcrumbCurrent = document.getElementById("breadcrumb-current");
  if (breadcrumbCurrent) {
    breadcrumbCurrent.textContent = thaiTitle;
  }

  // If home, render Animated Landmark Map component
  if (hash === "home") {
    if (defaultContentBoxHTML) {
      boxEl.innerHTML = defaultContentBoxHTML;
    }
    return;
  }

  // If contact, delegate to standalone src/contact.js module
  if (hash === "contact") {
    if (typeof renderContactView === "function") {
      renderContactView(boxEl);
    }
    return;
  }

  // If public_complaint, delegate to standalone src/complaints.js module
  if (hash === "public_complaint") {
    if (typeof renderPublicComplaintsView === "function") {
      renderPublicComplaintsView(boxEl);
    }
    return;
  }

  // If executives, delegate to standalone src/executives.js module
  if (hash === "executives") {
    if (typeof renderExecutivesView === "function") {
      renderExecutivesView(boxEl);
    }
    return;
  }

  // If eval_form, delegate to standalone src/eval_form.js module
  if (hash === "eval_form") {
    if (typeof renderEvalFormView === "function") {
      renderEvalFormView(boxEl);
    }
    return;
  }

  // If eval_summary, delegate to standalone src/eval_summary.js module
  if (hash === "eval_summary") {
    if (typeof renderEvalSummaryView === "function") {
      renderEvalSummaryView(boxEl);
    }
    return;
  }

  // If eval_stats, delegate to standalone src/eval_stats.js module
  if (hash === "eval_stats") {
    if (typeof renderEvalStatsView === "function") {
      renderEvalStatsView(boxEl);
    }
    return;
  }

  // If eval_faq, delegate to standalone src/eval_faq.js module
  if (hash === "eval_faq") {
    if (typeof renderEvalFaqView === "function") {
      renderEvalFaqView(boxEl);
    }
    return;
  }

  // If index_files, delegate to standalone src/index_files.js module (Render immediately!)
  if (hash === "index_files") {
    if (typeof renderIndexFilesView === "function") {
      renderIndexFilesView(boxEl, currentItems || []);
      const sb = (typeof window !== "undefined" && window.supabase) ? window.supabase : (typeof supabase !== "undefined" ? supabase : null);
      if (sb && typeof sb.from === "function") {
        sb.from("items")
          .select("*")
          .eq("category", "index_files")
          .order("created_at", { ascending: false })
          .then(({ data, error }) => {
            if (!error && data && data.length > 0) {
              currentItems = data;
              renderIndexFilesView(boxEl, data);
            }
          })
          .catch(() => {});
      }
    }
    return;
  }

  loadCategoryItems(hash);
}

// Fetch and load dynamic items from Supabase
async function loadCategoryItems(hash) {
  const boxEl = document.querySelector(".content-box");
  if (!boxEl) return;

  const sb = (typeof window !== "undefined" && window.supabase) ? window.supabase : (typeof supabase !== "undefined" ? supabase : null);

  // Fetch dynamic items from Supabase
  renderLoading(boxEl);

  try {
    if (!sb || typeof sb.from !== "function") throw new Error("Supabase client is not initialized");

    let items = [];

    // 1. Try querying dedicated 'oic_documents' table first
    let query = sb.from("oic_documents").select("*").eq("category", hash);
    if (currentPublicParentId) {
      query = query.eq("parent_id", currentPublicParentId);
    } else {
      query = query.is("parent_id", null);
    }

    const { data: oicData, error: oicErr } = await query
      .order("is_folder", { ascending: false })
      .order("created_at", { ascending: false });

    if (!oicErr && oicData && oicData.length > 0) {
      items = oicData;
    } else {
      // Fallback or check 'items' table if 'oic_documents' table has no records for this view
      if (currentPublicParentId) {
        const res = await sb
          .from("items")
          .select("*")
          .eq("category", hash)
          .eq("parent_id", currentPublicParentId)
          .order("is_folder", { ascending: false })
          .order("created_at", { ascending: false });

        items = (res.data && res.data.length > 0) ? res.data : (oicData || []);
      } else {
        const res1 = await sb
          .from("items")
          .select("*")
          .eq("category", hash)
          .is("parent_id", null)
          .order("is_folder", { ascending: false })
          .order("created_at", { ascending: false });

        if (!res1.error && res1.data && res1.data.length > 0) {
          items = res1.data;
        } else {
          const res2 = await sb
            .from("items")
            .select("*")
            .eq("category", hash)
            .order("created_at", { ascending: false });

          items = (res2.data && res2.data.length > 0) ? res2.data : (oicData || []);
        }
      }
    }

    if ((!items || items.length === 0) && hash === "executives" && !currentPublicParentId) {
      // Auto seed real executives into Supabase database
      const seedData = DEFAULT_EXECUTIVES.map(item => ({
        category: "executives",
        parent_id: null,
        is_folder: false,
        title: item.title,
        description: JSON.stringify({
          position: item.pos,
          department: item.dept,
          phone: item.phone,
          level: item.level,
          bio: ""
        }),
        image_url: item.image_url
      }));

      const { data: inserted, error: insertErr } = await sb
        .from("items")
        .insert(seedData)
        .select("*");

      currentItems = (!insertErr && inserted && inserted.length > 0) ? inserted : DEFAULT_EXECUTIVES;
    } else {
      currentItems = items || [];
    }

    currentPage = 1; // Reset to page 1 on new folder view
    boxEl.classList.remove("opacity-50", "pointer-events-none");
    renderItems(boxEl);
  } catch (err) {
    console.error("Error fetching items:", err);
    boxEl.classList.remove("opacity-50", "pointer-events-none");
    if (hash === "executives") {
      currentItems = DEFAULT_EXECUTIVES;
      renderItems(boxEl);
    } else {
      renderError(boxEl, "เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง");
    }
  }
}

// Highlight Sidebar Link & Top Navigation Links
function highlightSidebarLink(hash) {
  const links = document.querySelectorAll(".sidebar-link");
  links.forEach(link => {
    link.classList.remove("active");
    const linkId = link.getAttribute("data-id");
    if (linkId === hash) {
      link.classList.add("active");
    }
  });

  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    link.classList.remove("is-active");
    const href = link.getAttribute("href");
    if (href === `#${hash}`) {
      link.classList.add("is-active");
    }
  });
}

// Render Loading (Graceful transition without destroying existing DOM nodes)
function renderLoading(container) {
  if (container && container.children && container.children.length > 0) {
    container.classList.add("opacity-50", "pointer-events-none", "transition-opacity", "duration-200");
  } else if (container) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
        <div class="w-8 h-8 border-3 border-teal-100 border-t-[#008675] rounded-full animate-spin"></div>
        <p class="text-xs font-medium text-gray-500">กำลังโหลดข้อมูล...</p>
      </div>
    `;
  }
}

// Render Error
function renderError(container, message) {
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center py-12 gap-3 text-red-500 text-center">
      <i class="fi fi-rr-triangle-warning text-3xl"></i>
      <p class="text-sm font-semibold">${message}</p>
    </div>
  `;
}

// Render Items List (With Pagination)
function renderItems(container) {
  const hash = window.location.hash.replace("#", "") || "home";
  let items = currentItems;

  if ((!items || items.length === 0) && hash === "executives") {
    items = DEFAULT_EXECUTIVES;
  }

  // 1. Delegate to modular renderer: news_sbr
  if (hash === "news_sbr" && typeof renderNewsSbrView === "function") {
    renderNewsSbrView(container, items, currentPage, ITEMS_PER_PAGE, publicBreadcrumbStack);
    return;
  }

  // 2. Delegate to modular renderer: announcements
  if (hash === "announcements" && typeof renderAnnouncementsView === "function") {
    renderAnnouncementsView(container, items, currentPage, ITEMS_PER_PAGE, publicBreadcrumbStack);
    return;
  }

  // 3. Delegate to modular renderer: about_history
  if (hash === "about_history" && typeof renderAboutHistoryView === "function") {
    renderAboutHistoryView(container, items);
    return;
  }

  // 4. Delegate to modular renderer: officers
  if (hash === "officers" && typeof renderOfficersView === "function") {
    renderOfficersView(container, items);
    return;
  }

  // 6. Delegate legal sections & folder views to modular renderer: oic_sections
  if (typeof renderOicSectionsView === "function") {
    const categoryTitle = CATEGORY_NAMES[hash] || 'หน้าหลัก';
    renderOicSectionsView(container, items, currentPage, ITEMS_PER_PAGE, publicBreadcrumbStack, hash, categoryTitle);
    return;
  }
}

window.openPublicFolder = function (folderId, folderTitle) {
  const hash = window.location.hash.replace("#", "") || "home";
  currentPublicParentId = folderId;
  publicBreadcrumbStack.push({ id: folderId, title: folderTitle });
  loadCategoryItems(hash);
};

window.navigateToPublicBreadcrumb = function (index) {
  const hash = window.location.hash.replace("#", "") || "home";
  if (index === -1) {
    currentPublicParentId = null;
    publicBreadcrumbStack = [];
  } else {
    publicBreadcrumbStack = publicBreadcrumbStack.slice(0, index + 1);
    currentPublicParentId = publicBreadcrumbStack[publicBreadcrumbStack.length - 1].id;
  }
  loadCategoryItems(hash);
};

function renderPaginationControls(totalPages) {
  let controls = `<div class="flex justify-center items-center gap-2 mt-10 mb-4">`;

  // Prev Button
  controls += `
    <button onclick="changePage(${currentPage - 1})" class="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-brand-teal hover:text-white hover:border-brand-teal transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:hover:border-gray-200 disabled:cursor-not-allowed" ${currentPage === 1 ? 'disabled' : ''}>
      <i class="fi fi-rr-angle-small-left text-xl mt-1"></i>
    </button>
  `;

  // Page Numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      controls += `<button class="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-teal text-white font-bold shadow-md shadow-brand-teal/30">${i}</button>`;
    } else {
      controls += `<button onclick="changePage(${i})" class="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-brand-teal/10 hover:text-brand-teal hover:border-brand-teal transition-all font-semibold">${i}</button>`;
    }
  }

  // Next Button
  controls += `
    <button onclick="changePage(${currentPage + 1})" class="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-brand-teal hover:text-white hover:border-brand-teal transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:hover:border-gray-200 disabled:cursor-not-allowed" ${currentPage === totalPages ? 'disabled' : ''}>
      <i class="fi fi-rr-angle-small-right text-xl mt-1"></i>
    </button>
  `;

  controls += `</div>`;
  return controls;
}

window.changePage = function (page) {
  const totalPages = Math.ceil(currentItems.length / ITEMS_PER_PAGE);
  if (page < 1 || page > totalPages) return;

  currentPage = page;
  const boxEl = document.querySelector(".content-box");

  if (boxEl) {
    // Smoothly scroll to the top of the content box
    const titleEl = document.querySelector(".content-title");
    if (titleEl) {
      titleEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Slight delay to allow scroll to start before re-rendering
    setTimeout(() => {
      renderItems(boxEl);
    }, 150);
  }
}

window.toggleExecutiveMarquee = function (btn) {
  const el = document.getElementById("exec-marquee");
  const icon = document.getElementById("marquee-pause-icon");
  if (!el || !icon) return;

  const currentPlayState = window.getComputedStyle(el).animationPlayState;
  if (currentPlayState === "running") {
    el.style.animationPlayState = "paused";
    icon.className = "fi fi-rr-play";
  } else {
    el.style.animationPlayState = "running";
    icon.className = "fi fi-rr-pause";
  }
};

// Real Website Visitor Counter Logic (Incremental Tracking starting from 1)
async function initVisitorCounter() {
  const totalEl = document.getElementById("visitor-total");
  if (!totalEl) return;

  // Clear old dummy base count (125,480) if present in localStorage
  let savedLocal = localStorage.getItem("ico_real_visitor_count");
  if (savedLocal && parseInt(savedLocal) > 10000) {
    localStorage.removeItem("ico_real_visitor_count");
    savedLocal = null;
  }

  let totalCount = parseInt(savedLocal) || 1;
  const isNewVisit = !sessionStorage.getItem("ico_visit_session");

  if (isNewVisit) {
    totalCount = savedLocal ? totalCount + 1 : 1;
    sessionStorage.setItem("ico_visit_session", "true");
    localStorage.setItem("ico_real_visitor_count", String(totalCount));
  }

  // Render current count immediately
  totalEl.textContent = totalCount.toLocaleString("th-TH");

  // Sync with Supabase cloud database if available
  try {
    const sb = window.supabase;
    if (sb) {
      const { data, error } = await sb
        .from("items")
        .select("*")
        .eq("category", "site_stats")
        .eq("title", "visitor_count")
        .maybeSingle();

      if (!error && data && data.description) {
        let cloudCount = parseInt(data.description) || 1;
        if (cloudCount > 10000) cloudCount = 1; // Clear old dummy base count if in database

        if (isNewVisit) {
          cloudCount += 1;
          sb.from("items")
            .update({ description: String(cloudCount) })
            .eq("id", data.id)
            .then(() => { });
        }
        totalCount = Math.max(totalCount, cloudCount);
      } else if (!error && !data) {
        sb.from("items")
          .insert([{ category: "site_stats", title: "visitor_count", description: String(totalCount) }])
          .then(() => { });
      }
      localStorage.setItem("ico_real_visitor_count", String(totalCount));
      totalEl.textContent = totalCount.toLocaleString("th-TH");
    }
  } catch (err) {
    console.warn("Visitor counter error:", err);
  }
}

// Expose globally and attach load handlers
window.initVisitorCounter = initVisitorCounter;
window.addEventListener("load", () => {
  setTimeout(initVisitorCounter, 500);
  setTimeout(initCookieConsent, 600);
});

// Cookie Consent Banner Implementation
function initCookieConsent() {
  const consent = localStorage.getItem("ico_cookie_consent");
  if (consent === "accepted" || consent === "declined") return;

  if (!document.getElementById("cookie-consent-banner")) {
    const bannerHTML = `
      <div id="cookie-consent-banner" class="fixed bottom-5 left-5 right-5 sm:left-6 sm:right-auto sm:max-w-md z-[99999] transition-all duration-500 transform translate-y-24 opacity-0 pointer-events-none">
        <div class="bg-white/95 backdrop-blur-xl border border-[rgba(0,134,117,0.2)] rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,86,117,0.2)] flex flex-col gap-4 text-gray-800">
          <div class="flex items-start gap-3.5">
            <div class="w-10 h-10 rounded-2xl bg-teal-50 text-[#008675] flex items-center justify-center text-xl shrink-0 shadow-sm border border-teal-100">
              🍪
            </div>
            <div class="flex-1">
              <h4 class="text-sm font-bold text-gray-900 mb-1 flex items-center gap-1.5 font-prompt">
                การใช้งานคุกกี้ (Cookie Policy)
              </h4>
              <p class="text-xs text-gray-600 leading-relaxed font-normal font-prompt">
                เว็บไซต์นี้ใช้คุกกี้เพื่อปรับปรุงประสบการณ์ในการเข้าใช้งานเว็บไซต์ของเราให้ดียิ่งขึ้น 
                ท่านสามารถศึกษารายละเอียดเพิ่มเติมได้ที่ 
                <a href="#privacy" class="text-[#008675] font-semibold underline hover:text-teal-700 transition-colors">นโยบายการคุ้มครองข้อมูลส่วนบุคคล</a>
              </p>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2.5 pt-1">
            <button onclick="declineCookieConsent()" class="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition-all font-prompt cursor-pointer">
              ปฏิเสธ
            </button>
            <button onclick="acceptCookieConsent()" class="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#008675] to-teal-700 hover:from-teal-700 hover:to-teal-800 rounded-xl  transition-all font-prompt cursor-pointer">
              ยอมรับทั้งหมด
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", bannerHTML);
  }

  setTimeout(() => {
    const banner = document.getElementById("cookie-consent-banner");
    if (banner) {
      banner.classList.remove("translate-y-24", "opacity-0", "pointer-events-none");
    }
  }, 300);
}

window.acceptCookieConsent = function () {
  localStorage.setItem("ico_cookie_consent", "accepted");
  const banner = document.getElementById("cookie-consent-banner");
  if (banner) {
    banner.classList.add("translate-y-24", "opacity-0", "pointer-events-none");
    setTimeout(() => banner.remove(), 600);
  }
};

window.declineCookieConsent = function () {
  localStorage.setItem("ico_cookie_consent", "declined");
  const banner = document.getElementById("cookie-consent-banner");
  if (banner) {
    banner.classList.add("translate-y-24", "opacity-0", "pointer-events-none");
    setTimeout(() => banner.remove(), 600);
  }
};
