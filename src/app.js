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

// Route handler
async function handleRouting() {
  let hash = window.location.hash.replace("#", "");
  if (!hash) hash = "home";

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

  // Set title with Typewriter Animation
  const thaiTitle = CATEGORY_NAMES[hash] || "หน้าแรก";
  typewriterEffect(titleEl, thaiTitle, 55);

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

  // Helper to safely get initialized Supabase client
  const sb = (typeof window !== "undefined" && window.supabase) ? window.supabase : (typeof supabase !== "undefined" ? supabase : null);

  // If index_files, delegate to standalone src/index_files.js module
  if (hash === "index_files") {
    renderLoading(boxEl);
    try {
      if (sb && typeof sb.from === "function") {
        const { data, error } = await sb
          .from("items")
          .select("*")
          .eq("category", "index_files")
          .order("created_at", { ascending: false });

        currentItems = (!error && data) ? data : [];
      } else {
        currentItems = [];
      }
      if (typeof renderIndexFilesView === "function") {
        renderIndexFilesView(boxEl, currentItems);
      }
    } catch (err) {
      if (typeof renderIndexFilesView === "function") {
        renderIndexFilesView(boxEl, []);
      }
    }
    return;
  }



  // Fetch dynamic items from Supabase
  renderLoading(boxEl);

  try {
    if (!sb || typeof sb.from !== "function") throw new Error("Supabase client is not initialized");

    const { data: items, error } = await sb
      .from("items")
      .select("*")
      .eq("category", hash)
      .order("created_at", { ascending: false });

    if (error) throw error;

    if ((!items || items.length === 0) && hash === "executives") {
      // Auto seed real executives into Supabase database
      const seedData = DEFAULT_EXECUTIVES.map(item => ({
        category: "executives",
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

    currentPage = 1; // Reset to page 1 on new category
    renderItems(boxEl);
  } catch (err) {
    console.error("Error fetching items:", err);
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

// Render Loading
function renderLoading(container) {
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center py-12 gap-3 text-gray-500">
      <div class="w-10 h-10 border-4 border-[rgba(0,134,117,0.1)] border-t-[#008675] rounded-full animate-spin"></div>
      <p class="text-sm font-medium">กำลังโหลดข้อมูล...</p>
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
function renderItems(container) {
  const hash = window.location.hash.replace("#", "") || "home";
  let items = currentItems;

  if ((!items || items.length === 0) && hash === "executives") {
    items = DEFAULT_EXECUTIVES;
  }

  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-16 gap-3 text-gray-400 text-center">
        <i class="fi fi-rr-inbox text-4xl"></i>
        <p class="text-sm font-medium">ยังไม่มีข้อมูลในหัวข้อนี้</p>
      </div>
    `;
    return;
  }

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const itemsToShow = items.slice(startIndex, endIndex);

  let html = ``;

  // เพิ่มแบนเนอร์ด้านบนสุดสำหรับหน้า ข่าวสาร สขร. (news_sbr)
  if (hash === "news_sbr" && currentPage === 1) {
    html += `
      <div class="w-100 h-80 md:h-85 rounded-2xl overflow-hidden shadow-sm relative bg-gray-100">
        <video src="./assets/Man_in_uniform_and_statue_202607091447.mp4" class="w-full h-80 object-cover object-top" autoplay loop muted playsinline></video>
      </div>
    `;
  }

  if (hash === "news_sbr") {
    // Layout แบบ Grid 3 คอลัมน์ (สำหรับหน้าข่าวสาร)
    html += `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-2">`;

    itemsToShow.forEach(item => {
      const defaultImg = "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80";
      const img = item.image_url || defaultImg;
      const formattedDate = new Date(item.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });

      html += `
        <div class="relative rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_45px_rgba(0,134,117,0.22)] hover:-translate-y-1.5 transition-all duration-500 group h-80 sm:h-96 flex flex-col justify-end border border-gray-100/50">
          <!-- Background Image -->
          <img src="${img}" alt="${item.title}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out z-0">
          
          <!-- Bottom Glow Gradient Overlay (เงาฟุ้งเฉพาะส่วนล่าง) -->
          <div class="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#002b26] via-[#004d43]/70 to-transparent z-10 transition-opacity duration-300"></div>

          <!-- Content Box inside Overlay -->
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
                  <a href="${item.file_url}" target="_blank" download class="flex-2 py-2 px-3 bg-brand-teal text-white hover:bg-white hover:text-[#005a4e] font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5">
                    <i class="fi fi-rr-download"></i> ดาวน์โหลด
                  </a>
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
    });
  } else if (hash === "about_history") {
    // Layout แบบประวัติความเป็นมา (About / History articles)
    html += `<div class="flex flex-col gap-8 py-2">`;

    itemsToShow.forEach(item => {
      html += `
        <div class="bg-white border border-[rgba(0,134,117,0.15)] rounded-3xl p-6 md:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_45px_rgba(0,134,117,0.08)] transition-all duration-300">
          ${item.image_url ? `
            <div class="w-full h-64 md:h-96 rounded-2xl overflow-hidden bg-gray-50 mb-6 border border-gray-100">
              <img src="${item.image_url}" alt="${item.title}" class="w-full h-full object-cover">
            </div>
          ` : ''}
          <div>
            <div class="flex items-center gap-2 text-xs text-brand-teal font-bold mb-2 uppercase tracking-wider">
              <i class="fi fi-rr-book-alt"></i> ประวัติและความเป็นมา
            </div>
            <h2 class="text-xl md:text-2xl font-bold text-gray-800 mb-4 leading-relaxed">${item.title}</h2>
            <div class="text-gray-700 text-base leading-loose whitespace-pre-line mb-6 font-normal">
              ${item.description || ''}
            </div>
            <div class="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4 mt-4">
              ${item.link ? `
                <a href="${item.link}" target="_blank" class="px-4 py-2.5 bg-[rgba(0,134,117,0.08)] text-brand-teal font-bold text-xs rounded-xl hover:bg-brand-teal hover:text-white transition-all inline-flex items-center gap-1.5">
                  <i class="fi fi-rr-link"></i> อ่านเพิ่มเติม
                </a>
              ` : ''}
              ${item.file_url ? `
                <a href="${item.file_url}" target="_blank" download class="px-4 py-2.5 bg-brand-teal text-white font-bold text-xs rounded-xl hover:bg-[#007062] transition-all inline-flex items-center gap-1.5">
                  <i class="fi fi-rr-download"></i> ดาวน์โหลดไฟล์ประวัติ
                </a>
              ` : ''}
              <span class="text-xs text-gray-400 ml-auto inline-flex items-center gap-1">
                <i class="fi fi-rr-clock"></i> 
                ปรับปรุงเมื่อ: ${new Date(item.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      `;
    });
  } else {
    // Layout แบบ Grid Card ดีไซน์การ์ดทรงสูงสะอาดตา ไม่อึดอัด
    html += `<div class="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">`;

    itemsToShow.forEach(item => {
      const formattedDate = item.created_at ? new Date(item.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
      const img = item.image_url;

      html += `
        <div class="bg-white border border-teal-900/10 rounded-3xl overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(0,134,117,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full w-full">
          
          ${img ? `
            <!-- Document / Photo Container (Edge-to-edge fit) -->
            <div class="w-full h-64 sm:h-72 overflow-hidden border-b border-gray-100 relative group">
              <img src="${img}" alt="${item.title}" class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500">
            </div>
          ` : ''}

          <!-- Content Body -->
          <div class="p-8 sm:p-6 flex flex-col justify-between flex-1 gap-4">
            <div>
              <div class="flex items-center gap-1.5 text-xs font-semibold text-brand-teal mb-2">
                <i class="fi fi-rr-clock text-[11px]"></i> ${formattedDate}
              </div>
              <h3 class="text-base sm:text-lg font-bold text-gray-800 leading-snug line-clamp-3 mb-2 hover:text-brand-teal transition-colors">${item.title}</h3>
              ${item.description ? `<p class="text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed font-normal">${item.description}</p>` : ''}
            </div>

            <div class="flex items-center gap-2 pt-3 border-t border-gray-100 mt-auto">
              ${item.link ? `
                <a href="${item.link}" target="_blank" class="flex-1 py-2 px-3 bg-teal-50 text-brand-teal  hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border border-teal-100/80 shadow-2xs">
                  <i class="fi fi-rr-link"></i> ลิงก์ที่เกี่ยวข้อง
                </a>
              ` : ''}
              ${item.file_url ? `
                <a href="${item.file_url}" target="_blank" download class="flex-1 py-2 px-3 bg-brand-teal text-black hover:bg-teal-700 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5">
                  <i class="fi fi-rr-download"></i> ดาวน์โหลดไฟล์
                </a>
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
    });
  }

  html += `</div>`;

  // Add Pagination Controls if needed
  if (totalPages > 1) {
    html += renderPaginationControls(totalPages);
  }

  container.innerHTML = html;
}

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
