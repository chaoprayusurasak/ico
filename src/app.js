// Category Mapping to friendly Thai names
const CATEGORY_NAMES = {
  // Nav Menu Categories
  "home": "หน้าแรก",
  "news_sbr": "ข่าวสารจาก สขร.",
  "announcements": "ประกาศล่าสุด",
  "popular_services": "บริการยอดนิยม",
  "about_history": "ประวัติความเป็นมา",
  "executives": "คณะผู้บริหาร",
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
  "privacy": "นโยบายการคุ้มครองข้อมูลส่วนบุคคล",

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

  if (titleEl && boxEl) {
    defaultContentTitle = titleEl.innerHTML;
    defaultContentBoxHTML = boxEl.innerHTML;
  }

  // Setup routing listener
  window.addEventListener("hashchange", handleRouting);

  // Initial route handling
  handleRouting();
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

  // Highlight active sidebar link
  highlightSidebarLink(hash);

  const titleEl = document.querySelector(".content-title");
  const boxEl = document.querySelector(".content-box");

  if (!titleEl || !boxEl) return;

  // Set title with Typewriter Animation
  const thaiTitle = CATEGORY_NAMES[hash] || "หน้าแรก";
  typewriterEffect(titleEl, thaiTitle, 55);

  // If home, render Animated Landmark Map component
  if (hash === "home" && defaultContentBoxHTML) {
    boxEl.innerHTML = defaultContentBoxHTML;
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

  // Fetch dynamic items from Supabase
  renderLoading(boxEl);

  try {
    const { data: items, error } = await supabase
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

      const { data: inserted, error: insertErr } = await supabase
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

// Highlight Sidebar Link
function highlightSidebarLink(hash) {
  const links = document.querySelectorAll(".sidebar-link");
  links.forEach(link => {
    link.classList.remove("active");
    const linkId = link.getAttribute("data-id");
    if (linkId === hash) {
      link.classList.add("active");
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

  // Dedicated Index Directory Catalog View for #index_files
  if (hash === "index_files") {
    let html = `
      <div class="flex flex-col gap-6 py-2">
        <div class="bg-gradient-to-r from-brand-teal to-teal-800 text-white p-6 rounded-2xl shadow-md">
          <h2 class="text-xl font-bold mb-1 flex items-center gap-2">
            <i class="fi fi-rr-folder-open"></i> สารบัญดัชนีข่าวสารราชการ ประจำศูนย์ข้อมูลข่าวสาร
          </h2>
          <p class="text-xs text-teal-100 opacity-90 leading-relaxed">
            เลือกหัวข้อดัชนีประจำแฟ้มเพื่อเข้าถึงรายการข้อมูลข่าวสารตาม พ.ร.บ. ข้อมูลข่าวสารของราชการ พ.ศ. 2540
          </p>
        </div>

        <!-- Section 7 Category Cards -->
        <div>
          <h3 class="font-bold text-gray-800 text-base mb-3 flex items-center gap-2 border-b border-gray-200 pb-2">
            <span class="w-3 h-3 rounded-full bg-brand-teal inline-block"></span> ดัชนีข่าวสารตามมาตรา 7
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a href="#m7_1" class="p-4 bg-white border border-gray-100 hover:border-brand-teal rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-3 group">
              <div class="w-10 h-10 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-brand-teal group-hover:text-white transition-colors">7(1)</div>
              <div>
                <div class="font-bold text-sm text-gray-800 group-hover:text-brand-teal transition-colors">โครงสร้างและการจัดองค์กร</div>
                <div class="text-xs text-gray-500">การดำเนินงาน และแผนผังหน่วยงาน</div>
              </div>
            </a>
            <a href="#m7_2" class="p-4 bg-white border border-gray-100 hover:border-brand-teal rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-3 group">
              <div class="w-10 h-10 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-brand-teal group-hover:text-white transition-colors">7(2)</div>
              <div>
                <div class="font-bold text-sm text-gray-800 group-hover:text-brand-teal transition-colors">สรุปอำนาจหน้าที่สำคัญ</div>
                <div class="text-xs text-gray-500">และวิธีการดำเนินงานของราชการ</div>
              </div>
            </a>
            <a href="#m7_3" class="p-4 bg-white border border-gray-100 hover:border-brand-teal rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-3 group">
              <div class="w-10 h-10 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-brand-teal group-hover:text-white transition-colors">7(3)</div>
              <div>
                <div class="font-bold text-sm text-gray-800 group-hover:text-brand-teal transition-colors">สถานที่ติดต่อขอรับข้อมูล</div>
                <div class="text-xs text-gray-500">ช่องทางการขอรับข้อมูลข่าวสาร</div>
              </div>
            </a>
            <a href="#m7_4" class="p-4 bg-white border border-gray-100 hover:border-brand-teal rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-3 group">
              <div class="w-10 h-10 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-brand-teal group-hover:text-white transition-colors">7(4)</div>
              <div>
                <div class="font-bold text-sm text-gray-800 group-hover:text-brand-teal transition-colors">กฎ มติ ครม. และคำสั่งระเบียบ</div>
                <div class="text-xs text-gray-500">ที่เกี่ยวข้องโดยตรงกับการปฏิบัติงาน</div>
              </div>
            </a>
          </div>
        </div>

        <!-- Section 9 Category Cards -->
        <div class="mt-2">
          <h3 class="font-bold text-gray-800 text-base mb-3 flex items-center gap-2 border-b border-gray-200 pb-2">
            <span class="w-3 h-3 rounded-full bg-teal-600 inline-block"></span> ดัชนีข่าวสารตามมาตรา 9
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <a href="#m9_1" class="p-3.5 bg-white border border-gray-100 hover:border-brand-teal rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col gap-1 group">
              <span class="text-xs font-bold text-brand-teal">ม.9 (1)</span>
              <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">ผลการพิจารณาอนุมัติ</span>
            </a>
            <a href="#m9_2" class="p-3.5 bg-white border border-gray-100 hover:border-brand-teal rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col gap-1 group">
              <span class="text-xs font-bold text-brand-teal">ม.9 (2)</span>
              <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">นโยบายและการตีความ</span>
            </a>
            <a href="#m9_3" class="p-3.5 bg-white border border-gray-100 hover:border-brand-teal rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col gap-1 group">
              <span class="text-xs font-bold text-brand-teal">ม.9 (3)</span>
              <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">แผนงาน/โครงการงบประมาณ</span>
            </a>
            <a href="#m9_4" class="p-3.5 bg-white border border-gray-100 hover:border-brand-teal rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col gap-1 group">
              <span class="text-xs font-bold text-brand-teal">ม.9 (4)</span>
              <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">คู่มือและคำสั่งการทำงาน</span>
            </a>
            <a href="#m9_5" class="p-3.5 bg-white border border-gray-100 hover:border-brand-teal rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col gap-1 group">
              <span class="text-xs font-bold text-brand-teal">ม.9 (5)</span>
              <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">สิ่งพิมพ์ราชการ</span>
            </a>
            <a href="#m9_6" class="p-3.5 bg-white border border-gray-100 hover:border-brand-teal rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col gap-1 group">
              <span class="text-xs font-bold text-brand-teal">ม.9 (6)</span>
              <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">สัญญาสัมปทาน / ร่วมทุน</span>
            </a>
            <a href="#m9_7" class="p-3.5 bg-white border border-gray-100 hover:border-brand-teal rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col gap-1 group">
              <span class="text-xs font-bold text-brand-teal">ม.9 (7)</span>
              <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">มติคณะรัฐมนตรี / คำสั่ง</span>
            </a>
            <a href="#m9_8" class="p-3.5 bg-white border border-gray-100 hover:border-brand-teal rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col gap-1 group">
              <span class="text-xs font-bold text-brand-teal">ม.9 (8)</span>
              <span class="text-xs font-bold text-gray-800 group-hover:text-brand-teal transition-colors line-clamp-1">ข้อมูลข่าวสารอื่นที่กำหนด</span>
            </a>
          </div>
        </div>
      </div>
    `;
    container.innerHTML = html;
    return;
  }

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
    // Layout แบบ Grid Card ดีไซน์ใหม่ซ้อนทับ gradient ฟุ้งด้านล่าง
    html += `<div class="grid grid-cols-1 md:grid-cols-2 gap-6 py-2">`;

    itemsToShow.forEach(item => {
      const defaultImg = "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80";
      const img = item.image_url || defaultImg;
      const formattedDate = new Date(item.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });

      html += `
        <div class="relative rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_45px_rgba(0,134,117,0.2)] hover:-translate-y-1.5 transition-all duration-500 group min-h-[300px] flex flex-col justify-end border border-gray-100/50">
          <!-- Background Image -->
          <img src="${img}" alt="${item.title}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out z-0">
          
          <!-- Bottom Glow Gradient Overlay (เงาฟุ้งเฉพาะส่วนล่าง) -->
          <div class="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#002b26] via-[#004d43]/70 to-transparent z-10 transition-opacity duration-300"></div>

          <!-- Content Box inside Overlay -->
          <div class="relative z-20 p-6 text-white flex flex-col justify-end h-full">
            <div class="mt-auto">
              <div class="flex items-center gap-1.5 text-xs font-semibold text-teal-200 uppercase tracking-wider mb-2">
                <i class="fi fi-rr-clock text-[11px]"></i> ${formattedDate}
              </div>
              <h3 class="text-lg sm:text-xl font-bold leading-snug text-white drop-shadow-sm line-clamp-2 group-hover:text-teal-100 transition-colors mb-2">${item.title}</h3>
              ${item.description ? `<p class="text-xs text-teal-100/90 line-clamp-2 mb-4 font-normal leading-relaxed">${item.description}</p>` : ''}
              
              <div class="flex items-center gap-2 pt-3 border-t border-white/20">
                ${item.link ? `
                  <a href="${item.link}" target="_blank" class="flex-1 py-2 px-3 bg-white/20 hover:bg-white text-white hover:text-[#005a4e] backdrop-blur-md font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm">
                    <i class="fi fi-rr-link"></i> ลิงก์ที่เกี่ยวข้อง
                  </a>
                ` : ''}
                ${item.file_url ? `
                  <a href="${item.file_url}" target="_blank" download class="flex-1 py-2 px-3 bg-brand-teal text-white hover:bg-white hover:text-[#005a4e] font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5">
                    <i class="fi fi-rr-download"></i> ดาวน์โหลดไฟล์
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
