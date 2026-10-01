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
  "m7_1": "มาตรา 7 (1) โครงสร้างและการจัดตั้งองค์กรในการดำเนินงาน",
  "m7_2": "มาตรา 7 (2) สรุปอำนาจ หน้าที่สำคัญและวิธีการดำเนินงาน",
  "m7_3": "มาตรา 7 (3) สถานที่ติดต่อเพื่อขอรับข้อมูลข่าวสารหรือคำแนะนำ",
  "m7_4": "มาตรา 7 (4) กฎ มติคณะรัฐมนตรี ข้อบังคับ คำสั่ง หนังสือเวียน ระเบียบ แผน และนโยบาย",
  "m7_5": "มาตรา 7 (5) ข้อมูลข่าวสารอื่นตามที่คณะกรรมการกำหนด",
  "m7_6": "มาตรา 7 (6) ผลการดำเนินงานตามโครงการต่าง ๆ",
  "m7_7": "มาตรา 7 (7) คู่มือการดำเนินงานและการขอใบอนุญาต",
  "m7_8": "มาตรา 7 (8) ระเบียบที่ควรแจ้งให้ทราบ",
  "m9_1": "มาตรา 9 (1) รายงานการประชุมสภา",
  "m9_2": "มาตรา 9 (2) งบประมาณรายจ่ายประจำปี",
  "m9_3": "มาตรา 9 (3) แผนการดำเนินงานประจำปี",
  "m9_4": "มาตรา 9 (4) แผนยุทธศาสตร์และแผนพัฒนาเทศบาล",
  "m9_5": "มาตรา 9 (5) แผนอัตรากำลัง 3 ปี",
  "m9_6": "มาตรา 9 (6) คู่มือขออนุญาตสิ่งปลูกสร้าง ดัดแปลง และรื้อถอนอาคาร",
  "m9_7": "มาตรา 9 (7) ประกาศประกวดราคาจัดซื้อจัดจ้างที่ลงนามแล้ว",
  "m9_8": "มาตรา 9 (8) สรุปผลการพิจารณาจัดซื้อจัดจ้าง (แบบ สขร. 1)",
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
  initializePublicSidebar();

  const titleEl = document.querySelector(".content-title");
  const boxEl = document.querySelector(".content-box");

  if (titleEl && boxEl && !defaultContentBoxHTML) {
    defaultContentTitle = titleEl.innerHTML;
    defaultContentBoxHTML = boxEl.innerHTML;
  }

  // Initial route handling
  handleRouting();

  // Initialize Visitor Counter Statistics
  window.visitorCounterPromise = initVisitorCounter();

  // Initialize Cookie Consent Banner
  initCookieConsent();
});

window.toggleSidebarMenu = function (open) {
  const sidebar = document.getElementById("sidebar-dock");
  const backdrop = document.getElementById("sidebar-menu-backdrop");
  const menuButton = document.querySelector(".sidebar-mobile-toggle");
  if (!sidebar || !backdrop) return;

  const shouldOpen = typeof open === "boolean" ? open : !sidebar.classList.contains("is-open");
  sidebar.classList.toggle("is-open", shouldOpen);
  backdrop.classList.toggle("is-visible", shouldOpen);
  document.body.classList.toggle("sidebar-menu-open", shouldOpen);
  if (menuButton) menuButton.setAttribute("aria-expanded", String(shouldOpen));
};

window.toggleSidebarCollapse = function () {
  const isCollapsed = document.body.classList.toggle("sidebar-collapsed");
  const button = document.getElementById("sidebar-collapse-button");
  const sidebar = document.getElementById("sidebar-dock");
  const icon = button?.querySelector("i");
  if (!isCollapsed) {
    sidebar?.querySelectorAll("details.sidebar-group").forEach((group) => {
      group.open = true;
    });
  }
  if (button) {
    button.title = isCollapsed ? "ขยายเมนู" : "ย่อเมนู";
    button.setAttribute("aria-label", button.title);
  }
  if (icon) {
    icon.className = isCollapsed ? "fi fi-rr-angle-double-right" : "fi fi-rr-angle-double-left";
  }
  localStorage.setItem("public_sidebar_collapsed", String(isCollapsed));
  document.querySelectorAll("#sidebar-dock .sidebar-link").forEach((link) => {
    link.title = link.textContent.trim();
    link.setAttribute("aria-label", link.title);
  });
};

function initializePublicSidebar() {
  const sidebar = document.getElementById("sidebar-dock");
  if (!sidebar) return;

  document.body.classList.add("has-public-sidebar");
  sidebar.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("#sidebar-collapse-button")) return;
    if (
      document.body.classList.contains("sidebar-collapsed") &&
      window.matchMedia("(min-width: 1025px)").matches
    ) {
      window.toggleSidebarCollapse();
    }
  });

  document.querySelectorAll("#sidebar-dock .sidebar-link").forEach((link) => {
    Array.from(link.childNodes).forEach((node) => {
      if (node.nodeType !== Node.TEXT_NODE || !node.textContent.trim()) return;
      const label = document.createElement("span");
      label.className = "sidebar-link-label";
      label.textContent = node.textContent.trim();
      node.replaceWith(label);
    });
  });

  const isCollapsed = localStorage.getItem("public_sidebar_collapsed") === "true";
  document.body.classList.toggle("sidebar-collapsed", isCollapsed);
  const collapseButton = document.getElementById("sidebar-collapse-button");
  const collapseIcon = collapseButton?.querySelector("i");
  if (collapseButton && isCollapsed) {
    collapseButton.title = "ขยายเมนู";
    collapseButton.setAttribute("aria-label", "ขยายเมนู");
  }
  if (collapseIcon && isCollapsed) {
    collapseIcon.className = "fi fi-rr-angle-double-right";
  }

  document.querySelectorAll("#sidebar-dock .sidebar-link").forEach((link) => {
    link.title = link.textContent.trim();
    link.setAttribute("aria-label", link.title);
    link.addEventListener("click", () => window.toggleSidebarMenu(false));
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") window.toggleSidebarMenu(false);
});

// Setup routing listener
window.addEventListener("hashchange", handleRouting);
window.addEventListener("popstate", handleRouting);

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
let routeRequestId = 0;

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

function revealRoutedContent() {
  const headerBanner = document.getElementById("page-header-banner");
  const boxEl = document.querySelector(".content-box");
  if (headerBanner) headerBanner.classList.remove("route-loading");
  if (boxEl) {
    boxEl.classList.remove("opacity-50", "pointer-events-none");
    boxEl.classList.add("is-ready");
  }
}

// Route handler
async function handleRouting() {
  const requestId = ++routeRequestId;
  const [routeHash, routeQuery = ""] = window.location.hash.replace(/^#/, "").split("?");
  let hash = routeHash;
  const requestedNewsId = hash === "news_sbr"
    ? new URLSearchParams(routeQuery).get("detail")
    : null;
  if (!hash) {
    hash = "news_sbr";
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${window.location.search}#${hash}`
    );
  }

  // Reset public folder level on hash navigation
  currentPublicParentId = null;
  publicBreadcrumbStack = [];

  // แสดงข่าว 5 แถวต่อหน้า (กริด 3 คอลัมน์)
  ITEMS_PER_PAGE = hash === "news_sbr" ? 15 : 8;

  // Highlight active sidebar and top nav links
  highlightSidebarLink(hash);

  const titleEl = document.querySelector(".content-title");
  const boxEl = document.querySelector(".content-box");

  if (!titleEl || !boxEl) return;

  // Fade from the loading placeholder to the routed content in one place.
  const pageLoader = document.getElementById("page-loader");
  if (pageLoader) {
    pageLoader.classList.add("is-hidden");
    window.setTimeout(() => {
      pageLoader.style.display = "none";
    }, 180);
  }
  boxEl.style.display = "";
  window.setTimeout(() => boxEl.classList.add("is-ready"), 0);

  // Manage top header banner display (Hide on home, news_sbr, public_complaint, and evaluation group pages)
  const headerBanner = document.getElementById("page-header-banner");
  if (headerBanner) {
    if (hash === "home" || hash === "" || hash === "news_sbr" || hash === "public_complaint" || hash.startsWith("eval_")) {
      headerBanner.style.display = "none";
    } else {
      headerBanner.style.display = "";
    }
    headerBanner.classList.toggle("route-loading", hash !== "home" && hash !== "");
  }

  // Manage breadcrumb text line visibility
  const breadcrumbEl = document.getElementById("content-breadcrumb");
  if (breadcrumbEl) {
    breadcrumbEl.style.display = "";
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
    revealRoutedContent();
    return;
  }

  // If contact, delegate to standalone src/contact.js module
  if (hash === "contact") {
    if (typeof renderContactView === "function") {
      renderContactView(boxEl);
    }
    revealRoutedContent();
    return;
  }

  // If public_complaint, delegate to standalone src/complaints.js module
  if (hash === "public_complaint") {
    if (typeof renderPublicComplaintsView === "function") {
      renderPublicComplaintsView(boxEl);
    }
    revealRoutedContent();
    return;
  }

  // If executives, delegate to standalone src/executives.js module
  if (hash === "executives") {
    if (typeof renderExecutivesView === "function") {
      renderExecutivesView(boxEl);
    }
    revealRoutedContent();
    return;
  }

  // If eval_form, delegate to standalone src/eval_form.js module
  if (hash === "eval_form") {
    if (typeof renderEvalFormView === "function") {
      renderEvalFormView(boxEl);
    }
    revealRoutedContent();
    return;
  }

  // If eval_summary, delegate to standalone src/eval_summary.js module
  if (hash === "eval_summary") {
    if (typeof renderEvalSummaryView === "function") {
      renderEvalSummaryView(boxEl);
    }
    revealRoutedContent();
    return;
  }

  // If eval_stats, delegate to standalone src/eval_stats.js module
  if (hash === "eval_stats") {
    if (typeof renderEvalStatsView === "function") {
      renderEvalStatsView(boxEl);
    }
    revealRoutedContent();
    return;
  }

  // If eval_faq, delegate to standalone src/eval_faq.js module
  if (hash === "eval_faq") {
    if (typeof renderEvalFaqView === "function") {
      renderEvalFaqView(boxEl);
    }
    revealRoutedContent();
    return;
  }

  // If index_files, delegate to standalone src/index_files.js module (Render immediately!)
  if (hash === "index_files") {
    if (typeof renderIndexFilesView === "function") {
      currentItems = [];
      renderIndexFilesView(boxEl, currentItems);
      const sb = (typeof window !== "undefined" && window.supabase) ? window.supabase : (typeof supabase !== "undefined" ? supabase : null);
      if (sb && typeof sb.from === "function") {
        sb.from("items")
          .select("*")
          .eq("category", "index_files")
          .order("created_at", { ascending: false })
          .then(({ data, error }) => {
            if (requestId !== routeRequestId || window.location.hash.replace("#", "") !== "index_files") return;
            if (error) {
              console.error("Error fetching index files:", error);
              return;
            }
            if (data) {
              currentItems = data;
              renderIndexFilesView(boxEl, data);
            }
          })
          .catch(error => {
            if (requestId === routeRequestId) {
              console.error("Error fetching index files:", error);
            }
          });
      }
    }
    revealRoutedContent();
    return;
  }

  loadCategoryItems(hash, requestId, requestedNewsId);
}

// Fetch and load dynamic items from Supabase
async function loadCategoryItems(hash, requestId = ++routeRequestId, requestedNewsId = null) {
  const boxEl = document.querySelector(".content-box");
  if (!boxEl) return;
  const parentId = currentPublicParentId;

  const sb = (typeof window !== "undefined" && window.supabase) ? window.supabase : (typeof supabase !== "undefined" ? supabase : null);

  // Fetch dynamic items from Supabase
  renderLoading(boxEl);

  try {
    if (!sb || typeof sb.from !== "function") throw new Error("Supabase client is not initialized");

    let items = [];

    // Query both supported tables in parallel so a slow or unavailable
    // oic_documents table does not delay the existing items fallback.
    const parentQuery = parentId
      ? { method: "eq", value: parentId }
      : { method: "is", value: null };
    const buildCategoryQuery = (table) => {
      let query = sb.from(table).select("*").eq("category", hash);
      query = parentQuery.method === "eq"
        ? query.eq("parent_id", parentQuery.value)
        : query.is("parent_id", null);
      return query.order("is_folder", { ascending: false }).order("created_at", { ascending: false });
    };

    const [oicResult, itemsResult] = await Promise.all([
      buildCategoryQuery("oic_documents"),
      buildCategoryQuery("items")
    ]);
    if (requestId !== routeRequestId) return;

    const oicData = oicResult.data || [];
    const itemsData = itemsResult.data || [];
    items = oicData.length > 0 ? oicData : itemsData;

    // Keep the legacy broad fallback for records saved without parent_id.
    if (items.length === 0 && !parentId) {
      const { data: legacyItems } = await sb
        .from("items")
        .select("*")
        .eq("category", hash)
        .order("created_at", { ascending: false });
      if (requestId !== routeRequestId) return;
      items = legacyItems || [];
    }

    if ((!items || items.length === 0) && hash === "executives" && !parentId) {
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

      if (requestId !== routeRequestId) return;
      currentItems = (!insertErr && inserted && inserted.length > 0) ? inserted : DEFAULT_EXECUTIVES;
    } else {
      if (requestId !== routeRequestId) return;
      currentItems = items || [];
    }

    currentPage = 1; // Reset to page 1 on new folder view
    renderItems(boxEl, requestedNewsId);
    revealRoutedContent();
  } catch (err) {
    if (requestId !== routeRequestId) return;
    console.error("Error fetching items:", err);
    if (hash === "executives") {
      currentItems = DEFAULT_EXECUTIVES;
      renderItems(boxEl);
    } else {
      renderError(boxEl, "เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง");
    }
    revealRoutedContent();
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
  if (!container) return;
  container.classList.remove("is-ready");
  container.innerHTML = `
    <div class="route-content-skeleton" aria-live="polite" aria-label="กำลังโหลดข้อมูล">
      <div></div><div></div><div></div><div></div>
    </div>
  `;
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
function renderItems(container, requestedNewsId = null) {
  const hash = window.location.hash.replace(/^#/, "").split("?")[0] || "home";
  let items = currentItems;

  if ((!items || items.length === 0) && hash === "executives") {
    items = DEFAULT_EXECUTIVES;
  }

  // 1. Delegate to modular renderer: news_sbr
  if (hash === "news_sbr" && typeof renderNewsSbrView === "function") {
    renderNewsSbrView(container, items, currentPage, ITEMS_PER_PAGE, publicBreadcrumbStack, requestedNewsId);
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
  let controls = `<div class="flex justify-center items-center gap-1.5 mt-6 mb-3">`;

  // Prev Button
  controls += `
    <button aria-label="หน้าก่อนหน้า" onclick="changePage(${currentPage - 1})" class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed" ${currentPage === 1 ? 'disabled' : ''}>
      <i class="fi fi-rr-angle-small-left text-base"></i>
    </button>
  `;

  // Page Numbers
  const visiblePages = new Set();
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) visiblePages.add(i);
  } else {
    visiblePages.add(1);
    visiblePages.add(totalPages);
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      visiblePages.add(i);
    }
  }

  let previousPage = 0;
  for (const i of [...visiblePages].sort((a, b) => a - b)) {
    if (previousPage && i - previousPage > 1) {
      controls += `<span class="w-5 text-center text-xs text-gray-400" aria-hidden="true">…</span>`;
    }
    if (i === currentPage) {
      controls += `<button aria-current="page" disabled class="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-900 text-white text-sm font-semibold cursor-default">${i}</button>`;
    } else {
      controls += `<button aria-label="หน้า ${i}" onclick="changePage(${i})" class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-100 transition-colors font-medium cursor-pointer">${i}</button>`;
    }
    previousPage = i;
  }

  // Next Button
  controls += `
    <button aria-label="หน้าถัดไป" onclick="changePage(${currentPage + 1})" class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed" ${currentPage === totalPages ? 'disabled' : ''}>
      <i class="fi fi-rr-angle-small-right text-base"></i>
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
          await sb.from("items")
            .update({ description: String(cloudCount) })
            .eq("id", data.id);
        }
        totalCount = Math.max(totalCount, cloudCount);
      } else if (!error && !data) {
        await sb.from("items")
          .insert([{ category: "site_stats", title: "visitor_count", description: String(totalCount) }])
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
  setTimeout(() => {
    if (!window.visitorCounterPromise) {
      window.visitorCounterPromise = initVisitorCounter();
    }
  }, 500);
});
