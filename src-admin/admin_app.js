/**
 * Module: src-admin/admin_app.js
 * Admin Dashboard Core Application, Authentication & Navigation
 */

window.CATEGORIES = {
  // 1. Navbar Menu Categories
  "news_sbr": "ข่าวสารจาก สขร.",
  "announcements": "ประกาศล่าสุด",
  "popular_services": "บริการยอดนิยม",
  "about_history": "ประวัติความเป็นมา",
  "executives": "คณะผู้บริหาร",
  "officers": "เจ้าหน้าที่ผู้รับผิดชอบ",
  "agency_form": "แบบฟอร์มรายงาน พ.ร.บ. 2540",
  "agency_report": "ระบบรายงาน Template พ.ร.บ. 2540",
  "agency_contest": "สมัครเข้าร่วมโครงการประกวดศูนย์ข้อมูล",
  "public_complaint": "ระบบร้องเรียน/อุทธรณ์ออนไลน์",
  "link_agencies": "หน่วยงานที่มีศูนย์ข้อมูลข่าวสาร",
  "link_infocenter": "หน่วยงานที่ใช้ INFOCENTER",
  "link_testing": "ระบบทดสอบความรู้ตาม พ.ร.บ. ข้อมูลฯ",
  "downloads": "ดาวน์โหลดเอกสาร",
  "sitemap": "แผนผังเว็บไซต์",
  "contact": "ติดต่อหน่วยงาน (Contact Us)",
  "privacy": "นโยบายคุ้มครองข้อมูลส่วนบุคคล",

  // 2. Main Section & Legal Index Categories
  "index_files": "ดัชนีรวม / ดัชนีประจำแฟ้ม",
  "m7_1": "มาตรา 7 (1) โครงสร้างและการจัดองค์กร",
  "m7_2": "มาตรา 7 (2) สรุปอำนาจหน้าที่",
  "m7_3": "มาตรา 7 (3) สถานที่ติดต่อขอข้อมูล",
  "m7_4": "มาตรา 7 (4) กฎ มติ ครม. ระเบียบ",
  "m9_1": "มาตรา 9 (1) ผลการพิจารณา",
  "m9_2": "มาตรา 9 (2) นโยบายการตีความ",
  "m9_3": "มาตรา 9 (3) แผนงาน โครงการ งบประมาณ",
  "m9_4": "มาตรา 9 (4) คู่มือวิธีปฏิบัติงานเจ้าหน้าที่",
  "m9_5": "มาตรา 9 (5) สิ่งพิมพ์ที่อ้างถึงตาม ม.7",
  "m9_6": "มาตรา 9 (6) สัญญาสัมปทาน/ร่วมทุน",
  "m9_7": "มาตรา 9 (7) มติคณะรัฐมนตรี/มติบอร์ด",
  "m9_8": "มาตรา 9 (8) ข้อมูลข่าวสารอื่นที่กำหนด",
  "eval_summary": "สรุปความพึงพอใจ",
  "eval_stats": "สถิติผู้ใช้บริการ",
  "eval_faq": "กระดานถาม-ตอบ / ข้อคิดเห็น",
  "article_sbr": "บทความ สขร."
};

window.activeCategory = null;
window.currentParentId = null;
window.breadcrumbStack = [];
window.isEditing = false;

window.handleQuickAdminLogin = function (e) {
  if (e && typeof e.preventDefault === "function") e.preventDefault();

  const emailInput = document.getElementById("login-email");
  const email = (emailInput && emailInput.value.trim()) ? emailInput.value.trim() : "admin@chaophraya.go.th";

  localStorage.setItem("admin_logged_in", "true");
  localStorage.setItem("admin_email", email);

  const authContainer = document.getElementById("auth-container");
  const dashboard = document.getElementById("admin-dashboard");

  if (authContainer) authContainer.classList.add("hidden");
  if (dashboard) dashboard.classList.remove("hidden");

  const userEmailEl = document.getElementById("admin-user-email");
  if (userEmailEl) userEmailEl.textContent = email;

  window.initDashboard();
};

document.addEventListener("DOMContentLoaded", async () => {
  // Update date pill
  const todayStr = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
  const dateEl = document.getElementById("admin-current-date");
  if (dateEl) dateEl.textContent = `${todayStr} Today`;

  setupAuthListener();
  if (typeof setupFormListeners === 'function') {
    setupFormListeners();
  }
});

function setupAuthListener() {
  checkSession();

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      window.handleQuickAdminLogin(e);
    });
  }

  const btnQuickLogin = document.getElementById("btn-quick-login");
  if (btnQuickLogin) {
    btnQuickLogin.addEventListener("click", (e) => {
      window.handleQuickAdminLogin(e);
    });
  }

  const btnLogout = document.getElementById("btn-logout");
  if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
      localStorage.removeItem("admin_logged_in");
      localStorage.removeItem("admin_email");
      try {
        await supabase.auth.signOut();
      } catch (e) { }
      checkSession();
    });
  }
}

async function checkSession() {
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data?.session;
  } catch (e) { }

  const isLocalAdmin = localStorage.getItem("admin_logged_in") === "true";
  const storedEmail = localStorage.getItem("admin_email") || "admin@chaophraya.go.th";

  const authContainer = document.getElementById("auth-container");
  const dashboard = document.getElementById("admin-dashboard");

  if (session || isLocalAdmin) {
    if (authContainer) authContainer.classList.add("hidden");
    if (dashboard) dashboard.classList.remove("hidden");
    const userEmailEl = document.getElementById("admin-user-email");
    if (userEmailEl) userEmailEl.textContent = session?.user?.email || storedEmail;
    window.initDashboard();
  } else {
    if (authContainer) authContainer.classList.remove("hidden");
    if (dashboard) dashboard.classList.add("hidden");
    window.activeCategory = null;
  }
}

window.initDashboard = function () {
  const catNav = document.getElementById("admin-categories");
  if (!catNav) return;
  catNav.innerHTML = "";

  const sections = [
    {
      sectionHeader: "🌐 1. จัดการเนื้อหาตามเมนู Navbar",
      groups: [
        {
          title: "หน้าแรก",
          type: "group",
          items: ["announcements", "popular_services"]
        },
        {
          title: "เกี่ยวกับศูนย์ข้อมูลข่าวสาร",
          type: "group",
          items: ["about_history", "executives", "officers"]
        },
        {
          title: "สำหรับหน่วยงานราชการ",
          type: "group",
          items: ["agency_form", "agency_report", "agency_contest"]
        },
        {
          title: "สำหรับประชาชน",
          type: "group",
          items: ["public_complaint"]
        },
        {
          title: "เชื่อมโยงศูนย์ข้อมูลข่าวสารอื่น ๆ",
          type: "group",
          items: ["link_agencies", "link_infocenter", "link_testing"]
        },
        {
          title: "เมนูอื่น ๆ",
          type: "group",
          items: ["downloads", "sitemap"]
        }
      ]
    },
    {
      sectionHeader: "📁 2. จัดการแฟ้มข้อมูลตามมาตรา & สถิติ",
      groups: [
        { id: "news_sbr", title: "ข่าวสารจาก สขร.", type: "single" },
        { id: "index_files", title: "ดัชนีรวม / ดัชนีประจำแฟ้ม", type: "single" },
        {
          title: "ข้อมูลข่าวสารตามมาตรา 7",
          type: "group",
          items: ["m7_1", "m7_2", "m7_3", "m7_4"]
        },
        {
          title: "ข้อมูลข่าวสารตามมาตรา 9",
          type: "group",
          items: ["m9_1", "m9_2", "m9_3", "m9_4", "m9_5", "m9_6", "m9_7", "m9_8"]
        },
        {
          title: "ประเมินผลการให้บริการ / ถาม-ตอบ",
          type: "group",
          items: ["eval_summary", "eval_stats", "eval_faq"]
        },
        { id: "article_sbr", title: "บทความ สขร.", type: "single" },
        { id: "contact", title: "ติดตามหน่วยงาน (Contact Us)", type: "single" },
        { id: "privacy", title: "นโยบายคุ้มครองข้อมูลส่วนบุคคล", type: "single" }
      ]
    }
  ];

  sections.forEach(sec => {
    const headerDiv = document.createElement("div");
    headerDiv.className = "px-2.5 pt-2.5 pb-1 text-[11px] font-bold text-teal-300 uppercase tracking-wider bg-slate-800/90 rounded-lg mt-2 mb-1 border-l-3 border-teal-400";
    headerDiv.textContent = sec.sectionHeader;
    catNav.appendChild(headerDiv);

    sec.groups.forEach(group => {
      if (group.type === "single") {
        const btn = createCategoryButton(group.id, window.CATEGORIES[group.id], "fi-rr-document");
        catNav.appendChild(btn);
      } else if (group.type === "group") {
        const details = document.createElement("details");
        details.className = "group mb-0.5";

        const summary = document.createElement("summary");
        summary.className = "flex items-center gap-2 px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white cursor-pointer hover:bg-slate-700/60 select-none rounded-lg transition-all";
        summary.innerHTML = `<i class="fi fi-rr-folder-open text-teal-300 text-xs"></i> <span class="truncate">${group.title}</span>`;

        const itemsContainer = document.createElement("div");
        itemsContainer.className = "flex flex-col gap-0.5 pl-2 mt-0.5 border-l border-slate-700 ml-2.5";

        group.items.forEach(itemId => {
          const btn = createCategoryButton(itemId, window.CATEGORIES[itemId], "fi-rr-document", true);
          itemsContainer.appendChild(btn);
        });

        details.appendChild(summary);
        details.appendChild(itemsContainer);
        catNav.appendChild(details);
      }
    });
  });

  if (!window.activeCategory) {
    window.activeCategory = "officers";
  }
  selectCategory(window.activeCategory);
};

function createCategoryButton(id, title, icon, isNested = false) {
  const btn = document.createElement("button");
  btn.className = `w-full text-left px-2.5 py-1.5 text-xs sm:text-sm font-normal text-slate-300 rounded-lg hover:bg-slate-700/60 hover:text-white transition-all flex items-center gap-2 ${isNested ? 'text-xs py-1.5 text-slate-400' : ''}`;
  btn.setAttribute("data-cat", id);
  btn.innerHTML = `<i class="fi ${icon} text-xs shrink-0 text-teal-300"></i> <span class="leading-normal text-left truncate">${title || id}</span>`;

  btn.addEventListener("click", () => {
    selectCategory(id);
  });
  return btn;
}

window.toggleMobileSidebar = function (show) {
  const sidebar = document.getElementById("admin-sidebar");
  const backdrop = document.getElementById("admin-mobile-backdrop");
  if (!sidebar) return;

  const isShowing = show !== undefined ? show : sidebar.classList.contains("-translate-x-full");

  if (isShowing) {
    sidebar.classList.remove("-translate-x-full");
    if (backdrop) backdrop.classList.remove("hidden");
  } else {
    sidebar.classList.add("-translate-x-full");
    if (backdrop) backdrop.classList.add("hidden");
  }
};

window.filterSidebarNav = function (query) {
  const q = (query || "").toLowerCase().trim();
  const catNav = document.getElementById("admin-categories");
  if (!catNav) return;

  const buttons = catNav.querySelectorAll("button[data-cat]");
  buttons.forEach(btn => {
    const text = (btn.textContent || "").toLowerCase();
    const parentDetails = btn.closest("details");

    if (!q || text.includes(q)) {
      btn.classList.remove("hidden");
      if (parentDetails) {
        parentDetails.classList.remove("hidden");
        if (q) parentDetails.open = true;
      }
    } else {
      btn.classList.add("hidden");
    }
  });

  if (q) {
    const detailsList = catNav.querySelectorAll("details");
    detailsList.forEach(det => {
      const visibleChild = det.querySelector("button[data-cat]:not(.hidden)");
      if (!visibleChild) {
        det.classList.add("hidden");
      }
    });
  }
};

function selectCategory(key) {
  window.activeCategory = key;
  window.currentParentId = null;
  window.breadcrumbStack = [];
  if (typeof window.toggleMobileSidebar === "function") window.toggleMobileSidebar(false);

  document.querySelectorAll("#admin-categories button").forEach(btn => {
    btn.classList.remove("bg-[#007062]", "text-white", "font-normal", "font-bold", "shadow-sm");
    btn.classList.add("text-teal-100/90");
    if (btn.getAttribute("data-cat") === key) {
      btn.classList.remove("text-teal-100/90");
      btn.classList.add("bg-[#007062]", "text-white", "font-normal", "shadow-sm");

      const details = btn.closest("details");
      if (details) details.open = true;
    }
  });

  const titleEl = document.getElementById("active-category-title");
  if (titleEl) titleEl.textContent = window.CATEGORIES[key] || key;

  const readOnlyCategories = ["eval_summary", "eval_stats", "eval_faq"];
  // Folders are strictly ONLY used in Section 7 (m7_*) and Section 9 (m9_*)
  const isFolderAllowedCategory = key.startsWith("m7_") || key.startsWith("m9_");

  const btnAddItem = document.getElementById("btn-add-item");
  const btnAddFolder = document.getElementById("btn-add-folder");
  const btnSeed = document.getElementById("btn-seed-executives");
  const btnSeedOfficers = document.getElementById("btn-seed-officers");
  const btnSeedM91 = document.getElementById("btn-seed-m91");
  const btnSeedM92 = document.getElementById("btn-seed-m92");

  if (btnAddItem && btnAddFolder && btnSeed) {
    if (readOnlyCategories.includes(key)) {
      btnAddItem.classList.add("hidden");
      btnAddFolder.classList.add("hidden");
      btnSeed.classList.add("hidden");
      if (btnSeedOfficers) btnSeedOfficers.classList.add("hidden");
      if (btnSeedM91) btnSeedM91.classList.add("hidden");
      if (btnSeedM92) btnSeedM92.classList.add("hidden");
    } else {
      btnAddItem.classList.remove("hidden");
      if (isFolderAllowedCategory) {
        btnAddFolder.classList.remove("hidden");
      } else {
        btnAddFolder.classList.add("hidden");
      }
    }

    if (key === "executives") {
      btnAddItem.innerHTML = `<i class="fi fi-rr-user-add"></i> เพิ่มผู้บริหารใหม่`;
      btnSeed.classList.remove("hidden");
      if (btnSeedOfficers) btnSeedOfficers.classList.add("hidden");
      if (btnSeedM91) btnSeedM91.classList.add("hidden");
      if (btnSeedM92) btnSeedM92.classList.add("hidden");
    } else if (key === "officers") {
      btnAddItem.innerHTML = `<i class="fi fi-rr-user-add"></i> เพิ่มเจ้าหน้าที่ผู้รับผิดชอบใหม่`;
      btnAddFolder.classList.add("hidden");
      btnSeed.classList.add("hidden");
      if (btnSeedOfficers) btnSeedOfficers.classList.remove("hidden");
      if (btnSeedM91) btnSeedM91.classList.add("hidden");
      if (btnSeedM92) btnSeedM92.classList.add("hidden");
    } else if (key === "m9_1") {
      btnAddItem.innerHTML = `<i class="fi fi-rr-document-signed"></i> เพิ่มไฟล์ / ข้อมูลใหม่`;
      btnSeed.classList.add("hidden");
      if (btnSeedOfficers) btnSeedOfficers.classList.add("hidden");
      if (btnSeedM91) btnSeedM91.classList.remove("hidden");
      if (btnSeedM92) btnSeedM92.classList.add("hidden");
    } else if (key === "m9_2") {
      btnAddItem.innerHTML = `<i class="fi fi-rr-document-signed"></i> เพิ่มไฟล์ / ข้อมูลใหม่`;
      btnSeed.classList.add("hidden");
      if (btnSeedOfficers) btnSeedOfficers.classList.add("hidden");
      if (btnSeedM91) btnSeedM91.classList.add("hidden");
      if (btnSeedM92) btnSeedM92.classList.remove("hidden");
    } else if (key === "about_history") {
      btnAddItem.innerHTML = `<i class="fi fi-rr-document-signed"></i> เพิ่มข้อมูลประวัติความเป็นมา`;
      btnSeed.classList.add("hidden");
      if (btnSeedOfficers) btnSeedOfficers.classList.add("hidden");
      if (btnSeedM91) btnSeedM91.classList.add("hidden");
      if (btnSeedM92) btnSeedM92.classList.add("hidden");
    } else {
      btnAddItem.innerHTML = `<i class="fi fi-rr-document-signed"></i> เพิ่มไฟล์ / ข้อมูลใหม่`;
      btnSeed.classList.add("hidden");
      if (btnSeedOfficers) btnSeedOfficers.classList.add("hidden");
      if (btnSeedM91) btnSeedM91.classList.add("hidden");
      if (btnSeedM92) btnSeedM92.classList.add("hidden");
    }
  }

  if (typeof window.loadItems === "function") {
    window.loadItems();
  } else {
    setTimeout(() => {
      if (typeof window.loadItems === "function") window.loadItems();
    }, 150);
  }
  if (typeof window.renderAdminBreadcrumb === "function") {
    window.renderAdminBreadcrumb();
  }
}

// Setup Auto-Seed Officers Button Listener
document.addEventListener("DOMContentLoaded", () => {
  const btnSeedOfficers = document.getElementById("btn-seed-officers");
  if (btnSeedOfficers) {
    btnSeedOfficers.addEventListener("click", async () => {
      if (!confirm("คุณต้องการดึงข้อมูลเจ้าหน้าที่เริ่มต้น (9 รายชื่อเรียง 3 แถว) ลงสู่ระบบใช่หรือไม่?")) return;

      btnSeedOfficers.disabled = true;
      btnSeedOfficers.innerHTML = `<i class="fi fi-rr-spinner animate-spin"></i> กำลังสร้างรายการ...`;

      try {
        const DEFAULT_OFFICERS = [
          { title: "นางสาวเพ็ญนภา สุวรรณรัตน์", pos: "หัวหน้าศูนย์ข้อมูลข่าวสารของราชการ", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500" },
          { title: "นายธนวัฒน์ พรหมเสน", pos: "นักจัดการงานทั่วไปปฏิบัติการ", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
          { title: "นางสาวศิริพร บุญช่วย", pos: "เจ้าพนักงานประชาสัมพันธ์ชำนาญงาน", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400" },
          { title: "นายกิตติศักดิ์ รัตนพงษ์", pos: "เจ้าพนักงานธุรการปฏิบัติงาน", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400" },
          { title: "นางสาวชลธิชา ใจดี", pos: "เจ้าหน้าที่คอมพิวเตอร์ประจำศูนย์", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400" },
          { title: "นายวิศรุต สุขเสริฐ", pos: "เจ้าหน้าที่จัดเก็บเอกสารและระบบสารสนเทศ", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" },
          { title: "นางสาวณิชากานต์ พรประเสริฐ", pos: "เจ้าหน้าที่ให้บริการข้อมูลและรับเรื่องร้องเรียน", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400" },
          { title: "นายอนันต์ มั่นคง", pos: "เจ้าพนักงานศูนย์บริการข้อมูลข่าวสาร", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400" },
          { title: "นางสาวปรียาภรณ์ วงศ์สว่าง", pos: "เจ้าหน้าที่สนับสนุนงานศูนย์ข้อมูลข่าวสาร", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400" }
        ];

        const targetTable = window.ACTIVE_TABLE_NAME || 'oic_documents';
        const now = Date.now();
        const itemsToInsert = DEFAULT_OFFICERS.map((item, idx) => ({
          category: "officers",
          parent_id: null,
          is_folder: false,
          title: item.title,
          description: JSON.stringify({ position: item.pos, bio: "" }),
          image_url: item.img,
          created_at: new Date(now - idx * 1000).toISOString()
        }));

        await supabase.from(targetTable).insert(itemsToInsert);
        alert("สร้างชุดข้อมูลเจ้าหน้าที่เริ่มต้น 9 รายชื่อเรียบร้อยแล้ว!");
        if (typeof window.loadItems === "function") window.loadItems();
      } catch (e) {
        console.error("Seed officers error:", e);
        alert("ไม่สามารถดึงข้อมูลได้: " + e.message);
      } finally {
        btnSeedOfficers.disabled = false;
        btnSeedOfficers.innerHTML = `<i class="fi fi-rr-cloud-download"></i> ดึงชุดข้อมูลเจ้าหน้าที่เริ่มต้น (9 รายชื่อ 3 แถว)`;
      }
    });
  }
});
