/**
 * Module: about_history.js
 * Handles rendering for "ประวัติความเป็นมา" (About / History articles)
 * Designed to match the exact layout, centered typography, floating image card overlay dropdown, 
 * and teal caption style shown in the reference screenshot.
 */

window.renderAboutHistoryView = function (container, items) {
  let html = ``;

  const hasItems = items && items.length > 0;
  const mainTitle = hasItems && items[0].title ? items[0].title : "ประวัติศูนย์ข้อมูลข่าวสารอิเล็กทรอนิกส์ของราชการ";
  const mainDesc = hasItems && items[0].description
    ? items[0].description
    : `เทศบาลนครเจ้าพระยาสุรศักดิ์ ได้จัดตั้งศูนย์ข้อมูลข่าวสารของราชการขึ้น เพื่อปฏิบัติหน้าที่ตามพระราชบัญญัติข้อมูลข่าวสารของราชการ พ.ศ. ๒๕๔٠ เพื่อให้ประชาชนสามารถเข้าถึงข้อมูลข่าวสารของทางราชการได้อย่างสะดวก รวดเร็ว และโปร่งใส โดยจัดให้มีสถานที่จัดเก็บเอกสาร ดัชนีรวม และแฟ้มข้อมูลข่าวสารตามมาตรา ๗ และมาตรา ๙ เพื่อประโยชน์ในการรับรู้ข้อมูลข่าวสารของประชาชนในการปกครองระเบียบบริหารราชการแผ่นดินตามหลักธรรมาภิบาล`;

  const defaultImage = "./assets/executives/person_153.jpg";
  const heroImage = hasItems && items[0].image_url ? items[0].image_url : defaultImage;
  const imageCaption = hasItems && items[0].title ? items[0].title : "ประตูทางเข้าสำนักงานเทศบาลนครเจ้าพระยาสุรศักดิ์ และศูนย์ข้อมูลข่าวสารอิเล็กทรอนิกส์ของราชการ";

  html += `
    <div class="flex flex-col items-center py-6 px-3 sm:px-6 font-prompt max-w-5xl mx-auto">
      
      <!-- 1. Main Header Title (Centered Teal Text - Matching Screenshot) -->
      <h1 class="text-3xl sm:text-4xl md:text-[40px] font-extrabold text-[#008675] text-center tracking-tight mb-6 leading-tight">
        เทศบาลนครเจ้าพระยาสุรศักดิ์
      </h1>

      <!-- 2. Subtitle / Article Heading (Centered Bold Charcoal - Matching Screenshot) -->
      <h2 class="text-lg sm:text-xl font-bold text-slate-900 text-center mb-4 leading-snug">
        ${mainTitle}
      </h2>

      <!-- 3. Main Narrative Paragraph (Centered Layout with Comfortable Line-Height - Matching Screenshot) -->
      <div class="text-slate-700 text-base sm:text-lg leading-relaxed sm:leading-loose text-center max-w-4xl mx-auto mb-10 font-normal whitespace-pre-line">
        ${mainDesc}
      </div>

      <!-- 4. White Card Frame containing Image, Floating Overlay Dropdown Pill & Teal Caption -->
      <div class="w-full max-w-4xl bg-white rounded-3xl p-5 sm:p-8 md:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.06)]  transition-all duration-300">
        
        <!-- Image Container with Inner Shadow & Border -->
        <div class="relative overflow-hidden rounded-2xl shadow-inner group">
          <img id="history-main-image" src="${heroImage}" alt="${imageCaption}" class="w-full h-auto max-h-[520px] object-cover mx-auto transition-transform duration-500 group-hover:scale-102">
        </div>

        ${hasItems && (items[0].file_url || items[0].link) ? `
          <!-- Attachment Links / Download Bar -->
          <div class="flex flex-wrap items-center justify-center gap-3 border-t border-slate-100 pt-5 mt-5">
            ${items[0].link ? `
              <a href="${items[0].link}" target="_blank" class="px-5 py-2.5 bg-[rgba(0,134,117,0.08)] text-[#008675] font-bold text-xs rounded-xl hover:bg-[#008675] hover:text-white transition-all inline-flex items-center gap-2 shadow-xs">
                <i class="fi fi-rr-link"></i> อ่านเพิ่มเติม
              </a>
            ` : ''}
            ${items[0].file_url ? `
              <button onclick="downloadFile(event, '${(items[0].file_url || '').replace(/'/g, "\\'")}', '${(items[0].title || '').replace(/'/g, "\\'")}', '${items[0].id || ''}')" class="px-5 py-2.5 bg-[#008675] text-white font-bold text-xs rounded-xl hover:bg-[#007062] transition-all inline-flex items-center gap-2 shadow-md cursor-pointer">
                <i class="fi fi-rr-download"></i> ดาวน์โหลดเอกสารแนบ
              </button>
            ` : ''}
          </div>
        ` : ''}

      </div>

    </div>
  `;

  // Attach dropdown change handler globally
  window.onHistoryItemChange = function (e) {
    const idx = parseInt(e.target.value, 10);
    if (!isNaN(idx) && items && items[idx]) {
      const selected = items[idx];
      const imgEl = document.getElementById("history-main-image");
      const capEl = document.getElementById("history-main-caption");
      if (imgEl && selected.image_url) imgEl.src = selected.image_url;
      if (capEl && selected.title) capEl.textContent = selected.title;
    }
  };

  container.innerHTML = html;
};
