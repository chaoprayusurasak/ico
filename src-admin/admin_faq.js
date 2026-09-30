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
      faqs = res1.data.map(item => ({ ...item, source_table: "faqs" }));
    } else {
      const res2 = await supabase.from("evaluations").select("*").eq("category", "eval_faq").order("created_at", { ascending: false });
      if (res2.error) throw res2.error;
      if (res2.data) {
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
            source_table: "evaluations",
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
    const container = document.getElementById("items-list-container");
    if (container) {
      container.innerHTML = `
        <div class="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700" role="alert">
          โหลดคำถามไม่สำเร็จ: ${escapeAdminFaqHtml(e.message || e)}
        </div>
      `;
    }
  }
};

function escapeAdminFaqHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
}

window.renderAdminFaqTable = function (faqs) {
  const container = document.getElementById("items-list-container");
  window.ADMIN_CURRENT_FAQS = faqs;
  window.ADMIN_FAQ_PAGE = Math.max(1, Math.min(window.ADMIN_FAQ_PAGE || 1, Math.ceil((faqs || []).length / 10) || 1));
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

  const pageSize = 10;
  const pageCount = Math.ceil(faqs.length / pageSize);
  const pageStart = (window.ADMIN_FAQ_PAGE - 1) * pageSize;
  const visibleFaqs = faqs.slice(pageStart, pageStart + pageSize);

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
            <th class="py-3 px-3.5 text-right w-52">เครื่องมือจัดการ</th>
          </tr>
        </thead>
        <tbody id="admin-items-tbody" class="divide-y divide-gray-100 bg-white">
  `;

  visibleFaqs.forEach(item => {
    const code = escapeAdminFaqHtml(item.code || `611470/${item.id}`);
    const title = escapeAdminFaqHtml(item.title || "ไม่ระบุเรื่อง");
    const type = escapeAdminFaqHtml(item.type || "คำถาม");
    const detail = escapeAdminFaqHtml(item.question_detail || "ไม่มีรายละเอียด");
    const status = item.admin_answer ? "ตอบแล้ว" : escapeAdminFaqHtml(item.status || "รอการตอบ");
    const answer = escapeAdminFaqHtml(item.admin_answer || "");

    let dateStr = "-";
    if (item.created_at) {
      dateStr = escapeAdminFaqHtml(new Date(item.created_at).toLocaleString('th-TH'));
    }

    const statusBadge = status === "ตอบแล้ว"
      ? `<span class="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs rounded-full font-medium">ตอบแล้ว</span>`
      : `<span class="inline-block px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs rounded-full font-medium">รอการตอบ</span>`;

    html += `
      <tr class="hover:bg-slate-50/80 transition-colors">
        <td class="py-3 px-3 text-xs text-gray-700">${code}</td>
        <td class="py-3 px-3.5 max-w-sm">
          <div class="text-sm font-semibold text-gray-900 mb-0.5">${title}</div>
          <div class="text-xs text-gray-500 line-clamp-2">${detail}</div>
          ${answer ? `
            <div class="mt-2 text-xs bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 text-emerald-900">
              <span class="font-semibold text-emerald-700">คำตอบเจ้าหน้าที่:</span> ${answer}
            </div>
          ` : ''}
        </td>
        <td class="py-3 px-3 text-gray-600 text-xs">${type}</td>
        <td class="py-3 px-3.5 text-xs text-gray-500 whitespace-nowrap">${dateStr}</td>
        <td class="py-3 px-3">${statusBadge}</td>
        <td class="py-3 px-3.5 text-right whitespace-nowrap">
          <button onclick="openAdminReplyModal('${item.id}')" class="px-2.5 py-1.5 bg-brand-teal hover:bg-teal-700 text-white text-xs font-medium rounded-lg shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1">
            <i class="fi fi-rr-comment-alt"></i> ตอบคำถาม
          </button>
          <button onclick="deleteAdminFaq('${item.id}')" class="ml-1 px-2.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-medium rounded-lg transition-all cursor-pointer inline-flex items-center gap-1">
            <i class="fi fi-rr-trash"></i> ลบ
          </button>
        </td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
    ${pageCount > 1 ? `
      <div class="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-500" aria-label="เปลี่ยนหน้าคำถาม">
        <button type="button" onclick="setAdminFaqPage(${window.ADMIN_FAQ_PAGE - 1})" ${window.ADMIN_FAQ_PAGE === 1 ? "disabled" : ""}
          class="rounded-lg border border-gray-200 px-2.5 py-1.5 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">ก่อนหน้า</button>
        <span class="px-2">${window.ADMIN_FAQ_PAGE} / ${pageCount}</span>
        <button type="button" onclick="setAdminFaqPage(${window.ADMIN_FAQ_PAGE + 1})" ${window.ADMIN_FAQ_PAGE === pageCount ? "disabled" : ""}
          class="rounded-lg border border-gray-200 px-2.5 py-1.5 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed">ถัดไป</button>
      </div>
    ` : ""}
  `;

  container.innerHTML = html;
};

window.setAdminFaqPage = function (page) {
  const faqs = window.ADMIN_CURRENT_FAQS || [];
  const pageCount = Math.ceil(faqs.length / 10);
  if (!Number.isInteger(page) || page < 1 || page > pageCount) return;
  window.ADMIN_FAQ_PAGE = page;
  window.renderAdminFaqTable(faqs);
};

window.deleteAdminFaq = async (id) => {
  const item = (window.ADMIN_CURRENT_FAQS || []).find(faq => String(faq.id) === String(id));
  if (!item || !item.source_table) {
    alert("ไม่พบรายการคำถามที่ต้องการลบ");
    return;
  }
  if (!confirm("ยืนยันลบคำถามนี้หรือไม่? เมื่อลบแล้วจะไม่สามารถกู้คืนได้")) return;

  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!sessionData.session) throw new Error("กรุณาเข้าสู่ระบบก่อนลบข้อมูล");

    const { data, error } = await supabase
      .from(item.source_table)
      .delete()
      .eq("id", item.id)
      .select("id")
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      throw new Error(
        `Supabase ไม่ได้ลบแถวจากตาราง ${item.source_table} (RLS/สิทธิ์ DELETE หรือไม่พบแถว) ` +
        "ให้รัน supabase/faq_delete_policy.sql ใน SQL Editor แล้วลองใหม่"
      );
    }

    await window.loadAdminFaqData();
  } catch (error) {
    console.error("Admin FAQ delete error:", error);
    alert(`ลบคำถามไม่สำเร็จ: ${error.message || error}`);
  }
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
