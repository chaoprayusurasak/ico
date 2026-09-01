/**
 * Module: officers.js
 * Handles rendering for "เจ้าหน้าที่ผู้รับผิดชอบ" (Officers in Charge)
 * Styled identically to executives.js (Full Photo Portrait Cards & Dark Gradient Overlay)
 * Row 1: 1 Person (Top Centered Main Card)
 * Row 2: 4 People (4-Column Grid)
 * Row 3: 4 People (4-Column Grid)
 */

const DEFAULT_OFFICERS_LIST = [
  // Row 1 (1 Person - Head Officer)
  {
    id: "off-1",
    title: "นางสาวเพ็ญนภา สุวรรณรัตน์",
    position: "หัวหน้าศูนย์ข้อมูลข่าวสารของราชการ",
    image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500"
  },
  // Row 2 (4 People)
  {
    id: "off-2",
    title: "นายธนวัฒน์ พรหมเสน",
    position: "นักจัดการงานทั่วไปปฏิบัติการ",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
  },
  {
    id: "off-3",
    title: "นางสาวศิริพร บุญช่วย",
    position: "เจ้าพนักงานประชาสัมพันธ์ชำนาญงาน",
    image_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400"
  },
  {
    id: "off-4",
    title: "นายกิตติศักดิ์ รัตนพงษ์",
    position: "เจ้าพนักงานธุรการปฏิบัติงาน",
    image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
  },
  {
    id: "off-5",
    title: "นางสาวชลธิชา ใจดี",
    position: "เจ้าหน้าที่คอมพิวเตอร์ประจำศูนย์",
    image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400"
  },
  // Row 3 (4 People)
  {
    id: "off-6",
    title: "นายวิศรุต สุขเสริฐ",
    position: "เจ้าหน้าที่จัดเก็บเอกสารและระบบสารสนเทศ",
    image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
  },
  {
    id: "off-7",
    title: "นางสาวณิชากานต์ พรประเสริฐ",
    position: "เจ้าหน้าที่ให้บริการข้อมูลและรับเรื่องร้องเรียน",
    image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
  },
  {
    id: "off-8",
    title: "นายอนันต์ มั่นคง",
    position: "เจ้าพนักงานศูนย์บริการข้อมูลข่าวสาร",
    image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400"
  },
  {
    id: "off-9",
    title: "นางสาวปรียาภรณ์ วงศ์สว่าง",
    position: "เจ้าหน้าที่สนับสนุนงานศูนย์ข้อมูลข่าวสาร",
    image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400"
  }
];

window.renderOfficersView = function (container, items = []) {
  if (!container) return;

  const sourceItems = (items && items.length > 0) ? items : DEFAULT_OFFICERS_LIST;

  const parsedItems = sourceItems.map(item => {
    let pos = item.position || item.pos || "";
    let bio = item.bio || "";
    let img = item.image_url;

    if (item.description) {
      try {
        const p = JSON.parse(item.description);
        pos = p.position || pos;
        bio = p.bio || bio;
      } catch (e) {
        pos = item.description || pos;
      }
    }

    if (!img) img = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400";

    return { ...item, pos, bio, image_url: img };
  });

  // Split items into 3 Rows based on admin row configuration
  const config = (window.getOfficersRowConfig && typeof window.getOfficersRowConfig === "function")
    ? window.getOfficersRowConfig()
    : (() => {
      try {
        const saved = localStorage.getItem("officers_row_config");
        if (saved) return JSON.parse(saved);
      } catch (e) { }
      return { row1: 1, row2: 4, row3: 4 };
    })();

  const r1Count = Math.max(1, parseInt(config.row1) || 1);
  const r2Count = Math.max(0, parseInt(config.row2) || 4);

  const row1 = parsedItems.slice(0, r1Count);
  const row2 = parsedItems.slice(r1Count, r1Count + r2Count);
  const row3 = parsedItems.slice(r1Count + r2Count);

  const renderCard = (item, isMain = false) => {
    const img = item.image_url;

    return `
      <div class="relative group cursor-pointer transition-all duration-300 hover:-translate-y-1.5 rounded-tl-3xl overflow-hidden shadow-md hover:shadow-2xl ${isMain ? 'w-52 sm:w-60 md:w-64 mx-auto aspect-[3/4]' : 'w-full max-w-[190px] sm:max-w-[210px] md:max-w-[220px] aspect-[3/4]'} bg-gray-900 flex flex-col justify-end">
        
        <!-- Portrait Image (Top Alignment) -->
        <img src="${img}" alt="${item.title}" class="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" onerror="this.src='https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400'">

        <!-- Compact Dark Gradient Overlay (Bottom 40%) -->
        <div class="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none z-10"></div>

        <!-- Text Overlay -->
        <div class="relative z-20 p-3 sm:p-3.5 pb-4 flex flex-col justify-end text-left">
          <!-- Position Title (Teal/Light Mint) -->
          <span class="font-bold text-teal-300 ${isMain ? 'text-xs sm:text-sm' : 'text-[11px] sm:text-xs'} leading-tight font-prompt opacity-90 line-clamp-2">
            ${item.pos || 'เจ้าหน้าที่ผู้รับผิดชอบ'}
          </span>

          <!-- Full Name (Bold Pure White) -->
          <h3 class="font-extrabold text-white ${isMain ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'} leading-snug font-prompt mt-1 drop-shadow">
            ${item.title}
          </h3>
        </div>

      </div>
    `;
  };

  const renderRowGrid = (rowItems, forceMainSingle = false) => {
    if (!rowItems || rowItems.length === 0) return '';

    if (rowItems.length === 1 && forceMainSingle) {
      return `
        <div class="flex justify-center items-center w-full">
          ${renderCard(rowItems[0], true)}
        </div>
      `;
    }

    let gridColsClass = "grid-cols-2 sm:grid-cols-2 md:grid-cols-4";
    if (rowItems.length === 1) gridColsClass = "grid-cols-1 max-w-xs mx-auto";
    else if (rowItems.length === 2) gridColsClass = "grid-cols-2 sm:grid-cols-2 max-w-2xl mx-auto";
    else if (rowItems.length === 3) gridColsClass = "grid-cols-2 sm:grid-cols-3 max-w-3xl mx-auto";
    else if (rowItems.length === 5) gridColsClass = "grid-cols-2 sm:grid-cols-3 md:grid-cols-5 max-w-6xl mx-auto";
    else if (rowItems.length >= 6) gridColsClass = "grid-cols-2 sm:grid-cols-3 md:grid-cols-6 max-w-7xl mx-auto";

    return `
      <div class="grid ${gridColsClass} gap-5 md:gap-6 w-full justify-items-center">
        ${rowItems.map(item => renderCard(item, false)).join('')}
      </div>
    `;
  };

  let html = `
    <div class="w-full py-4 px-2 max-w-6xl mx-auto flex flex-col items-center">
  `;

  // Row 1
  if (row1.length > 0) {
    html += `
      <div class="w-full max-w-5xl mx-auto mb-10">
        ${renderRowGrid(row1, row1.length === 1)}
      </div>
    `;
  }

  // Row 2
  if (row2.length > 0) {
    html += `
      <div class="w-full max-w-5xl mx-auto mb-10 border-t border-gray-100/80 pt-6">
        ${renderRowGrid(row2, false)}
      </div>
    `;
  }

  // Row 3
  if (row3.length > 0) {
    html += `
      <div class="w-full max-w-5xl mx-auto mb-10 border-t border-gray-100/80 pt-6">
        ${renderRowGrid(row3, false)}
      </div>
    `;
  }

  html += `</div>`;
  container.innerHTML = html;
};
