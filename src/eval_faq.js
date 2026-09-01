/**
 * Module: eval_faq.js
 * Dedicated Q&A Forum / FAQ Board view renderer and Supabase database submission handler.
 * Design: Matches citizen Q&A board interface with question posting modal and admin response viewer.
 */

window.renderEvalFaqView = async function (container) {
  if (!container) return;

  // Hide top page header banner on eval_faq page
  const headerBanner = document.getElementById("page-header-banner");
  if (headerBanner) {
    headerBanner.style.display = "none";
  }

  container.innerHTML = `
       <!-- Premium Hero Header Banner (Deep Emerald Gradient + Glassmorphism Pill) -->
      <div class="relative bg-gradient-to-br from-[#1B3834] via-[#008675] to-[#0A4D45] text-white p-6 sm:p-9 rounded-xl shadow-lg mb-8 overflow-hidden">
        <!-- Background Ambient Decorative Elements -->
        <div class="absolute -top-12 -right-12 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-16 -left-16 w-60 h-60 bg-emerald-400/15 rounded-full blur-2xl pointer-events-none"></div>
        <div class="relative z-10">
          <h2 class="text-xl sm:text-3xl font-medium mb-2.5 tracking-tight leading-snug">
            กระดานถามตอบ
          </h2>
          <p class="text-teal-100 text-xs sm:text-sm font-normal leading-relaxed max-w-2xl opacity-90">
            ศูนย์ข้อมูลข่าวสารอิเล็กทรอนิกส์ของราชการ เทศบาลนครเจ้าพระยาสุรศักดิ์
          </p>
        </div>
      </div>

      <!-- Action Button Bar: Yellow "ตั้งคำถาม" Button -->
      <div class="flex items-center justify-between mb-6">
        <button onclick="openAskQuestionModal()" class="px-5 py-2.5 bg-[#FFCC00] hover:bg-[#E6B800] text-gray-900 font-medium text-sm rounded-md shadow-xs transition-all cursor-pointer inline-flex items-center gap-2">
          <i class="fi fi-rr-edit text-xs"></i>
          <span>ตั้งคำถาม</span>
        </button>

        <button onclick="renderEvalFaqView(document.querySelector('.content-box'))" class="text-xs text-gray-500 hover:text-brand-teal flex items-center gap-1 font-normal cursor-pointer">
          <i class="fi fi-rr-refresh text-xs"></i>
          <span>อัปเดตข้อมูล</span>
        </button>
      </div>

      <!-- Q&A Table Container -->
      <div class="bg-white border border-gray-200 rounded-lg shadow-2xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs sm:text-sm">
            <thead class="bg-gray-50 text-gray-800 font-medium border-b border-gray-200">
              <tr>
                <th class="py-3.5 px-4 w-28">รหัส</th>
                <th class="py-3.5 px-4 min-w-[200px]">เรื่อง</th>
                <th class="py-3.5 px-4 w-32">ประเภท</th>
                <th class="py-3.5 px-4 w-44">วันที่ส่ง</th>
                <th class="py-3.5 px-4 w-28">สถานะ</th>
                <th class="py-3.5 px-4 w-32 text-right"></th>
              </tr>
            </thead>
            <tbody id="faq-table-body" class="divide-y divide-gray-100 font-normal text-gray-700">
              <tr>
                <td colspan="6" class="py-12 text-center text-gray-400 text-xs">
                  <div class="inline-block w-6 h-6 border-2 border-brand-teal border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p>กำลังโหลดรายการกระดานถามตอบ...</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- Modal 1: Post New Question Modal (ฟอร์มตั้งคำถาม) -->
    <div id="ask-question-modal" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 hidden">
      <div class="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 font-kanit relative animate-in fade-in zoom-in duration-200">
        <button onclick="closeAskQuestionModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl cursor-pointer">
          &times;
        </button>

        <div class="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <i class="fi fi-rr-comment-alt text-amber-500 text-xl"></i>
          <h3 class="font-medium text-base sm:text-lg text-gray-800">แบบฟอร์มตั้งคำถามใหม่</h3>
        </div>

        <form id="ask-question-form" onsubmit="submitCitizenQuestion(event)" class="space-y-4">
          <div>
            <label class="block text-xs sm:text-sm font-normal text-gray-700 mb-1">
              ประเภทคำถาม <span class="text-rose-500">*</span>
            </label>
            <select name="question_type" required class="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-brand-teal focus:bg-white transition-all">
              <option value="คำถาม">คำถามทั่วไป</option>
              <option value="การรับสมัครงาน">การรับสมัครงาน</option>
              <option value="ขั้นตอนบริการ">ขั้นตอนบริการ/ขอเอกสาร</option>
              <option value="ข้อคิดเห็น">ข้อคิดเห็น/ข้อเสนอแนะ</option>
            </select>
          </div>

          <div>
            <label class="block text-xs sm:text-sm font-normal text-gray-700 mb-1">
              เรื่อง / หัวข้อคำถาม <span class="text-rose-500">*</span>
            </label>
            <input type="text" name="question_title" required placeholder="ระบุเรื่องหรือหัวข้อคำถาม..." class="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-brand-teal focus:bg-white transition-all">
          </div>

          <div>
            <label class="block text-xs sm:text-sm font-normal text-gray-700 mb-1">
              รายละเอียดคำถาม <span class="text-rose-500">*</span>
            </label>
            <textarea name="question_detail" rows="4" required placeholder="พิมพ์รายละเอียดข้อสงสัยที่ต้องการสอบถาม..." class="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-brand-teal focus:bg-white transition-all"></textarea>
          </div>

          <div id="ask-status-msg" class="hidden p-3 rounded-md text-xs font-normal"></div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button type="button" onclick="closeAskQuestionModal()" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-normal text-xs rounded-md cursor-pointer">
              ยกเลิก
            </button>
            <button type="submit" id="ask-submit-btn" class="px-5 py-2 bg-[#008675] hover:bg-teal-700 text-white font-normal text-xs rounded-md shadow-xs cursor-pointer inline-flex items-center gap-1.5">
              <i class="fi fi-rr-paper-plane text-xs"></i>
              <span>ส่งคำถาม</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal 2: View Question & Admin Answer Detail Modal -->
    <div id="view-faq-modal" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 hidden">
      <div class="bg-white rounded-xl shadow-xl max-w-xl w-full p-6 font-kanit relative animate-in fade-in zoom-in duration-200">
        <button onclick="closeViewFaqModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl cursor-pointer">
          &times;
        </button>

        <div id="view-faq-content" class="space-y-4">
          <!-- Content Dynamically Populated -->
        </div>
      </div>
    </div>
  `;

  // Fetch Questions from Supabase
  await fetchAndRenderFaqTable();
};

window.openAskQuestionModal = function () {
  const modal = document.getElementById("ask-question-modal");
  if (modal) modal.classList.remove("hidden");
};

window.closeAskQuestionModal = function () {
  const modal = document.getElementById("ask-question-modal");
  if (modal) modal.classList.add("hidden");
};

window.closeViewFaqModal = function () {
  const modal = document.getElementById("view-faq-modal");
  if (modal) modal.classList.add("hidden");
};

async function fetchAndRenderFaqTable() {
  const tbody = document.getElementById("faq-table-body");
  if (!tbody) return;

  const sb = (typeof window !== "undefined" && window.supabase && typeof window.supabase.from === "function") ? window.supabase : (typeof supabase !== "undefined" ? supabase : null);

  let rawFaqs = [];

  try {
    if (sb) {
      // 1. Try querying 'faqs' table first
      const res1 = await sb.from("faqs").select("*").order("created_at", { ascending: false });
      if (!res1.error && res1.data && res1.data.length > 0) {
        rawFaqs = res1.data;
      } else {
        // 2. Query 'evaluations' table where category = 'eval_faq'
        const res2 = await sb.from("evaluations").select("*").eq("category", "eval_faq").order("created_at", { ascending: false });
        if (!res2.error && res2.data && res2.data.length > 0) {
          rawFaqs = res2.data.map(item => parseEvaluationRowToFaq(item));
        }
      }
    }
  } catch (err) {
    console.error("Error fetching FAQ data:", err);
  }

  // Sample data fallback if no records exist anywhere
  if (rawFaqs.length === 0) {
    rawFaqs = [
      {
        id: 1,
        code: "611470/1",
        title: "การรับสมัครงาน",
        type: "คำถาม",
        question_detail: "สอบถามตำแหน่งว่างและการรับสมัครพนักงานจ้างเทศบาลนครเจ้าพระยาสุรศักดิ์ มีเปิดรับสมัครช่วงไหนบ้างครับ?",
        status: "ตอบแล้ว",
        admin_answer: "เทศบาลนครเจ้าพระยาสุรศักดิ์ มีกำหนดการรับสมัครพนักงานจ้างตามภารกิจในเดือนถัดไป ท่านสามารถติดตามประกาศรับสมัครงานได้ที่หน้าข่าวประกาศรับสมัครงานของเว็บไซต์ครับ",
        created_at: "2026-08-04T11:12:00.000Z"
      },
      {
        id: 2,
        code: "611470/2",
        title: "ขั้นตอนการยื่นคำร้องขอข้อมูลข่าวสารตามมาตรา 9",
        type: "คำถาม",
        question_detail: "ต้องการยื่นขอสำเนารายงานการประชุมบอร์ด สามารถยื่นออนไลน์ได้ทางไหนบ้างคะ?",
        status: "ตอบแล้ว",
        admin_answer: "ท่านสามารถยื่นขอข้อมูลข่าวสารผ่านระบบออนไลน์ที่หน้าศูนย์ข้อมูลข่าวสารอิเล็กทรอนิกส์ หัวข้อ ยื่นคำร้องขอข้อมูลข่าวสาร ได้ตลอด 24 ชั่วโมงครับ",
        created_at: "2026-08-03T14:30:00.000Z"
      }
    ];
  }

  window.CURRENT_FAQS_DATA = rawFaqs;

  let html = "";
  rawFaqs.forEach((item, index) => {
    const code = item.code || `611470/${item.id || (index + 1)}`;
    const title = item.title || "ไม่ระบุเรื่อง";
    const type = item.type || "คำถาม";
    const status = item.admin_answer ? "ตอบแล้ว" : (item.status || "รอการตอบ");
    
    // Format Date: YYYY-MM-DD HH:mm:ss.000
    let dateStr = "2026-08-04 11:12:00.000";
    if (item.created_at) {
      const d = new Date(item.created_at);
      const pad = (n) => String(n).padStart(2, '0');
      dateStr = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.000`;
    }

    const statusBadge = status === "ตอบแล้ว" 
      ? `<span class="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs rounded-full font-normal">ตอบแล้ว</span>`
      : `<span class="inline-block px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs rounded-full font-normal">รอการตอบ</span>`;

    html += `
      <tr class="hover:bg-gray-50/80 transition-colors">
        <td class="py-3.5 px-4 font-normal text-gray-600">${code}</td>
        <td class="py-3.5 px-4 font-normal text-sky-700 hover:underline cursor-pointer" onclick="viewFaqDetail('${item.id || index}')">
          ${title}
        </td>
        <td class="py-3.5 px-4 text-gray-600 font-normal">${type}</td>
        <td class="py-3.5 px-4 text-gray-500 font-normal text-xs whitespace-nowrap">${dateStr}</td>
        <td class="py-3.5 px-4">${statusBadge}</td>
        <td class="py-3.5 px-4 text-right">
          <button onclick="viewFaqDetail('${item.id || index}')" class="text-sky-600 hover:text-sky-800 text-xs font-normal hover:underline cursor-pointer">
            อ่านรายละเอียด
          </button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function parseEvaluationRowToFaq(item) {
  let code = item.code || `611470/${item.id || 1}`;
  let type = item.type || "คำถาม";
  let title = item.title || item.improvement_suggestion || "ไม่ระบุเรื่อง";

  if (item.level_label && item.level_label.includes("|")) {
    const parts = item.level_label.split("|").map(s => s.trim());
    if (parts.length >= 2) {
      type = parts[0];
      code = parts[1];
    }
  }

  return {
    id: item.id,
    code: code,
    title: title,
    type: type,
    question_detail: item.comments || item.question_detail || "ไม่มีรายละเอียด",
    status: item.admin_answer ? "ตอบแล้ว" : (item.status || "รอการตอบ"),
    admin_answer: item.admin_answer || "",
    created_at: item.created_at || new Date().toISOString()
  };
}

window.viewFaqDetail = function (idOrIndex) {
  const faqs = window.CURRENT_FAQS_DATA || [];
  const item = faqs.find(f => String(f.id) === String(idOrIndex)) || faqs[idOrIndex];

  if (!item) return;

  const modal = document.getElementById("view-faq-modal");
  const content = document.getElementById("view-faq-content");
  if (!modal || !content) return;

  const code = item.code || `611470/${item.id || 1}`;
  const title = item.title || "ไม่ระบุเรื่อง";
  const type = item.type || "คำถาม";
  const detail = item.question_detail || item.comments || "ไม่มีรายละเอียดคำถาม";

  let dateStr = "2026-08-04 11:12:00";
  if (item.created_at) {
    dateStr = new Date(item.created_at).toLocaleString('th-TH');
  }

  content.innerHTML = `
    <div class="border-b border-gray-100 pb-3">
      <div class="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md mb-2">
        ประเภท: ${type}
      </div>
      <h3 class="text-base sm:text-lg font-medium text-gray-900">${title}</h3>
      <div class="text-xs text-gray-400 font-normal mt-1 flex items-center gap-2">
        <span>วันที่ส่ง: ${dateStr}</span>
      </div>
    </div>

    <!-- Citizen Question Box -->
    <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div class="text-xs font-medium text-gray-500 mb-1.5">รายละเอียดคำถาม:</div>
      <p class="text-xs sm:text-sm text-gray-800 font-normal leading-relaxed whitespace-pre-line">
        ${detail}
      </p>
    </div>

    <!-- Admin Answer Box -->
    ${item.admin_answer ? `
      <div class="bg-emerald-50/80 p-4 rounded-lg border border-emerald-200 space-y-1.5">
        <div class="flex items-center justify-between text-xs font-medium text-emerald-800">
          <span class="flex items-center gap-1.5">
            <i class="fi fi-rr-check-circle text-emerald-600"></i>
            คำตอบจากเจ้าหน้าที่ (เทศบาลนครเจ้าพระยาสุรศักดิ์)
          </span>
          <span class="text-emerald-600 font-normal text-[11px]">ตอบแล้ว</span>
        </div>
        <p class="text-xs sm:text-sm text-emerald-900 font-normal leading-relaxed whitespace-pre-line pt-1">
          ${item.admin_answer}
        </p>
      </div>
    ` : `
      <div class="bg-amber-50 p-3.5 rounded-lg border border-amber-200 text-xs text-amber-800 font-normal flex items-center gap-2">
        <i class="fi fi-rr-clock text-amber-600"></i>
        <span>คำถามนี้อยู่ระหว่างรอเจ้าหน้าที่ผู้รับผิดชอบดำเนินการตอบกลับ</span>
      </div>
    `}
  `;

  modal.classList.remove("hidden");
};

// Handle Posting Citizen Question
window.submitCitizenQuestion = async function (e) {
  e.preventDefault();

  const form = document.getElementById("ask-question-form");
  const submitBtn = document.getElementById("ask-submit-btn");
  const statusMsg = document.getElementById("ask-status-msg");

  if (!form) return;

  const formData = new FormData(form);
  const questionType = formData.get("question_type") || "คำถาม";
  const questionTitle = formData.get("question_title") || "";
  const questionDetail = formData.get("question_detail") || "";

  if (!questionTitle || !questionDetail) return;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<div class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> กำลังส่ง...`;
  }

  const generatedCode = `611470/${Math.floor(Math.random() * 900 + 100)}`;
  const sb = (typeof window !== "undefined" && window.supabase && typeof window.supabase.from === "function") ? window.supabase : (typeof supabase !== "undefined" ? supabase : null);

  // 1. Dedicated 'faqs' table payload
  const faqPayload = {
    code: generatedCode,
    category: "eval_faq",
    title: questionTitle,
    type: questionType,
    question_detail: questionDetail,
    status: "รอการตอบ",
    created_at: new Date().toISOString()
  };

  // 2. Compatible 'evaluations' table payload
  const evalPayload = {
    category: "eval_faq",
    satisfaction_level: 0,
    level_label: `${questionType} | ${generatedCode}`,
    improvement_suggestion: questionTitle,
    comments: questionDetail,
    created_at: new Date().toISOString()
  };

  try {
    if (sb) {
      // 1. Insert to 'evaluations' table with compatible columns
      const { error } = await sb.from("evaluations").insert([evalPayload]);
      if (error) {
        console.error("Supabase evaluations insert error:", error);
      }

      // 2. Try dedicated 'faqs' table if created
      try {
        await sb.from("faqs").insert([faqPayload]);
      } catch (faqErr) {
        // Ignore if faqs table doesn't exist
      }
    }

    if (statusMsg) {
      statusMsg.className = "p-3 rounded-md text-xs font-normal bg-emerald-50 text-emerald-800 border border-emerald-200 block";
      statusMsg.textContent = "ส่งคำถามเรียบร้อยแล้ว เจ้าหน้าที่จะดำเนินการตอบกลับโดยเร็วครับ";
    }

    form.reset();

    setTimeout(() => {
      closeAskQuestionModal();
      if (statusMsg) statusMsg.classList.add("hidden");
      fetchAndRenderFaqTable();
    }, 1200);

  } catch (err) {
    console.error("Error submitting question:", err);
    if (statusMsg) {
      statusMsg.className = "p-3 rounded-md text-xs font-normal bg-rose-50 text-rose-700 border border-rose-200 block";
      statusMsg.textContent = `เกิดข้อผิดพลาดในการส่งคำถาม: ${err.message || 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้'}`;
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fi fi-rr-paper-plane text-xs"></i> <span>ส่งคำถาม</span>`;
    }
  }
};
