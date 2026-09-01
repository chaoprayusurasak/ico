/**
 * Module: src-admin/admin_faq.js
 * Admin FAQ / Citizen Q&A Forum Management & Reply Modal
 */

window.loadAdminFaqData = async function () {
  const container = document.getElementById("items-list-container");
  if (!container) return;

  try {
    let faqs = [];
    const res1 = await supabase.from("faqs").select("*").order("created_at", { ascending: false });
    if (!res1.error && res1.data && res1.data.length > 0) {
      faqs = res1.data;
    } else {
      const res2 = await supabase.from("evaluations").select("*").eq("category", "eval_faq").order("created_at", { ascending: false });
      if (!res2.error && res2.data) {
        faqs = res2.data.map(item => {
          let code = item.code || `611470/${item.id}`;
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
            admin_answer: item.admin_answer || "",
            status: item.admin_answer ? "ตอบแล้ว" : (item.status || "รอการตอบ"),
            created_at: item.created_at
          };
        });
      }
    }
    renderAdminFaqTable(faqs);
  } catch (e) {
    console.error("Admin FAQ load error:", e);
  }
};

window.renderAdminFaqTable = function (faqs) {
  const container = document.getElementById("items-list-container");
  window.ADMIN_CURRENT_FAQS = faqs;
  if (!container) return;

  if (!faqs || faqs.length === 0) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-16 gap-3 text-gray-400 text-center">
        <i class="fi fi-rr-comment-alt text-5xl text-amber-500"></i>
        <p class="text-base font-light text-gray-500">ยังไม่มีรายการคำถามจากประชาชนในระบบ</p>
      </div>
    `;
    return;
  }

  let html = `
    <div class="w-full min-w-0 overflow-x-auto rounded-2xl border border-gray-200/80 shadow-2xs bg-white">
      <table class="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr class="bg-slate-100/90 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
            <th class="py-3 px-3 w-28">รหัส</th>
            <th class="py-3 px-3.5">เรื่อง / รายละเอียดคำถาม</th>
            <th class="py-3 px-3 w-28">ประเภท</th>
            <th class="py-3 px-3.5 w-36">วันที่ส่ง</th>
            <th class="py-3 px-3 w-28">สถานะ</th>
            <th class="py-3 px-3.5 text-right w-36">การตอบกลับ</th>
          </tr>
        </thead>
        <tbody id="admin-items-tbody" class="divide-y divide-gray-100 bg-white">
  `;

  faqs.forEach((item, index) => {
    const code = item.code || `611470/${item.id}`;
    const title = item.title || "ไม่ระบุเรื่อง";
    const type = item.type || "คำถาม";
    const detail = item.question_detail || "ไม่มีรายละเอียด";
    const status = item.admin_answer ? "ตอบแล้ว" : (item.status || "รอการตอบ");

    let dateStr = "2026-08-04";
    if (item.created_at) {
      dateStr = new Date(item.created_at).toLocaleString('th-TH');
    }

    const statusBadge = status === "ตอบแล้ว"
      ? `<span class="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs sm:text-sm rounded-full font-light">ตอบแล้ว</span>`
      : `<span class="inline-block px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs sm:text-sm rounded-full font-light">รอการตอบ</span>`;

    html += `
      <tr class="hover:bg-slate-50/80 transition-colors">
        <td class="py-4 px-3 font-light text-gray-700 text-sm sm:text-base">${code}</td>
        <td class="py-4 px-4 max-w-sm">
          <div class="font-light text-gray-900 text-base sm:text-lg mb-1">${title}</div>
          <div class="text-xs sm:text-sm text-gray-500 line-clamp-2 font-light">${detail}</div>
          ${item.admin_answer ? `
            <div class="mt-2 text-xs sm:text-sm bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-900 font-light">
              <span class="font-normal text-emerald-700">คำตอบเจ้าหน้าที่:</span> ${item.admin_answer}
            </div>
          ` : ''}
        </td>
        <td class="py-4 px-3 text-gray-600 text-xs sm:text-sm font-light">${type}</td>
        <td class="py-4 px-4 text-xs sm:text-sm text-gray-500 font-light">${dateStr}</td>
        <td class="py-4 px-3">${statusBadge}</td>
        <td class="py-4 px-4 text-right">
          <button onclick="openAdminReplyModal('${item.id}')" class="px-3.5 py-2 bg-brand-teal hover:bg-teal-700 text-white text-xs sm:text-sm font-light rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5">
            <i class="fi fi-rr-comment-alt"></i> ตอบคำถาม
          </button>
        </td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = html;
};

window.openAdminReplyModal = (id) => {
  const item = (window.ADMIN_CURRENT_FAQS || []).find(f => f.id == id);
  if (!item) return;

  document.getElementById("admin-reply-faq-id").value = item.id;
  const infoEl = document.getElementById("admin-faq-question-info");
  if (infoEl) {
    infoEl.innerHTML = `
      <div class="font-bold text-gray-800 text-sm mb-1">${item.title}</div>
      <div class="text-xs text-gray-600 mb-2">${item.question_detail}</div>
      <div class="text-[11px] text-gray-400 font-semibold">รหัสอ้างอิง: ${item.code} | ส่งเมื่อ: ${new Date(item.created_at).toLocaleDateString('th-TH')}</div>
    `;
  }
  document.getElementById("admin-reply-textarea").value = item.admin_answer || "";
  document.getElementById("admin-reply-faq-modal").classList.remove("hidden");
};

window.closeAdminReplyModal = () => {
  const modal = document.getElementById("admin-reply-faq-modal");
  if (modal) modal.classList.add("hidden");
};

window.saveAdminFaqReply = async (e) => {
  e.preventDefault();
  const id = document.getElementById("admin-reply-faq-id").value;
  const replyText = document.getElementById("admin-reply-textarea").value.trim();

  if (!id || !replyText) return;

  try {
    await supabase.from("evaluations").update({
      admin_answer: replyText,
      status: "ตอบแล้ว"
    }).eq("id", id);

    await supabase.from("faqs").update({
      admin_answer: replyText,
      status: "ตอบแล้ว"
    }).eq("id", id);

    closeAdminReplyModal();
    alert("บันทึกคำตอบเรียบร้อยแล้ว!");
    if (typeof loadItems === 'function') loadItems();
  } catch (err) {
    console.error("Error saving reply:", err);
    alert("ไม่สามารถบันทึกคำตอบได้: " + err.message);
  }
};
