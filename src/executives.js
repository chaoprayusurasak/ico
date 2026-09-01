// ============================================================
// executives.js - Executives Page Component
// (Decorated with Full-Photo Portrait Cards & Dark Gradient Overlay matching reference)
// ============================================================

const DEFAULT_EXECUTIVES_LIST = [
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
    image_url: "./assets/executives/person_162.png"
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

function renderExecutivesView(container, rawItems = []) {
  if (!container) return;

  const sourceItems = (rawItems && rawItems.length > 0) ? rawItems : DEFAULT_EXECUTIVES_LIST;

  const parsedItems = sourceItems.map((item, idx) => {
    let pos = item.pos || "";
    let dept = item.dept || "";
    let phone = item.phone || "";
    let level = item.level || 2;
    let bio = item.bio || "";
    let img = item.image_url;

    if (!img || img.includes("placehold.co") || img.includes("chaoprayasurasak.go.th")) {
      img = DEFAULT_EXECUTIVES_LIST[idx % DEFAULT_EXECUTIVES_LIST.length]?.image_url || "./assets/executives/person_153.jpg";
    }

    if (item.description) {
      try {
        const p = JSON.parse(item.description);
        pos = p.position || pos;
        dept = p.department || dept;
        phone = p.phone || phone;
        level = parseInt(p.level) || level;
        bio = p.bio || bio;
      } catch (e) {
        pos = item.description || pos;
      }
    }

    return { ...item, pos, dept, phone, level, bio, image_url: img };
  });

  // Group executives by level
  const levels = {
    1: parsedItems.filter(i => i.level === 1),
    2: parsedItems.filter(i => i.level === 2),
    3: parsedItems.filter(i => i.level === 3),
    4: parsedItems.filter(i => i.level === 4)
  };

  if (levels[1].length === 0 && levels[2].length === 0 && levels[3].length === 0 && levels[4].length === 0) {
    levels[1] = parsedItems;
  }

  // Render individual Executive Card matching user's uploaded reference design
  const renderCard = (item, isMain = false) => {
    const img = item.image_url || "./assets/executives/person_153.jpg";

    return `
      <div class="relative group cursor-pointer transition-all duration-300 hover:-translate-y-1.5 rounded-tl-3xl overflow-hidden shadow-md hover:shadow-2xl ${isMain ? 'w-52 sm:w-60 md:w-64 mx-auto aspect-[3/4]' : 'w-full max-w-[190px] sm:max-w-[210px] md:max-w-[220px] aspect-[3/4]'} bg-gray-900 flex flex-col justify-end">
        
        <!-- Executive Portrait Image (Clear View from Top) -->
        <img src="${img}" alt="${item.title}" class="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105">

        <!-- Compact Dark Gradient Overlay (Only at bottom 35% to protect face visibility) -->
        <div class="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none z-10"></div>
        

        <!-- Executive Text Layered On Top of Photo (Positioned Above Green Bar) -->
        <div class="relative z-20 p-3 sm:p-3.5 pb-4 flex flex-col justify-end text-left">
          <!-- Position Title (White / Light Gray) -->
          <span class="font-bold text-gray-300 ${isMain ? 'text-xs sm:text-sm' : 'text-[11px] sm:text-xs'} leading-tight font-prompt opacity-90">
            ${item.pos || 'ผู้บริหาร'}
          </span>

          <!-- Full Name (Bold Pure White) -->
          <h3 class="font-extrabold text-white ${isMain ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'} leading-snug font-prompt mt-0.5 drop-shadow">
            ${item.title}
          </h3>

          <!-- Subtitle / Department / Phone -->
          ${item.dept || item.phone ? `
            <p class="text-[10px] sm:text-[11px] text-teal-200 font-medium mt-0.5 line-clamp-1 opacity-90">
              ${item.dept || item.phone}
            </p>
          ` : ''}
        </div>

      </div>
    `;
  };

  let html = `
    <div class="w-full py-4 px-2 max-w-6xl mx-auto flex flex-col items-center">
  `;

  // 1. Level 1: Mayor (Top Centered Card)
  if (levels[1].length > 0) {
    html += `<div class="flex justify-center items-center w-full mb-8">`;
    levels[1].forEach(item => {
      html += renderCard(item, true);
    });
    html += `</div>`;
  }

  // 2. Center Pill Selector Dropdown
  html += `
    <div class="relative z-20 my-4 flex justify-center">
      <div class="text-center font-bold text-xs text-brand-teal uppercase tracking-wider mb-6 flex items-center justify-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-brand-teal"></span> รองนายกเทศมนตรี <span class="w-1.5 h-1.5 rounded-full bg-brand-teal"></span>
      </div>
    </div>
  `;

  // 3. Level 2: Deputy Mayors (4-Column Grid)
  if (levels[2].length > 0) {
    html += `
      <div class="w-full max-w-5xl mx-auto mb-10">
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 w-full justify-items-center">
    `;
    levels[2].forEach(item => {
      html += renderCard(item, false);
    });
    html += `</div></div>`;
  }

  // 4. Level 3: Advisors (4-Column Grid)
  if (levels[3].length > 0) {
    html += `
      <div class="w-full max-w-5xl mx-auto mb-10 border-t border-gray-100/80 pt-6">
        <div class="text-center font-bold text-xs text-brand-teal uppercase tracking-wider mb-6 flex items-center justify-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-brand-teal"></span> คณะที่ปรึกษา <span class="w-1.5 h-1.5 rounded-full bg-brand-teal"></span>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 w-full justify-items-center">
    `;
    levels[3].forEach(item => {
      html += renderCard(item, false);
    });
    html += `</div></div>`;
  }

  // 5. Level 4: Secretaries (4-Column Grid)
  if (levels[4].length > 0) {
    html += `
      <div class="w-full max-w-5xl mx-auto mb-10 border-t border-gray-100/80 pt-6 ">
        <div class="text-center font-bold text-xs text-brand-teal uppercase tracking-wider mb-6 flex items-center justify-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-brand-teal"></span> เลขานุการนายกเทศมนตรี <span class="w-1.5 h-1.5 rounded-full bg-brand-teal"></span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-5 md:gap-6 w-full justify-items-center justify-content-center">
    `;
    levels[4].forEach(item => {
      html += renderCard(item, false);
    });
    html += `</div></div>`;
  }

  html += `</div>`;
  container.innerHTML = html;
}
