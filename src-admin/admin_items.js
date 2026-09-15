/**
 * Module: src-admin/admin_items.js
 * Admin Data Loading, CRUD Operations, Item Table & Breadcrumb Rendering
 */

window.getOfficersRowConfig = function () {
  try {
    const saved = localStorage.getItem("officers_row_config");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        row1: parseInt(parsed.row1) || 1,
        row2: parseInt(parsed.row2) || 4,
        row3: parseInt(parsed.row3) || 4
      };
    }
  } catch (e) { }
  return { row1: 1, row2: 4, row3: 4 };
};

window.saveOfficerRowConfig = function () {
  const r1El = document.getElementById("officer-row1-count");
  const r2El = document.getElementById("officer-row2-count");
  const r3El = document.getElementById("officer-row3-count");

  const r1 = parseInt(r1El ? r1El.value : 1) || 1;
  const r2 = parseInt(r2El ? r2El.value : 4) || 4;
  const r3 = parseInt(r3El ? r3El.value : 4) || 4;

  const config = { row1: r1, row2: r2, row3: r3 };
  localStorage.setItem("officers_row_config", JSON.stringify(config));

  const toast = document.getElementById("officer-config-saved-toast");
  if (toast) {
    toast.classList.remove("hidden");
    toast.classList.add("flex");
    setTimeout(() => {
      toast.classList.add("hidden");
      toast.classList.remove("flex");
    }, 2000);
  }

  if (window.currentOfficersList) {
    window.renderItemsTable(window.currentOfficersList);
  }
};

window.DEFAULT_M9_1_FOLDERS = [
  "คำวินิจฉัย",
  "ใบอนุญาตจัดตั้งตลาด ปี 2565",
  "ใบอนุญาตจัดตั้งตลาด ปี 2566",
  "ใบอนุญาตจัดตั้งตลาด ปี 2567",
  "ใบอนุญาตประกอบกิจการที่เป็นอันตราย 2566",
  "ใบอนุญาตประกอบกิจการที่เป็นอันตราย 2567",
  "ผลการพิจารณาจัดซื้อจัดจ้าง",
  "ผลการพิจารณาใบอนุญาตประกอบกิจการที่เป็นอัตรายต่อสุขภาพ ปี 2565",
  "ผลการพิจารณาใบอนุญาตประกอบกิจการที่เป็นอัตรายต่อสุขภาพ ปี 2566",
  "รายงานผลการดำเนินงานตาม พ.ร.บ.การอำนวยความสะดวกในการพิจารณาอนุญาตฯ พ.ศ.2558 ปี 2565",
  "รายงานผลการดำเนินงานตาม พ.ร.บ.การอำนวยความสะดวกในการพิจารณาอนุญาตฯ พ.ศ.2558 ปี 2566",
  "รายงานผลการดำเนินงานตาม พ.ร.บ.การอำนวยความสะดวกในการพิจารณาอนุญาตฯ พ.ศ.2558 ปี 2567",
  "หนังสือรับรองการจัดตั้งสถานที่สะสมอาหาร ปี 2564",
  "หนังสือรับรองการจัดตั้งสถานที่สะสมอาหาร ปี 2565",
  "หนังสือรับรองการจัดตั้งสถานที่สะสมอาหาร ปี 2566",
  "หนังสือรับรองการจัดตั้งสถานที่สะสมอาหาร ปี 2567",
  "รายงานผลการดำเนินงานตาม พ.ร.บ.การอำนวยความสะดวกในการพิจารณาอนุญาตฯ พ.ศ.2558 ปี 2568",
  "ผลการพิจารณาใบอนุญาตก่อสร้าง ปี 2567",
  "ผลการพิจารณาใบอนุญาตก่อสร้าง ปี 2568",
  "ใบอนุญาตจัดตั้งตลาด ปี 2568",
  "หนังสือรับรองการจัดตั้งสถานที่สะสมอาหาร ปี 2568",
  "ใบอนุญาตประกอบกิจการที่เป็นอันตราย 2568",
  "รายงานผลการดำเนินงานตาม พ.ร.บ.การอำนวยความสะดวกในการพิจารณาอนุญาตฯ พ.ศ.2558 ปี 2569",
  "รวมคำวินิจฉัยอุทธรณ์ คณะกรรมการพิจารณาอุทธรณ์ ตามพระราชบัญญัติควบคุมอาคาร พ.ศ. 2522 ตั้งแต่ปี พ.ศ. 2558 ถึง พ.ศ. 2562",
  "ผลการพิจารณาใบอนุญาตก่อสร้าง ปี 2569",
  "ผลการพิจารณา ตาม พรบ.การสาธารณสุข พ.ศ. 2535"
];

window.DEFAULT_M9_2_ITEMS = [
  { title: "01 นโยบาย", is_folder: true },
  { title: "02 การตีความ", is_folder: true },
  { title: "03 แผนพัฒนาท้องถิ่น", is_folder: true },
  { title: "04 นโยบายนายกรัฐมนตรี", is_folder: true },
  { title: "05 นโยบายรัฐมนตรีว่าการกระทรวงมหาดไทย", is_folder: true },
  { title: "การตีความไม่มีภารกิจที่เกี่ยวข้อง 2565 วันที่ 11 มกราคม 2565 (06/12/2567)", is_folder: false },
  { title: "การตีความไม่มีภารกิจที่เกี่ยวข้อง วันที่ 01 มกราคม 2564 (06/12/2567)", is_folder: false },
  { title: "มาตรการภายในหน่วยงาน วันที่ 14 มกราคม 2563 (06/12/2567)", is_folder: false }
];

window.seedM91Folders = async function () {
  const targetTable = window.ACTIVE_TABLE_NAME || 'oic_documents';
  const now = Date.now();
  const itemsToInsert = window.DEFAULT_M9_1_FOLDERS.map((title, idx) => ({
    category: "m9_1",
    parent_id: window.currentParentId || null,
    is_folder: true,
    title: title,
    description: "",
    created_at: new Date(now - (window.DEFAULT_M9_1_FOLDERS.length - idx) * 1000).toISOString()
  }));

  try {
    const { data, error } = await supabase.from(targetTable).insert(itemsToInsert).select("*");
    if (!error && data && data.length > 0) return data;

    const { data: fallbackData } = await supabase.from("items").insert(itemsToInsert).select("*");
    return fallbackData || [];
  } catch (e) {
    console.error("Error seeding m9_1 folders:", e);
    return [];
  }
};

window.seedM92Items = async function () {
  const targetTable = window.ACTIVE_TABLE_NAME || 'oic_documents';
  const now = Date.now();
  const itemsToInsert = window.DEFAULT_M9_2_ITEMS.map((item, idx) => ({
    category: "m9_2",
    parent_id: window.currentParentId || null,
    is_folder: item.is_folder,
    title: item.title,
    description: "",
    created_at: new Date(now - (window.DEFAULT_M9_2_ITEMS.length - idx) * 1000).toISOString()
  }));

  try {
    const { data, error } = await supabase.from(targetTable).insert(itemsToInsert).select("*");
    if (!error && data && data.length > 0) return data;

    const { data: fallbackData } = await supabase.from("items").insert(itemsToInsert).select("*");
    return fallbackData || [];
  } catch (e) {
    console.error("Error seeding m9_2 items:", e);
    return [];
  }
};

window.loadItems = async function () {
  const container = document.getElementById("items-list-container");
  if (typeof renderAdminBreadcrumb === 'function') renderAdminBreadcrumb();

  if (!container) return;

  container.innerHTML = `
    <div class="flex flex-col items-center justify-center py-16 gap-3 text-gray-500">
      <div class="w-8 h-8 border-3 border-t-brand-teal rounded-full animate-spin"></div>
      <p class="text-xs font-semibold">กำลังโหลดข้อมูลรายการ...</p>
    </div>
  `;

  // Handle Q&A Forum Category (eval_faq) in Admin
  if (window.activeCategory === "eval_faq") {
    if (typeof loadAdminFaqData === 'function') {
      loadAdminFaqData();
    }
    return;
  }

  try {
    let items = [];

    // Step 1: Query 'oic_documents' table for this category
    let query1 = supabase.from("oic_documents").select("*").eq("category", window.activeCategory);
    if (window.currentParentId) {
      query1 = query1.eq("parent_id", window.currentParentId);
    }

    const { data: oicData, error: oicErr } = await query1
      .order("is_folder", { ascending: false })
      .order("created_at", { ascending: false });

    if (!oicErr && oicData && oicData.length > 0) {
      items = oicData;
      window.ACTIVE_TABLE_NAME = 'oic_documents';
    } else {
      // Step 2: Try querying 'items' table for old uploaded data!
      let query2 = supabase.from("items").select("*").eq("category", window.activeCategory);
      if (window.currentParentId) {
        query2 = query2.eq("parent_id", window.currentParentId);
      }

      const { data: itemsData, error: itemsErr } = await query2
        .order("is_folder", { ascending: false })
        .order("created_at", { ascending: false });

      if (!itemsErr && itemsData && itemsData.length > 0) {
        items = itemsData;
        window.ACTIVE_TABLE_NAME = 'items';
      } else {
        // Step 3: If still empty and at root level, query all items for this category regardless of parent_id
        if (!window.currentParentId) {
          const resOicAll = await supabase.from("oic_documents").select("*").eq("category", window.activeCategory).order("created_at", { ascending: false });
          if (!resOicAll.error && resOicAll.data && resOicAll.data.length > 0) {
            items = resOicAll.data;
            window.ACTIVE_TABLE_NAME = 'oic_documents';
          } else {
            const resItemsAll = await supabase.from("items").select("*").eq("category", window.activeCategory).order("created_at", { ascending: false });
            if (!resItemsAll.error && resItemsAll.data && resItemsAll.data.length > 0) {
              items = resItemsAll.data;
              window.ACTIVE_TABLE_NAME = 'items';
            }
          }
        }
      }
    }

    // Auto-seed Section 9 (1) folders if empty at root level
    if ((!items || items.length === 0) && window.activeCategory === "m9_1" && !window.currentParentId) {
      items = await window.seedM91Folders();
    }
    // Auto-seed Section 9 (2) items if empty at root level
    if ((!items || items.length === 0) && window.activeCategory === "m9_2" && !window.currentParentId) {
      items = await window.seedM92Items();
    }

    renderItemsTable(items);
  } catch (err) {
    console.error("Error loading items:", err);
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-16 gap-3 text-rose-500 text-center">
        <i class="fi fi-rr-triangle-warning text-3xl"></i>
        <p class="text-sm font-semibold">โหลดข้อมูลไม่สำเร็จ: ${err.message}</p>
      </div>
    `;
  }
};

function formatBytes(bytes, decimals = 1) {
  if (!bytes || isNaN(bytes) || Number(bytes) <= 0) return '-';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

window.renderItemsTable = function (items) {
  const container = document.getElementById("items-list-container");
  if (!container) return;

  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-16 gap-3 text-gray-400 text-center">
        <i class="fi fi-rr-inbox text-4xl text-teal-600/40"></i>
        <p class="text-sm font-medium text-gray-500">ยังไม่มีข้อมูล หรือโฟลเดอร์ในระดับนี้</p>
      </div>
    `;
    return;
  }

  window.currentOfficersList = items;
  const isOfficerMode = window.activeCategory === "officers";
  const rowConfig = window.getOfficersRowConfig();
  const r1End = rowConfig.row1;
  const r2End = r1End + rowConfig.row2;

  let html = "";

  if (isOfficerMode) {
    html += `
      <div class="mb-4 p-3.5 bg-teal-50/70 border border-teal-200/80 rounded-2xl flex flex-col gap-3 text-xs text-brand-teal shadow-2xs w-full min-w-0">
        <div class="flex items-center gap-2">
          <i class="fi fi-rr-apps-sort text-sm text-brand-teal"></i>
          <span class="font-bold text-gray-800 text-xs sm:text-sm">ตั้งค่าจำนวนการ์ดแสดงผลในแต่ละแถว (หน้าเจ้าหน้าที่ผู้รับผิดชอบ)</span>
        </div>
        <div class="flex flex-wrap items-center gap-2.5 pt-2.5 border-t border-teal-200/60 w-full">
          <div class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-teal-200 shadow-2xs">
            <span class="font-bold text-teal-800 text-xs">แถวที่ 1:</span>
            <select id="officer-row1-count" onchange="saveOfficerRowConfig()" class="bg-teal-50 text-teal-900 font-bold text-xs py-1 px-2 rounded-lg border border-teal-300 focus:outline-none cursor-pointer">
              <option value="1" ${rowConfig.row1 === 1 ? 'selected' : ''}>1 คน (ประธาน/หัวหน้าใหญ่)</option>
              <option value="2" ${rowConfig.row1 === 2 ? 'selected' : ''}>2 คน</option>
              <option value="3" ${rowConfig.row1 === 3 ? 'selected' : ''}>3 คน</option>
              <option value="4" ${rowConfig.row1 === 4 ? 'selected' : ''}>4 คน</option>
              <option value="5" ${rowConfig.row1 === 5 ? 'selected' : ''}>5 คน</option>
            </select>
          </div>

          <div class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
            <span class="font-bold text-emerald-800 text-xs">แถวที่ 2:</span>
            <select id="officer-row2-count" onchange="saveOfficerRowConfig()" class="bg-emerald-50 text-emerald-900 font-bold text-xs py-1 px-2 rounded-lg border border-emerald-300 focus:outline-none cursor-pointer">
              <option value="1" ${rowConfig.row2 === 1 ? 'selected' : ''}>1 คน</option>
              <option value="2" ${rowConfig.row2 === 2 ? 'selected' : ''}>2 คน</option>
              <option value="3" ${rowConfig.row2 === 3 ? 'selected' : ''}>3 คน</option>
              <option value="4" ${rowConfig.row2 === 4 ? 'selected' : ''}>4 คน</option>
              <option value="5" ${rowConfig.row2 === 5 ? 'selected' : ''}>5 คน</option>
              <option value="6" ${rowConfig.row2 === 6 ? 'selected' : ''}>6 คน</option>
            </select>
          </div>

          <div class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-blue-200 shadow-2xs">
            <span class="font-bold text-blue-800 text-xs">แถวที่ 3:</span>
            <select id="officer-row3-count" onchange="saveOfficerRowConfig()" class="bg-blue-50 text-blue-900 font-bold text-xs py-1 px-2 rounded-lg border border-blue-300 focus:outline-none cursor-pointer">
              <option value="1" ${rowConfig.row3 === 1 ? 'selected' : ''}>1 คน</option>
              <option value="2" ${rowConfig.row3 === 2 ? 'selected' : ''}>2 คน</option>
              <option value="3" ${rowConfig.row3 === 3 ? 'selected' : ''}>3 คน</option>
              <option value="4" ${rowConfig.row3 === 4 ? 'selected' : ''}>4 คน</option>
              <option value="5" ${rowConfig.row3 === 5 ? 'selected' : ''}>5 คน</option>
              <option value="6" ${rowConfig.row3 === 6 ? 'selected' : ''}>6 คน</option>
              <option value="999" ${rowConfig.row3 === 999 ? 'selected' : ''}>คนที่เหลือทั้งหมด</option>
            </select>
          </div>
        </div>
      </div>
    `;
  }

  html += `
    <div class="w-full min-w-0 overflow-x-auto rounded-2xl border border-gray-200/80 shadow-2xs bg-white">
      <table class="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr class="bg-slate-100/90 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
            ${isOfficerMode ? '<th class="py-3 px-3 w-12 text-center">สลับ</th>' : ''}
            <th class="py-3 px-3 w-20">ประเภท</th>
            <th class="py-3 px-3.5">ชื่อ - นามสกุล / รายละเอียด</th>
            ${isOfficerMode ? '<th class="py-3 px-3.5 w-40 text-center">ตำแหน่งในเลเอาต์</th>' : '<th class="py-3 px-3.5 w-28 text-center hidden md:table-cell">ขนาดไฟล์</th>'}
            <th class="py-3 px-3.5 w-28 text-center">${isOfficerMode ? 'รูปถ่าย' : 'เอกสารแนบ'}</th>
            <th class="py-3 px-3.5 text-right w-44">เครื่องมือจัดการ</th>
          </tr>
        </thead>
        <tbody id="admin-items-tbody" class="divide-y divide-gray-100 bg-white">
  `;

  items.forEach((item, idx) => {
    const isFolder = Boolean(item.is_folder);
    const formattedSize = item.file_size ? formatBytes(item.file_size) : '-';

    const typeHtml = isFolder
      ? `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-semibold text-xs border border-amber-200"><i class="fi fi-rr-folder text-xs"></i> โฟลเดอร์</span>`
      : (item.image_url
        ? `<img src="${item.image_url}" class="w-9 h-9 rounded-full object-cover border-2 border-brand-teal/30 shadow-2xs mx-auto" />`
        : `<div class="w-8 h-8 rounded-lg bg-teal-50 text-brand-teal flex items-center justify-center border border-teal-100 mx-auto"><i class="fi fi-rr-user text-xs"></i></div>`);

    const attachmentHtml = isFolder
      ? `<span class="text-xs text-amber-700 font-medium"><i class="fi fi-rr-folder-tree"></i> แฟ้มย่อย</span>`
      : (isOfficerMode
        ? (item.image_url ? `<span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100"><i class="fi fi-rr-check"></i> มีรูปถ่าย</span>` : `<span class="text-xs text-gray-400 font-light">-</span>`)
        : `
      <div class="flex items-center justify-center gap-2 text-sm">
        ${item.link ? `<a href="${item.link}" target="_blank" title="เปิดลิงก์" class="text-brand-teal hover:scale-110 transition-transform"><i class="fi fi-rr-link"></i></a>` : ''}
        ${item.file_url ? `<a href="${item.file_url}" target="_blank" title="ดาวน์โหลดไฟล์" class="text-teal-600 hover:scale-110 transition-transform"><i class="fi fi-rr-document-signed"></i></a>` : ''}
        ${!item.link && !item.file_url ? `<span class="text-xs text-gray-400 font-normal">-</span>` : ''}
      </div>
    `);

    const escapedTitle = (item.title || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');

    let displayDesc = item.description || '-';
    if (window.activeCategory === 'executives' && item.description) {
      try {
        const parsed = JSON.parse(item.description);
        displayDesc = `ตำแหน่ง: ${parsed.position || '-'} | ${parsed.department || ''} | โทร: ${parsed.phone || '-'}`;
      } catch (e) { }
    } else if (window.activeCategory === 'officers' && item.description) {
      try {
        const parsed = JSON.parse(item.description);
        displayDesc = `ตำแหน่ง: ${parsed.position || '-'}`;
      } catch (e) {
        displayDesc = `ตำแหน่ง: ${item.description || '-'}`;
      }
    }

    let rowBadgeHtml = "";
    if (isOfficerMode) {
      if (idx < r1End) {
        rowBadgeHtml = `<span class="px-2 py-0.5 rounded-lg bg-teal-100 text-teal-800 font-bold text-xs border border-teal-200 inline-flex items-center gap-1"><i class="fi fi-rr-crown text-amber-500 text-[10px]"></i> แถว 1 (${idx + 1})</span>`;
      } else if (idx < r2End) {
        rowBadgeHtml = `<span class="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200">แถว 2 (${idx - r1End + 1})</span>`;
      } else {
        rowBadgeHtml = `<span class="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-200">แถว 3 (${idx - r2End + 1})</span>`;
      }
    }

    html += `
      <tr class="hover:bg-slate-50/80 transition-colors ${isFolder ? 'bg-amber-50/20' : ''} ${isOfficerMode ? 'cursor-grab active:cursor-grabbing' : ''}"
        ${isOfficerMode ? `
          draggable="true"
          ondragstart="handleOfficerDragStart(event, ${idx})"
          ondragover="handleOfficerDragOver(event, ${idx})"
          ondrop="handleOfficerDrop(event, ${idx})"
          ondragend="handleOfficerDragEnd(event)"
        ` : ''}>

        ${isOfficerMode ? `
          <td class="py-2.5 px-3 text-center text-gray-400 hover:text-brand-teal select-none">
            <i class="fi fi-rr-menu-dots-vertical text-xs font-bold"></i>
          </td>
        ` : ''}

        <td class="py-2.5 px-3">${typeHtml}</td>
        <td class="py-2.5 px-3.5 max-w-xs md:max-w-md">
          <div class="text-sm font-semibold ${isFolder ? 'text-amber-900 flex items-center gap-1.5 cursor-pointer hover:underline' : 'text-gray-900'} truncate" title="${item.title}" ${isFolder ? `onclick="openAdminFolder('${item.id}', '${escapedTitle}')"` : ''}>
            ${isFolder ? '<i class="fi fi-rr-folder-open text-amber-500 text-xs"></i>' : ''} ${item.title}
          </div>
          <div class="text-xs text-gray-500 line-clamp-1 mt-0.5 font-normal">${displayDesc}</div>
        </td>
        ${isOfficerMode ? `<td class="py-2.5 px-3.5 text-center">${rowBadgeHtml}</td>` : `<td class="py-2.5 px-3.5 text-center hidden md:table-cell text-xs text-gray-500 font-normal">${formattedSize}</td>`}
        <td class="py-2.5 px-3.5 text-center">${attachmentHtml}</td>
        <td class="py-2.5 px-3.5 text-right space-x-1 whitespace-nowrap">
          ${isFolder ? `
            <button onclick="openAdminFolder('${item.id}', '${escapedTitle}')" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-lg shadow-2xs transition-all inline-flex items-center gap-1 cursor-pointer">
              <i class="fi fi-rr-folder-open text-[11px]"></i> เปิด
            </button>
          ` : ''}
          <button onclick="editItem('${item.id}')" class="px-2.5 py-1 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:border-brand-teal hover:text-brand-teal transition-all cursor-pointer">
            แก้ไข
          </button>
          <button onclick="deleteItem('${item.id}')" class="px-2.5 py-1 border border-rose-200 text-rose-600 text-xs font-medium rounded-lg hover:bg-rose-50 transition-all cursor-pointer">
            ลบ
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

// Drag & Drop handlers for Admin Officer Reordering
window.handleOfficerDragStart = function (e, index) {
  window.draggedOfficerIndex = index;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", index);
  if (e.currentTarget) e.currentTarget.classList.add("bg-teal-50/80", "opacity-50");
};

window.handleOfficerDragOver = function (e, index) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
};

window.handleOfficerDrop = function (e, targetIndex) {
  e.preventDefault();
  const sourceIndex = window.draggedOfficerIndex;

  if (sourceIndex === undefined || sourceIndex === null || sourceIndex === targetIndex) return;
  if (!window.currentOfficersList || !window.currentOfficersList[sourceIndex]) return;

  const list = [...window.currentOfficersList];
  const [moved] = list.splice(sourceIndex, 1);
  list.splice(targetIndex, 0, moved);

  window.currentOfficersList = list;
  window.renderItemsTable(list);
  window.saveOfficerOrdering(list);
};

window.handleOfficerDragEnd = function (e) {
  if (e.currentTarget) e.currentTarget.classList.remove("bg-teal-50/80", "opacity-50");
  window.draggedOfficerIndex = null;
};

window.saveOfficerOrdering = async function (itemsList) {
  const targetTable = window.ACTIVE_TABLE_NAME || 'oic_documents';
  const now = Date.now();

  try {
    const updates = itemsList.map((item, idx) => {
      const newTimestamp = new Date(now - idx * 1000).toISOString();
      return supabase
        .from(targetTable)
        .update({ created_at: newTimestamp, sort_order: idx + 1 })
        .eq("id", item.id);
    });

    await Promise.all(updates);
  } catch (err) {
    console.error("Error saving officer order:", err);
  }
};

window.renderAdminBreadcrumb = function () {
  const bcEl = document.getElementById("admin-breadcrumb");
  if (!bcEl) return;

  const key = window.activeCategory || "";
  const isFolderCategory = key.startsWith("m7_") || key.startsWith("m9_");

  // Hide breadcrumb bar completely for categories that are NOT Section 7 or Section 9
  if (!key || (!isFolderCategory && (!window.breadcrumbStack || window.breadcrumbStack.length === 0))) {
    bcEl.classList.add("hidden");
    return;
  }

  bcEl.classList.remove("hidden");
  let html = `
    <button onclick="navigateToAdminBreadcrumb(-1)" class="hover:text-brand-teal flex items-center gap-1 font-bold">
      <i class="fi fi-rr-folder text-amber-500"></i> ${window.CATEGORIES[window.activeCategory] || window.activeCategory}
    </button>
  `;

  (window.breadcrumbStack || []).forEach((folder, idx) => {
    html += `
      <i class="fi fi-rr-angle-small-right text-gray-400"></i>
      <button onclick="navigateToAdminBreadcrumb(${idx})" class="hover:text-brand-teal flex items-center gap-1 ${idx === window.breadcrumbStack.length - 1 ? 'text-brand-teal font-bold' : ''}">
        <i class="fi fi-rr-folder-open text-amber-600"></i> ${folder.title}
      </button>
    `;
  });

  bcEl.innerHTML = html;
};

window.navigateToAdminBreadcrumb = (index) => {
  if (index === -1) {
    window.currentParentId = null;
    window.breadcrumbStack = [];
  } else {
    window.breadcrumbStack = window.breadcrumbStack.slice(0, index + 1);
    window.currentParentId = window.breadcrumbStack[window.breadcrumbStack.length - 1].id;
  }
  closeForm();
  loadItems();
};

window.openAdminFolder = (folderId, folderTitle) => {
  window.currentParentId = folderId;
  if (!window.breadcrumbStack) window.breadcrumbStack = [];
  window.breadcrumbStack.push({ id: folderId, title: folderTitle });
  closeForm();
  loadItems();
};

window.setupFormListeners = function () {
  const btnAddItem = document.getElementById("btn-add-item");
  if (btnAddItem) {
    btnAddItem.addEventListener("click", () => {
      window.isEditing = false;
      document.getElementById("item-id").value = "";
      document.getElementById("item-is-folder").value = "false";
      document.getElementById("item-form").reset();

      const titleLabel = document.getElementById("item-title-label-text");
      const linkWrap = document.getElementById("external-link-wrapper");
      const docCard = document.getElementById("doc-upload-card");
      const imgCard = document.getElementById("image-upload-card");
      const descWrap = document.getElementById("item-desc-wrapper");
      const execFields = document.getElementById("executive-fields");
      const officerFields = document.getElementById("officer-fields");

      document.getElementById("file-link-section").classList.remove("hidden");

      if (window.activeCategory === "officers") {
        document.getElementById("form-title").textContent = "เพิ่มเจ้าหน้าที่ผู้รับผิดชอบใหม่";
        if (titleLabel) titleLabel.textContent = "ชื่อ - นามสกุล เจ้าหน้าที่";
        if (linkWrap) linkWrap.classList.add("hidden");
        if (docCard) docCard.classList.add("hidden");
        if (imgCard) imgCard.classList.remove("hidden");
        if (descWrap) descWrap.classList.add("hidden");
        if (officerFields) officerFields.classList.remove("hidden");
        if (execFields) execFields.classList.add("hidden");
      } else if (window.activeCategory === "executives") {
        document.getElementById("form-title").textContent = "เพิ่มผู้บริหารใหม่";
        if (titleLabel) titleLabel.textContent = "ชื่อ - นามสกุล ผู้บริหาร";
        if (linkWrap) linkWrap.classList.add("hidden");
        if (docCard) docCard.classList.add("hidden");
        if (imgCard) imgCard.classList.remove("hidden");
        if (descWrap) descWrap.classList.remove("hidden");
        if (officerFields) officerFields.classList.add("hidden");
        if (execFields) execFields.classList.remove("hidden");
      } else {
        document.getElementById("form-title").textContent = "เพิ่มข้อมูลใหม่";
        if (titleLabel) titleLabel.textContent = "หัวเรื่อง / ชื่อโฟลเดอร์";
        if (linkWrap) linkWrap.classList.remove("hidden");
        if (docCard) docCard.classList.remove("hidden");
        if (imgCard) imgCard.classList.remove("hidden");
        if (descWrap) descWrap.classList.remove("hidden");
        if (officerFields) officerFields.classList.add("hidden");
        if (execFields) execFields.classList.add("hidden");
      }

      const overlay = document.getElementById("admin-form-modal-overlay");
      if (overlay) overlay.classList.remove("hidden");
    });
  }

  const btnAddFolder = document.getElementById("btn-add-folder");
  if (btnAddFolder) {
    btnAddFolder.addEventListener("click", () => {
      window.isEditing = false;
      document.getElementById("form-title").textContent = "เพิ่มโฟลเดอร์ย่อย";
      document.getElementById("item-id").value = "";
      document.getElementById("item-is-folder").value = "true";
      document.getElementById("item-form").reset();
      document.getElementById("file-link-section").classList.add("hidden");
      document.getElementById("executive-fields").classList.add("hidden");
      const officerFields = document.getElementById("officer-fields");
      if (officerFields) officerFields.classList.add("hidden");

      const overlay = document.getElementById("admin-form-modal-overlay");
      if (overlay) overlay.classList.remove("hidden");
    });
  }

  const btnCancel = document.getElementById("btn-cancel-form");
  if (btnCancel) btnCancel.addEventListener("click", closeForm);

  const btnSeed = document.getElementById("btn-seed-executives");
  if (btnSeed) {
    btnSeed.addEventListener("click", async () => {
      if (!confirm("คุณต้องการดึงข้อมูลผู้บริหารเริ่มต้น (10 รายชื่อ) ลงสู่ระบบใช่หรือไม่?")) return;

      btnSeed.disabled = true;
      btnSeed.innerHTML = `<i class="fi fi-rr-spinner animate-spin"></i> กำลังดึงข้อมูล...`;

      try {
        const DEFAULT_EXECUTIVES = [
          { pos: "นายกเทศมนตรีนครเจ้าพระยาสุรศักดิ์", dept: "ผู้บริหารสูงสุด", phone: "038-123-456 ต่อ 101", level: 1, title: "นายสมชาย ใจดี", image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400" },
          { pos: "รองนายกเทศมนตรีนครเจ้าพระยาสุรศักดิ์", dept: "กำกับดูแลสำนักช่าง", phone: "038-123-456 ต่อ 102", level: 2, title: "นายวิชัย รักษ์ดี", image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400" },
          { pos: "รองนายกเทศมนตรีนครเจ้าพระยาสุรศักดิ์", dept: "กำกับดูแลสำนักการศึกษา", phone: "038-123-456 ต่อ 103", level: 2, title: "นางสาวสมหญิง มีสุข", image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400" },
          { pos: "ปลัดเทศบาลนครเจ้าพระยาสุรศักดิ์", dept: "หัวหน้าฝ่ายข้าราชการประจำ", phone: "038-123-456 ต่อ 201", level: 1, title: "นายประเสริฐ มั่นคง", image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" },
          { pos: "รองปลัดเทศบาลนครเจ้าพระยาสุรศักดิ์", dept: "กำกับดูแลกองการแพทย์", phone: "038-123-456 ต่อ 202", level: 2, title: "นางนภา พรประเสริฐ", image_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400" },
          { pos: "ที่ปรึกษานายกเทศมนตรี", dept: "คณะผู้บริหาร", phone: "038-123-456 ต่อ 105", level: 3, title: "นายเกรียงไกร เกียรติเจริญ", image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
          { pos: "เลขานุการนายกเทศมนตรี", dept: "คณะผู้บริหาร", phone: "038-123-456 ต่อ 106", level: 3, title: "นางสาวสุชาดา รัตนกุล", image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400" },
          { pos: "ผู้อำนวยการสำนักช่าง", dept: "สำนักช่าง", phone: "038-123-456 ต่อ 301", level: 4, title: "นายธีระพงษ์ วิศวกรรม", image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400" },
          { pos: "ผู้อำนวยการสำนักการศึกษา", dept: "สำนักการศึกษา", phone: "038-123-456 ต่อ 401", level: 4, title: "นางปรียา ปัญญาวงศ์", image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400" },
          { pos: "ผู้อำนวยการกองสาธารณสุข", dept: "กองสาธารณสุขและสิ่งแวดล้อม", phone: "038-123-456 ต่อ 501", level: 4, title: "นายอนันต์ อนามัย", image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400" }
        ];

        const itemsToInsert = DEFAULT_EXECUTIVES.map(item => ({
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

        const targetTable = window.ACTIVE_TABLE_NAME || 'oic_documents';
        const { error } = await supabase.from(targetTable).insert(itemsToInsert);
        if (error) {
          await supabase.from("items").insert(itemsToInsert);
        }

        alert("ดึงชุดข้อมูลผู้บริหารเริ่มต้นสำเร็จเรียบร้อยแล้ว!");
        loadItems();
      } catch (e) {
        console.error("Seed error:", e);
        alert("ไม่สามารถดึงชุดข้อมูลได้: " + e.message);
      } finally {
        btnSeed.disabled = false;
        btnSeed.innerHTML = `<i class="fi fi-rr-cloud-download"></i> ดึงชุดข้อมูลผู้บริหารเริ่มต้น (10 รายชื่อ)`;
      }
    });
  }

  const btnSeedM91 = document.getElementById("btn-seed-m91");
  if (btnSeedM91) {
    btnSeedM91.addEventListener("click", async () => {
      if (!confirm("คุณต้องการดึงชุดข้อมูลเริ่มต้น มาตรา 9 (1) (26 รายการ) ลงสู่ระบบใช่หรือไม่?")) return;

      btnSeedM91.disabled = true;
      btnSeedM91.innerHTML = `<i class="fi fi-rr-spinner animate-spin"></i> กำลังสร้างรายการ...`;

      try {
        await window.seedM91Folders();
        alert("สร้างชุดข้อมูลเริ่มต้น มาตรา 9 (1) ทั้งหมด 26 รายการเรียบร้อยแล้ว!");
        loadItems();
      } catch (e) {
        console.error("Seed m9_1 error:", e);
        alert("ไม่สามารถสร้างชุดข้อมูลได้: " + e.message);
      } finally {
        btnSeedM91.disabled = false;
        btnSeedM91.innerHTML = `<i class="fi fi-rr-folder-add"></i> ดึงชุดข้อมูลเริ่มต้น ม.9(1) (26 รายการ)`;
      }
    });
  }

  const btnSeedM92 = document.getElementById("btn-seed-m92");
  if (btnSeedM92) {
    btnSeedM92.addEventListener("click", async () => {
      if (!confirm("คุณต้องการดึงชุดข้อมูลเริ่มต้น มาตรา 9 (2) (8 รายการ) ลงสู่ระบบใช่หรือไม่?")) return;

      btnSeedM92.disabled = true;
      btnSeedM92.innerHTML = `<i class="fi fi-rr-spinner animate-spin"></i> กำลังสร้างรายการ...`;

      try {
        await window.seedM92Items();
        alert("สร้างชุดข้อมูลเริ่มต้น มาตรา 9 (2) ทั้งหมด 8 รายการเรียบร้อยแล้ว!");
        loadItems();
      } catch (e) {
        console.error("Seed m9_2 error:", e);
        alert("ไม่สามารถสร้างชุดข้อมูลได้: " + e.message);
      } finally {
        btnSeedM92.disabled = false;
        btnSeedM92.innerHTML = `<i class="fi fi-rr-folder-add"></i> ดึงชุดข้อมูลเริ่มต้น ม.9(2) (8 รายการ)`;
      }
    });
  }

  const itemForm = document.getElementById("item-form");
  if (itemForm) {
    itemForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btnSave = document.getElementById("btn-save-item");
      btnSave.disabled = true;
      btnSave.textContent = "กำลังบันทึก...";

      try {
        const id = document.getElementById("item-id").value;
        const isFolder = document.getElementById("item-is-folder").value === "true";
        const title = document.getElementById("item-title").value.trim();
        let description = document.getElementById("item-desc").value.trim();
        const link = document.getElementById("item-link").value.trim();

        if (window.activeCategory === "executives" && !isFolder) {
          const position = document.getElementById("exec-position").value.trim();
          const department = document.getElementById("exec-department").value.trim();
          const phone = document.getElementById("exec-phone").value.trim();
          const level = parseInt(document.getElementById("exec-level").value) || 1;
          const bio = description;

          description = JSON.stringify({ position, department, phone, level, bio });
        } else if (window.activeCategory === "officers" && !isFolder) {
          const position = document.getElementById("officer-position").value.trim();
          description = JSON.stringify({ position, bio: "" });
        }

        let imageUrl = document.getElementById("item-image-url").value;
        let fileUrl = document.getElementById("item-file-url").value;
        let fileSize = null;

// Helper: Convert File to compressed Data URL (fallback if Storage RLS blocks upload)
function fileToDataUrl(file, maxWidth = 800, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        } catch (canvasErr) {
          resolve(e.target.result);
        }
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

        if (!isFolder) {
          const imageFile = document.getElementById("item-image-file").files[0];
          if (imageFile) {
            document.getElementById("image-upload-status").classList.remove("hidden");
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Date.now()}_img.${fileExt}`;
            
            let uploadedToStorage = false;
            try {
              const { data, error } = await supabase.storage
                .from("ico-bucket")
                .upload(fileName, imageFile, { upsert: true });

              if (!error && data) {
                const { data: { publicUrl } } = supabase.storage
                  .from("ico-bucket")
                  .getPublicUrl(fileName);

                imageUrl = publicUrl;
                uploadedToStorage = true;
              } else if (error) {
                console.warn("Storage upload failed (RLS policy or bucket restriction). Switching to Data URL fallback:", error);
              }
            } catch (storageErr) {
              console.warn("Storage upload exception, switching to Data URL fallback:", storageErr);
            }

            // Fallback: If Supabase Storage upload was blocked by RLS or bucket settings, convert to high quality compressed Data URL
            if (!uploadedToStorage) {
              try {
                imageUrl = await fileToDataUrl(imageFile);
                console.log("Photo converted to Data URL successfully as fallback.");
              } catch (convErr) {
                console.error("Failed to convert image to Data URL:", convErr);
                throw new Error("ไม่สามารถประมวลผลไฟล์ภาพได้: " + (convErr.message || convErr));
              }
            }

            document.getElementById("image-upload-status").classList.add("hidden");
          }

          if (window.activeCategory !== "officers" && window.activeCategory !== "executives") {
            const docFile = document.getElementById("item-file-file").files[0];
            if (docFile) {
              fileSize = docFile.size;
              document.getElementById("file-upload-status").classList.remove("hidden");
              const fileExt = docFile.name.split('.').pop();
              const fileName = `${Date.now()}_doc.${fileExt}`;
              const { data, error } = await supabase.storage
                .from("ico-bucket")
                .upload(fileName, docFile);

              if (error) throw error;

              const { data: { publicUrl } } = supabase.storage
                .from("ico-bucket")
                .getPublicUrl(fileName);

              fileUrl = publicUrl;
              document.getElementById("file-upload-status").classList.add("hidden");
            }
          } else {
            fileUrl = null;
          }
        }

        const targetTable = window.ACTIVE_TABLE_NAME || 'oic_documents';

        const itemData = {
          category: window.activeCategory,
          parent_id: window.currentParentId || null,
          is_folder: isFolder,
          title,
          description,
          link: (isFolder || window.activeCategory === "officers" || window.activeCategory === "executives") ? null : link,
          image_url: isFolder ? null : imageUrl,
          file_url: (isFolder || window.activeCategory === "officers" || window.activeCategory === "executives") ? null : fileUrl,
          file_size: isFolder ? null : fileSize
        };

        if (id) {
          const { error } = await supabase
            .from(targetTable)
            .update(itemData)
            .eq("id", id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from(targetTable)
            .insert([itemData]);

          if (error) throw error;
        }

        closeForm();
        loadItems();
      } catch (err) {
        console.error("Error saving item:", err);
        let errorMsg = err.message || err;
        if (typeof errorMsg === "string" && errorMsg.includes("row-level security policy")) {
          errorMsg = `ติดสิทธิ์ความปลอดภัย Supabase RLS (Row-Level Security Policy)\nกรุณาไปที่ Supabase Console -> SQL Editor และรันคำสั่ง SQL เพื่อเปิดสิทธิ์ตาราง ${targetTable} และ Storage ico-bucket\n\n(รายละเอียด: ${errorMsg})`;
        }
        alert("ไม่สามารถบันทึกข้อมูลได้: " + errorMsg);
      } finally {
        btnSave.disabled = false;
        btnSave.textContent = "บันทึกข้อมูล";
      }
    });
  }
};

window.closeForm = function () {
  const overlay = document.getElementById("admin-form-modal-overlay");
  if (overlay) overlay.classList.add("hidden");

  const execFields = document.getElementById("executive-fields");
  if (execFields) execFields.classList.add("hidden");

  const officerFields = document.getElementById("officer-fields");
  if (officerFields) officerFields.classList.add("hidden");

  const linkWrap = document.getElementById("external-link-wrapper");
  if (linkWrap) linkWrap.classList.remove("hidden");

  const docCard = document.getElementById("doc-upload-card");
  if (docCard) docCard.classList.remove("hidden");

  const descWrap = document.getElementById("item-desc-wrapper");
  if (descWrap) descWrap.classList.remove("hidden");

  const linkSec = document.getElementById("file-link-section");
  if (linkSec) linkSec.classList.remove("hidden");

  const itemForm = document.getElementById("item-form");
  if (itemForm) itemForm.reset();

  document.getElementById("item-id").value = "";
  document.getElementById("item-is-folder").value = "false";

  const imgStat = document.getElementById("image-upload-status");
  if (imgStat) imgStat.classList.add("hidden");

  const fileStat = document.getElementById("file-upload-status");
  if (fileStat) fileStat.classList.add("hidden");
};

window.editItem = async (id) => {
  window.isEditing = true;
  document.getElementById("form-title").textContent = "แก้ไขข้อมูล";

  const execFields = document.getElementById("executive-fields");
  const officerFields = document.getElementById("officer-fields");
  const titleLabel = document.getElementById("item-title-label-text");
  const linkWrap = document.getElementById("external-link-wrapper");
  const docCard = document.getElementById("doc-upload-card");
  const imgCard = document.getElementById("image-upload-card");
  const descWrap = document.getElementById("item-desc-wrapper");
  const targetTable = window.ACTIVE_TABLE_NAME || 'oic_documents';

  try {
    let item = null;
    const res1 = await supabase.from(targetTable).select("*").eq("id", id).single();
    if (!res1.error && res1.data) {
      item = res1.data;
    } else {
      const res2 = await supabase.from("items").select("*").eq("id", id).single();
      if (!res2.error && res2.data) {
        item = res2.data;
      }
    }

    if (!item) throw new Error("ไม่พบข้อมูลรายการนี้");

    document.getElementById("item-id").value = item.id;
    document.getElementById("item-is-folder").value = String(Boolean(item.is_folder));
    document.getElementById("item-title").value = item.title;
    document.getElementById("item-link").value = item.link || "";
    document.getElementById("item-image-url").value = item.image_url || "";
    document.getElementById("item-file-url").value = item.file_url || "";

    if (item.is_folder) {
      document.getElementById("file-link-section").classList.add("hidden");
      if (execFields) execFields.classList.add("hidden");
      if (officerFields) officerFields.classList.add("hidden");
      document.getElementById("item-desc").value = item.description || "";
    } else {
      document.getElementById("file-link-section").classList.remove("hidden");

      if (window.activeCategory === "officers") {
        document.getElementById("form-title").textContent = "แก้ไขข้อมูลเจ้าหน้าที่";
        if (titleLabel) titleLabel.textContent = "ชื่อ - นามสกุล เจ้าหน้าที่";
        if (linkWrap) linkWrap.classList.add("hidden");
        if (docCard) docCard.classList.add("hidden");
        if (imgCard) imgCard.classList.remove("hidden");
        if (descWrap) descWrap.classList.add("hidden");
        if (officerFields) officerFields.classList.remove("hidden");
        if (execFields) execFields.classList.add("hidden");

        if (item.description) {
          try {
            const parsed = JSON.parse(item.description);
            document.getElementById("officer-position").value = parsed.position || "";
          } catch (e) {
            document.getElementById("officer-position").value = item.description || "";
          }
        }
      } else if (window.activeCategory === "executives" && item.description) {
        document.getElementById("form-title").textContent = "แก้ไขข้อมูลผู้บริหาร";
        if (titleLabel) titleLabel.textContent = "ชื่อ - นามสกุล ผู้บริหาร";
        if (linkWrap) linkWrap.classList.add("hidden");
        if (docCard) docCard.classList.add("hidden");
        if (imgCard) imgCard.classList.remove("hidden");
        if (descWrap) descWrap.classList.remove("hidden");
        if (execFields) execFields.classList.remove("hidden");
        if (officerFields) officerFields.classList.add("hidden");

        try {
          const parsed = JSON.parse(item.description);
          document.getElementById("exec-position").value = parsed.position || "";
          document.getElementById("exec-department").value = parsed.department || "";
          document.getElementById("exec-phone").value = parsed.phone || "";
          document.getElementById("exec-level").value = parsed.level || "1";
          document.getElementById("item-desc").value = parsed.bio || "";
        } catch (e) {
          document.getElementById("exec-position").value = item.description || "";
          document.getElementById("item-desc").value = item.description || "";
        }
      } else {
        if (execFields) execFields.classList.add("hidden");
        if (officerFields) officerFields.classList.add("hidden");
        if (linkWrap) linkWrap.classList.remove("hidden");
        if (docCard) docCard.classList.remove("hidden");
        if (imgCard) imgCard.classList.remove("hidden");
        if (descWrap) descWrap.classList.remove("hidden");
        document.getElementById("item-desc").value = item.description || "";
      }
    }

    const overlay = document.getElementById("admin-form-modal-overlay");
    if (overlay) overlay.classList.remove("hidden");
  } catch (err) {
    console.error("Error loading item details:", err);
    alert("ดึงข้อมูลมาแสดงไม่สำเร็จ: " + err.message);
    closeForm();
  }
};

window.deleteItem = async (id) => {
  if (!confirm("คุณต้องการลบข้อมูลรายการนี้ใช่หรือไม่? หากลบโฟลเดอร์ไฟล์ภายในจะถูกลบไปด้วย")) return;
  const targetTable = window.ACTIVE_TABLE_NAME || 'oic_documents';

  try {
    const { error } = await supabase
      .from(targetTable)
      .delete()
      .eq("id", id);

    if (error) {
      await supabase.from("items").delete().eq("id", id);
    }

    loadItems();
  } catch (err) {
    console.error("Error deleting item:", err);
    alert("ไม่สามารถลบข้อมูลได้: " + err.message);
  }
};
