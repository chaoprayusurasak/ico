// Category Mapping to friendly Thai names
const CATEGORY_NAMES = {
  "news_sbr": "ข่าวสารจาก สบร.",
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
  "article_sbr": "บทความ สขร.",
  "contact": "ติดตามหน่วยงาน (Contact Us)",
  "privacy": "Privacy Policy นโยบายการคุ้มครองข้อมูลส่วนบุคคล"
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

// Route handler
async function handleRouting() {
  const hash = window.location.hash.replace("#", "") || "news_sbr";

  // ตั้งค่าจำนวนรายการต่อหน้า (ข่าวสารใช้ 6 รายการ เพื่อให้เป็น 2 แถว แถวละ 3)
  ITEMS_PER_PAGE = hash === "news_sbr" ? 6 : 8;

  // Highlight active sidebar link
  highlightSidebarLink(hash);

  const titleEl = document.querySelector(".content-title");
  const boxEl = document.querySelector(".content-box");

  if (!titleEl || !boxEl) return;

  // Set title
  const thaiTitle = CATEGORY_NAMES[hash] || "ดัชนีรวม / ดัชนีประจำแฟ้ม";
  titleEl.textContent = thaiTitle;

  // If index_files (default homepage files/images), restore original static template
  if (hash === "index_files" && defaultContentBoxHTML) {
    boxEl.innerHTML = defaultContentBoxHTML;
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

    currentItems = items || [];
    currentPage = 1; // Reset to page 1 on new category
    renderItems(boxEl);
  } catch (err) {
    console.error("Error fetching items:", err);
    renderError(boxEl, "เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง");
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
  const items = currentItems;
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

  const hash = window.location.hash.replace("#", "") || "news_sbr";
  let html = ``;

  // เพิ่มแบนเนอร์ด้านบนสุดสำหรับหน้า ข่าวสาร สขร. (news_sbr)
  if (hash === "news_sbr" && currentPage === 1) {
    html += `
      <div class="w-full h-80 md:h-100 mb-8 rounded-2xl overflow-hidden shadow-sm relative bg-gray-100">
        <video src="./assets/Man_in_uniform_and_statue_202607091447.mp4" class="w-full h-full object-cover object-center" autoplay loop muted playsinline></video>
      </div>
    `;
  }

  if (hash === "news_sbr") {
    // Layout แบบ Grid 3 คอลัมน์ (สำหรับหน้าข่าวสาร)
    html += `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-2">`;

    itemsToShow.forEach(item => {
      const itemLink = item.link || item.file_url || "#";
      const btnText = item.file_url ? "ดาวน์โหลดไฟล์" : "อ่านรายละเอียด";
      const defaultImg = "https://placehold.co/400x400?text=No+Image";
      const img = item.image_url || defaultImg;

      html += `
        <div class="flex flex-col bg-white border border-gray-100 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(0,134,117,0.1)] transition-all overflow-hidden h-full group">
          <div class="w-full h-48 sm:h-56 overflow-hidden bg-gray-50 relative border-b border-gray-100">
            <img src="${img}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          </div>
          <div class="p-5 flex flex-col flex-grow">
            <div class="flex items-center gap-1 text-xs text-[#008675] font-bold mb-2 uppercase tracking-wide">
              <i class="fi fi-rr-calendar"></i>
              ${new Date(item.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
            <h3 class="text-lg font-bold text-gray-800 leading-snug mb-2 line-clamp-2 group-hover:text-brand-teal transition-colors">${item.title}</h3>
            <p class="text-sm text-gray-500 line-clamp-2 mb-5">${item.description || ''}</p>
            
            <div class="mt-auto flex items-center gap-3 w-full">
              ${item.link ? `
                <a href="${item.link}" target="_blank" class="flex-[1] py-2.5 px-2 border-2 border-[#696969] text-[#000000] bg-transparent font-bold text-center rounded-xl hover:bg-[#DCDCDC] hover:text-white transition-all flex items-center justify-center gap-1.5 text-sm">
                  <i class="fi fi-rr-link"></i> ลิงก์
                </a>
              ` : ''}
              ${item.file_url ? `
                <a href="${item.file_url}" target="_blank" download class="flex-[2] py-2.5 px-2 bg-[#008675] text-white font-bold text-center rounded-xl hover:bg-[#008900] hover:shadow-lg transition-all flex items-center justify-center gap-1.5 text-sm">
                  <i class="fi fi-rr-download"></i> โหลดไฟล์
                </a>
              ` : ''}
              ${!item.link && !item.file_url ? `
                <div class="flex-1 py-2.5 px-2 bg-gray-100 text-gray-400 font-bold text-center rounded-xl flex items-center justify-center text-sm cursor-not-allowed">
                  ไม่มีเอกสาร
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    });
  } else {
    // Layout แบบ List แนวนอน (สำหรับหน้าอื่นๆ ตามเดิม)
    html += `<div class="grid gap-6 py-2">`;

    itemsToShow.forEach(item => {
      html += `
        <div class="item-card flex flex-col md:flex-row gap-6 p-6 border border-[rgba(0,134,117,0.12)] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] bg-white hover:shadow-[0_12px_40px_rgba(0,134,117,0.06)] hover:-translate-y-[2px] transition-all duration-300">
          ${item.image_url ? `
            <div class="item-image-wrapper flex-shrink-0 w-full md:w-48 h-36 rounded-xl overflow-hidden bg-gray-50 border border-[rgba(0,0,0,0.05)]">
              <img src="${item.image_url}" alt="${item.title}" class="w-full h-full object-cover">
            </div>
          ` : ''}
          <div class="item-details flex-grow flex flex-col justify-between">
            <div>
              <h3 class="item-title text-lg font-bold text-gray-800 mb-2">${item.title}</h3>
              <p class="item-description text-gray-600 text-sm leading-relaxed mb-4 whitespace-pre-line">${item.description || ''}</p>
            </div>
            <div class="item-meta flex flex-wrap gap-3 items-center mt-auto">
              ${item.link ? `
                <a href="${item.link}" target="_blank" class="px-4 py-2 bg-[rgba(0,134,117,0.06)] text-[#008675] rounded-xl text-xs font-bold hover:bg-[#008675] hover:text-white transition-all duration-200 inline-flex items-center gap-1.5">
                  <i class="fi fi-rr-link"></i> ลิงก์ที่เกี่ยวข้อง
                </a>
              ` : ''}
              ${item.file_url ? `
                <a href="${item.file_url}" target="_blank" download class="px-4 py-2 bg-[rgba(85,187,176,0.06)] text-[#008675] rounded-xl text-xs font-bold hover:bg-[#55bbb0] hover:text-white transition-all duration-200 inline-flex items-center gap-1.5">
                  <i class="fi fi-rr-download"></i> ดาวน์โหลดไฟล์แนบ
                </a>
              ` : ''}
              <span class="text-xs text-gray-400 ml-auto inline-flex items-center gap-1">
                <i class="fi fi-rr-clock"></i> 
                ${new Date(item.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
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
