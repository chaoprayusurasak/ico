function escapeAdminEvaluationHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
}

window.loadAdminEvaluations = async function (container) {
  setupAdminEvaluationListeners(container);
  container.innerHTML = `<div class="py-12 text-center text-sm text-slate-500">กำลังโหลดผลประเมิน...</div>`;

  try {
    const { data, error } = await window.supabase
      .from("evaluations")
      .select("id, category, satisfaction_level, level_label, comments, improvement_suggestion, created_at")
      .eq("category", "evaluations")
      .order("created_at", { ascending: false });
    if (error) throw error;

    renderAdminEvaluations(container, data || []);
  } catch (error) {
    console.error("Unable to load service evaluations in admin:", error);
    container.innerHTML = `
      <div class="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700" role="alert">
        โหลดผลประเมินไม่สำเร็จ: ${escapeAdminEvaluationHtml(error.message || error)}
        <p class="mt-2 text-xs">ตรวจสอบสิทธิ์ SELECT ของตาราง evaluations ใน Supabase RLS</p>
      </div>
    `;
  }
};

function renderAdminEvaluations(container, evaluations) {
  window.ADMIN_CURRENT_EVALUATIONS = evaluations;
  const counts = [0, 0, 0];
  evaluations.forEach(item => {
    const level = Number(item.satisfaction_level);
    if (Number.isInteger(level) && level >= 1 && level <= 3) counts[level - 1]++;
  });

  const total = counts.reduce((sum, count) => sum + count, 0);
  const satisfactionRate = total
    ? Math.round(((counts[0] + counts[1] * 0.75 + counts[2] * 0.3) / total) * 100)
    : 0;
  const ratingNames = ["พึงพอใจมาก", "พึงพอใจ", "ควรปรับปรุง"];
  const cards = [
    { label: "ผู้ตอบแบบประเมินทั้งหมด", value: total.toLocaleString(), color: "text-brand-teal" },
    { label: "อัตราความพึงพอใจรวม", value: `${satisfactionRate}%`, color: "text-sky-600" },
    { label: "พึงพอใจมาก", value: counts[0].toLocaleString(), color: "text-emerald-600" },
    { label: "ควรปรับปรุง", value: counts[2].toLocaleString(), color: "text-amber-600" }
  ];

  const rows = evaluations.map(item => {
    const level = Number(item.satisfaction_level);
    const rating = Number.isInteger(level) && level >= 1 && level <= 3 ? ratingNames[level - 1] : (item.level_label || "ไม่ระบุ");
    const date = item.created_at ? new Date(item.created_at).toLocaleString("th-TH") : "-";
    const comments = [
      item.comments ? escapeAdminEvaluationHtml(item.comments) : "",
      item.improvement_suggestion
        ? `<div class="mt-1 text-xs text-amber-700">ข้อเสนอแนะ: ${escapeAdminEvaluationHtml(item.improvement_suggestion)}</div>`
        : ""
    ].filter(Boolean);

    return `
      <tr class="hover:bg-slate-50/80 transition-colors">
        <td class="py-3 px-3.5 text-xs text-gray-500 whitespace-nowrap">${escapeAdminEvaluationHtml(date)}</td>
        <td class="py-3 px-3.5 text-sm font-medium text-gray-800">${escapeAdminEvaluationHtml(rating)}</td>
        <td class="py-3 px-3.5 text-sm text-gray-600 whitespace-normal break-words">
          ${comments.length ? comments.join("") : '<span class="text-gray-400">ไม่มีข้อเสนอแนะ</span>'}
        </td>
        <td class="py-3 px-3.5 text-right whitespace-nowrap">
          <button type="button" data-edit-evaluation="${escapeAdminEvaluationHtml(item.id)}"
            class="px-2.5 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:border-brand-teal hover:text-brand-teal transition-all">แก้ไข</button>
          <button type="button" data-delete-evaluation="${escapeAdminEvaluationHtml(item.id)}"
            class="ml-1 px-2.5 py-1.5 border border-rose-200 text-rose-600 text-xs font-medium rounded-lg hover:bg-rose-50 transition-all">ลบ</button>
        </td>
      </tr>
    `;
  }).join("");

  container.innerHTML = `
    <div class="space-y-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        ${cards.map(card => `
          <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
            <div class="text-xs text-gray-500">${card.label}</div>
            <div class="mt-2 text-2xl font-bold ${card.color}">${card.value}</div>
          </div>
        `).join("")}
      </div>

      <div class="w-full min-w-0 overflow-x-auto rounded-2xl border border-gray-200/80 shadow-2xs bg-white">
        <table class="w-full min-w-[640px] text-left border-collapse">
          <thead>
            <tr class="bg-slate-100/90 text-slate-700 text-xs font-bold border-b border-slate-200">
              <th class="py-3 px-3.5 w-44">วันที่ประเมิน</th>
              <th class="py-3 px-3.5 w-40">ระดับความพึงพอใจ</th>
              <th class="py-3 px-3.5">ข้อคิดเห็น / ข้อเสนอแนะ</th>
              <th class="py-3 px-3.5 text-right w-32">เครื่องมือจัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            ${rows || '<tr><td colspan="4" class="py-12 text-center text-sm text-gray-500">ยังไม่มีข้อมูลแบบประเมินในระบบ</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function setupAdminEvaluationListeners(container) {
  if (container.dataset.evaluationListenersReady === "true") return;
  container.dataset.evaluationListenersReady = "true";

  container.addEventListener("click", async event => {
    const editButton = event.target.closest("[data-edit-evaluation]");
    if (editButton) {
      const evaluation = (window.ADMIN_CURRENT_EVALUATIONS || [])
        .find(item => String(item.id) === editButton.dataset.editEvaluation);
      if (evaluation) renderAdminEvaluationEditRow(editButton.closest("tr"), evaluation);
      return;
    }

    const cancelButton = event.target.closest("[data-cancel-evaluation]");
    if (cancelButton) {
      const evaluation = (window.ADMIN_CURRENT_EVALUATIONS || [])
        .find(item => String(item.id) === cancelButton.dataset.cancelEvaluation);
      if (evaluation) renderAdminEvaluations(container, window.ADMIN_CURRENT_EVALUATIONS);
      return;
    }

    const saveButton = event.target.closest("[data-save-evaluation]");
    if (saveButton) {
      await saveAdminEvaluation(saveButton.closest("tr"), container);
      return;
    }

    const deleteButton = event.target.closest("[data-delete-evaluation]");
    if (!deleteButton) return;
    const evaluation = (window.ADMIN_CURRENT_EVALUATIONS || [])
      .find(item => String(item.id) === deleteButton.dataset.deleteEvaluation);
    if (!evaluation) {
      alert("ไม่พบรายการแบบประเมินที่ต้องการลบ");
      return;
    }
    if (!confirm("ยืนยันลบรายการแบบประเมินนี้หรือไม่? เมื่อลบแล้วจะไม่สามารถกู้คืนได้")) return;

    deleteButton.disabled = true;
    try {
      const { data: sessionData, error: sessionError } = await window.supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!sessionData.session) throw new Error("กรุณาเข้าสู่ระบบก่อนลบข้อมูล");

      const { data, error } = await window.supabase
        .from("evaluations")
        .delete()
        .eq("id", evaluation.id)
        .eq("category", "evaluations")
        .select("id")
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("Supabase ไม่ได้ลบรายการ อาจติดสิทธิ์ RLS ให้รัน supabase/evaluation_admin_policy.sql");

      await window.loadAdminEvaluations(container);
    } catch (error) {
      console.error("Unable to delete satisfaction evaluation:", error);
      alert(`ลบรายการแบบประเมินไม่สำเร็จ: ${error.message || error}`);
      deleteButton.disabled = false;
    }
  });
}

function renderAdminEvaluationEditRow(row, evaluation) {
  if (!row) return;
  if (row.parentElement.querySelector("[data-editing-evaluation='true']")) {
    alert("บันทึกหรือยกเลิกการแก้ไขรายการปัจจุบันก่อนแก้ไขรายการอื่น");
    return;
  }

  row.dataset.editingEvaluation = "true";
  const level = Number(evaluation.satisfaction_level);
  const comments = escapeAdminEvaluationHtml(evaluation.comments || "");
  const suggestion = escapeAdminEvaluationHtml(evaluation.improvement_suggestion || "");
  row.innerHTML = `
    <td class="py-3 px-3.5 text-xs text-gray-500 whitespace-nowrap">
      ${escapeAdminEvaluationHtml(evaluation.created_at ? new Date(evaluation.created_at).toLocaleString("th-TH") : "-")}
    </td>
    <td class="py-3 px-3.5">
      <select data-evaluation-level class="w-full rounded-lg border border-gray-300 px-2.5 py-2 text-sm focus:border-brand-teal focus:outline-none">
        <option value="1" ${level === 1 ? "selected" : ""}>พึงพอใจมาก</option>
        <option value="2" ${level === 2 ? "selected" : ""}>พึงพอใจ</option>
        <option value="3" ${level === 3 ? "selected" : ""}>ควรปรับปรุง</option>
      </select>
    </td>
    <td class="py-3 px-3.5 space-y-2">
      <textarea data-evaluation-comments rows="2" maxlength="5000" placeholder="ข้อคิดเห็นเพิ่มเติม"
        class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-teal focus:outline-none">${comments}</textarea>
      <textarea data-evaluation-suggestion rows="2" maxlength="5000" placeholder="ข้อเสนอแนะเพื่อปรับปรุง"
        class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-teal focus:outline-none">${suggestion}</textarea>
    </td>
    <td class="py-3 px-3.5 text-right whitespace-nowrap">
      <button type="button" data-save-evaluation="${escapeAdminEvaluationHtml(evaluation.id)}"
        class="px-2.5 py-1.5 bg-brand-teal text-white text-xs font-medium rounded-lg hover:bg-teal-700">บันทึก</button>
      <button type="button" data-cancel-evaluation="${escapeAdminEvaluationHtml(evaluation.id)}"
        class="ml-1 px-2.5 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50">ยกเลิก</button>
    </td>
  `;
}

async function saveAdminEvaluation(row, container) {
  const evaluationId = row?.querySelector("[data-save-evaluation]")?.dataset.saveEvaluation;
  const levelInput = row?.querySelector("[data-evaluation-level]");
  const commentsInput = row?.querySelector("[data-evaluation-comments]");
  const suggestionInput = row?.querySelector("[data-evaluation-suggestion]");
  if (!evaluationId || !levelInput || !commentsInput || !suggestionInput) return;

  const saveButton = row.querySelector("[data-save-evaluation]");
  saveButton.disabled = true;
  saveButton.textContent = "กำลังบันทึก...";
  try {
    const { data: sessionData, error: sessionError } = await window.supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!sessionData.session) throw new Error("กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล");

    const level = Number(levelInput.value);
    const levelLabels = { 1: "พึงพอใจมาก", 2: "พึงพอใจ", 3: "ควรปรับปรุง" };
    const { data, error } = await window.supabase
      .from("evaluations")
      .update({
        satisfaction_level: level,
        level_label: levelLabels[level],
        comments: commentsInput.value.trim(),
        improvement_suggestion: suggestionInput.value.trim()
      })
      .eq("id", evaluationId)
      .eq("category", "evaluations")
      .select("id")
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error("Supabase ไม่ได้แก้ไขรายการ อาจติดสิทธิ์ RLS ให้รัน supabase/evaluation_admin_policy.sql");

    await window.loadAdminEvaluations(container);
  } catch (error) {
    console.error("Unable to update satisfaction evaluation:", error);
    alert(`แก้ไขรายการแบบประเมินไม่สำเร็จ: ${error.message || error}`);
    saveButton.disabled = false;
    saveButton.textContent = "บันทึก";
  }
}
