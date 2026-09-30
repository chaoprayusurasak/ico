function escapeAdminContactHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
}

window.loadAdminContactDepartments = async function (container) {
  if (!container) return;
  setupAdminContactListeners(container);
  container.innerHTML = `<div class="py-12 text-center text-sm text-slate-500">กำลังโหลดข้อมูลหน่วยงาน...</div>`;

  try {
    const { data: sessionData, error: sessionError } = await window.supabase.auth.getSession();
    if (sessionError) throw sessionError;

    const { data, error } = await window.supabase
      .from("contact_departments")
      .select("id, name, phone, sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw error;

    const canEdit = Boolean(sessionData.session);
    const addButton = document.getElementById("btn-add-item");
    if (addButton) addButton.classList.toggle("hidden", !canEdit);
    renderAdminContactDepartments(container, data || [], canEdit);
  } catch (error) {
    console.error("Unable to load contact departments in admin:", error);
    const addButton = document.getElementById("btn-add-item");
    if (addButton) addButton.classList.add("hidden");
    container.innerHTML = `
      <div class="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700" role="alert">
        โหลดข้อมูลหน่วยงานไม่สำเร็จ: ${escapeAdminContactHtml(error.message || error)}
        <p class="mt-2 text-xs">ตรวจสอบว่ารันไฟล์ supabase/contact_departments.sql แล้ว และกำหนดสิทธิ์ Supabase RLS ถูกต้อง</p>
      </div>
    `;
  }
};

function renderAdminContactDepartments(container, departments, canEdit) {
  const rowsHtml = departments.map((department, index) => {
    const id = escapeAdminContactHtml(department.id);
    const name = escapeAdminContactHtml(department.name || "");
    const phone = escapeAdminContactHtml(department.phone || "");
    return `
      <tr data-contact-row data-id="${id}" data-name="${name}" data-phone="${phone}" class="hover:bg-slate-50/80 transition-colors">
        <td class="py-3 px-3.5 w-16 text-xs text-gray-500">${index + 1}</td>
        <td class="py-3 px-3.5 text-sm font-semibold text-gray-900">${name}</td>
        <td class="py-3 px-3.5 text-sm text-gray-600">${phone}</td>
        <td class="py-3 px-3.5 text-right w-44 whitespace-nowrap">
          ${canEdit ? `
            <button type="button" data-edit-contact class="px-2.5 py-1 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:border-brand-teal hover:text-brand-teal transition-all">แก้ไข</button>
            <button type="button" data-delete-contact="${id}" class="px-2.5 py-1 border border-rose-200 text-rose-600 text-xs font-medium rounded-lg hover:bg-rose-50 transition-all">ลบ</button>
          ` : `<span class="text-xs text-gray-400">ดูอย่างเดียว</span>`}
        </td>
      </tr>
    `;
  }).join("");

  container.innerHTML = `
    <div class="w-full min-w-0 overflow-x-auto rounded-2xl border border-gray-200/80 shadow-2xs bg-white">
      <table class="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr class="bg-slate-100/90 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
            <th class="py-3 px-3.5 w-16">ลำดับ</th>
            <th class="py-3 px-3.5">ชื่อหน่วยงาน</th>
            <th class="py-3 px-3.5">เบอร์โทรศัพท์</th>
            <th class="py-3 px-3.5 text-right w-44">เครื่องมือจัดการ</th>
          </tr>
        </thead>
        <tbody data-contact-departments-body class="divide-y divide-gray-100 bg-white">
          ${rowsHtml || `<tr><td colspan="4" class="py-12 text-center text-sm text-gray-500">ยังไม่มีข้อมูลหน่วยงาน</td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}

function setupAdminContactListeners(container) {
  if (container.dataset.contactListenersReady === "true") return;
  container.dataset.contactListenersReady = "true";

  container.addEventListener("click", async event => {
    const row = event.target.closest("[data-contact-row]");
    if (!row) return;
    if (event.target.closest("[data-edit-contact]")) {
      editContactDepartmentRow(row);
      return;
    }
    if (event.target.closest("[data-cancel-contact]")) {
      if (row.dataset.newContactRow !== undefined) {
        row.remove();
      } else {
        await window.loadAdminContactDepartments(container);
      }
      return;
    }
    if (event.target.closest("[data-save-contact]")) {
      await saveContactDepartmentRow(row, container);
      return;
    }

    const deleteButton = event.target.closest("[data-delete-contact]");
    if (!deleteButton || !confirm("ยืนยันลบหน่วยงานและเบอร์โทรศัพท์นี้หรือไม่?")) return;
    deleteButton.disabled = true;

    try {
      const { data: sessionData, error: sessionError } = await window.supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!sessionData.session) {
        throw new Error("กรุณาเข้าสู่ระบบ Supabase Auth ก่อนลบข้อมูล");
      }

      const { data, error } = await window.supabase
        .from("contact_departments")
        .delete()
        .eq("id", deleteButton.dataset.deleteContact)
        .select("id")
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("ไม่สามารถลบได้ กรุณาตรวจสอบสิทธิ์ Supabase RLS");
      await window.loadAdminContactDepartments(container);
    } catch (error) {
      console.error("Unable to delete contact department:", error);
      alert(`ลบข้อมูลไม่สำเร็จ: ${error.message || error}`);
      deleteButton.disabled = false;
    }
  });
}

window.addAdminContactDepartment = function () {
  const container = document.getElementById("items-list-container");
  const body = container?.querySelector("[data-contact-departments-body]");
  if (!body || body.querySelector("[data-new-contact-row]")) return;
  if (body.querySelector('[data-contact-row][data-editing="true"]')) {
    alert("บันทึกหรือยกเลิกการแก้ไขรายการปัจจุบันก่อนเพิ่มรายการใหม่");
    return;
  }

  const row = document.createElement("tr");
  row.dataset.contactRow = "";
  row.dataset.newContactRow = "";
  row.className = "bg-teal-50/50";
  row.innerHTML = `
    <td class="py-2.5 px-3.5 text-xs text-gray-500">ใหม่</td>
    <td class="py-2.5 px-3.5"><input data-contact-name maxlength="160" required placeholder="ชื่อหน่วยงาน" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-teal focus:outline-none" /></td>
    <td class="py-2.5 px-3.5"><input data-contact-phone type="tel" inputmode="tel" maxlength="80" required placeholder="เบอร์โทรศัพท์" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-teal focus:outline-none" /></td>
    <td class="py-2.5 px-3.5 text-right whitespace-nowrap">
      <button type="button" data-save-contact class="px-2.5 py-1 bg-brand-teal text-white text-xs font-medium rounded-lg hover:bg-teal-700">บันทึก</button>
      <button type="button" data-cancel-contact class="px-2.5 py-1 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50">ยกเลิก</button>
    </td>
  `;
  body.prepend(row);
  row.querySelector("[data-contact-name]").focus();
};

function editContactDepartmentRow(row) {
  if (row.parentElement.querySelector('[data-contact-row][data-editing="true"]')) {
    alert("บันทึกหรือยกเลิกการแก้ไขรายการปัจจุบันก่อนแก้ไขรายการอื่น");
    return;
  }
  row.dataset.editing = "true";
  const name = escapeAdminContactHtml(row.dataset.name || "");
  const phone = escapeAdminContactHtml(row.dataset.phone || "");
  row.innerHTML = `
    <td class="py-2.5 px-3.5 text-xs text-gray-500">${row.rowIndex}</td>
    <td class="py-2.5 px-3.5"><input data-contact-name maxlength="160" required value="${name}" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-teal focus:outline-none" /></td>
    <td class="py-2.5 px-3.5"><input data-contact-phone type="tel" inputmode="tel" maxlength="80" required value="${phone}" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-teal focus:outline-none" /></td>
    <td class="py-2.5 px-3.5 text-right whitespace-nowrap">
      <button type="button" data-save-contact class="px-2.5 py-1 bg-brand-teal text-white text-xs font-medium rounded-lg hover:bg-teal-700">บันทึก</button>
      <button type="button" data-cancel-contact class="px-2.5 py-1 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50">ยกเลิก</button>
    </td>
  `;
  row.querySelector("[data-contact-name]").focus();
}

async function saveContactDepartmentRow(row, container) {
  const name = row.querySelector("[data-contact-name]").value.trim();
  const phone = row.querySelector("[data-contact-phone]").value.trim();
  if (!name || !phone) {
    alert("กรุณากรอกชื่อหน่วยงานและเบอร์โทรศัพท์");
    return;
  }

  const saveButton = row.querySelector("[data-save-contact]");
  saveButton.disabled = true;
  saveButton.textContent = "กำลังบันทึก...";
  try {
    const { data: sessionData, error: sessionError } = await window.supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!sessionData.session) {
      throw new Error("กรุณาเข้าสู่ระบบ Supabase Auth ก่อนบันทึกข้อมูล");
    }

    let result;
    if (row.dataset.newContactRow !== undefined) {
      const { data: currentDepartments, error: loadError } = await window.supabase
        .from("contact_departments")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1);
      if (loadError) throw loadError;
      const sortOrder = currentDepartments?.length ? Number(currentDepartments[0].sort_order) + 1 : 0;
      result = await window.supabase
        .from("contact_departments")
        .insert({ name, phone, sort_order: sortOrder })
        .select("id")
        .single();
    } else {
      result = await window.supabase
        .from("contact_departments")
        .update({ name, phone })
        .eq("id", row.dataset.id)
        .select("id")
        .maybeSingle();
    }

    if (result.error) throw result.error;
    if (!result.data) {
      throw new Error(
        "Supabase ไม่อนุญาตให้บันทึกแถวนี้ (RLS) หรือไม่พบรายการแล้ว " +
        "กรุณารัน supabase/contact_departments.sql ใน SQL Editor ของโปรเจกต์ Supabase แล้วออกจากระบบและเข้าสู่ระบบใหม่"
      );
    }
    await window.loadAdminContactDepartments(container);
  } catch (error) {
    console.error("Unable to save contact department:", error);
    alert(`บันทึกข้อมูลไม่สำเร็จ: ${error.message || error}`);
    saveButton.disabled = false;
    saveButton.textContent = "บันทึก";
  }
}
