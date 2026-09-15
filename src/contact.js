/**
 * Standalone Contact Module (src/contact.js)
 * Official Municipality Department Phone Directory & Google Map
 * 
 * Styled with distinctive colorful card headers, Thai numeral badges (๑, ๒, ๓...),
 * and crisp typography inspired by Silpakorn university's department cards.
 */

function renderContactView(container) {
  if (!container) return;

  const departments = [
    { name: "ประชาสัมพันธ์", phone: "038-348205-6" },
    { name: "สำนักปลัด", phone: "038-348138" },
    { name: "สำนักคลัง", phone: "038-348175" },
    { name: "กองช่าง", phone: "038-348245" },
    { name: "กองสาธารณสุขและสิ่งแวดล้อม", phone: "038-348253" },
    { name: "กองยุทธศาสตร์และงบประมาณ", phone: "038-348157" },
    { name: "กองการศึกษา", phone: "038-348163" },
    { name: "กองสวัสดิการสังคม", phone: "038-348068" },
    { name: "งานป้องกันและบรรเทาสาธารณภัย", phone: "038-348000" },
    { name: "งานรักษาความสงบ (เทศกิจ)", phone: "038-348177" },
    { name: "งานทะเบียนราษฎร์", phone: "038-348164" }
  ];

  // Exact color palette matching the reference image cards
  const cardThemes = [
    { topBorder: "#EAB308", badgeBorder: "#FACC15", badgeBg: "#FEF9C3", badgeText: "#CA8A04" }, // 1 yellow
    { topBorder: "#64748B", badgeBorder: "#94A3B8", badgeBg: "#F1F5F9", badgeText: "#475569" }, // 2 blue-gray
    { topBorder: "#7C3AED", badgeBorder: "#A78BFA", badgeBg: "#F5F3FF", badgeText: "#7C3AED" }, // 3 purple
    { topBorder: "#EA580C", badgeBorder: "#FB923C", badgeBg: "#FFF7ED", badgeText: "#EA580C" }, // 4 orange
    { topBorder: "#06B6D4", badgeBorder: "#67E8F9", badgeBg: "#ECFEFF", badgeText: "#0891B2" }, // 5 cyan
    { topBorder: "#1E3A8A", badgeBorder: "#60A5FA", badgeBg: "#EFF6FF", badgeText: "#1E40AF" }, // 6 dark blue
    { topBorder: "#D97706", badgeBorder: "#FBBF24", badgeBg: "#FFFBEB", badgeText: "#D97706" }, // 7 amber
    { topBorder: "#4D7C0F", badgeBorder: "#A3E635", badgeBg: "#F7FEE7", badgeText: "#4D7C0F" }, // 8 olive green
    { topBorder: "#881337", badgeBorder: "#FB7185", badgeBg: "#FFF1F2", badgeText: "#9F1239" }, // 9 wine/crimson
    { topBorder: "#DB2777", badgeBorder: "#F472B6", badgeBg: "#FDF2F8", badgeText: "#DB2777" }, // 10 pink/rose
    { topBorder: "#A16207", badgeBorder: "#EAB308", badgeBg: "#FEFCE8", badgeText: "#A16207" }, // 11 khaki/gold
    { topBorder: "#0D9488", badgeBorder: "#2DD4BF", badgeBg: "#F0FDFA", badgeText: "#0D9488" }  // 12 teal
  ];

  const deptGridHtml = departments.map((dept, idx) => {
    const theme = cardThemes[idx % cardThemes.length];
    const cleanPhone = dept.phone.replace(/[^0-9]/g, '');

    return `
      <div class="bg-white p-5 border border-slate-200/90 rounded-none rounded-br-[28px] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
        style="border-top: 4px solid ${theme.topBorder};">

        <!-- Middle: Department Name (Crisp Dark Bold Text) -->
        <div class="my-2 min-h-[46px] flex items-center">
          <h3 class="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-[#008675] transition-colors">
            ${dept.name}
          </h3>
        </div>

        <!-- Bottom: Phone Number Pill Link -->
        <a href="tel:${cleanPhone}" 
          title="โทรติดต่อ ${dept.name}"
          class="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#008675] transition-colors">
          <span class="inline-flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-[#008675]/10 flex items-center justify-center text-slate-600 group-hover:text-[#008675] transition-all">
              <i class="fi fi-rr-phone-call text-xs"></i>
            </span>
            <span>${dept.phone}</span>
          </span>
          <i class="fi fi-rr-arrow-right text-[10px] text-slate-300 group-hover:text-[#008675] group-hover:translate-x-0.5 transition-all"></i>
        </a>

      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="w-full max-w-6xl mx-auto px-3 sm:px-6 py-6 font-prompt text-slate-900 animate-fade-in space-y-10">

      <!-- Department Cards Grid (4 columns on desktop matching reference image) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        ${deptGridHtml}
      </div>

        <div class="w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.602167454067!2d100.99971339999999!3d13.1243705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29670fe555555%3A0x5957b9f4849517dc!2sChaophraya%20Surasak%20City%20Municipality%20Office!5e0!3m2!1sen!2sth!4v1784878904417!5m2!1sen!2sth"
            width="100%"
            height="100%"
            style="border:0;"
            loading="lazy"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
            title="แผนที่เทศบาลนครเจ้าพระยาสุรศักดิ์">
          </iframe>
        </div>

      </div>

    </div>
  `;
}

// Attach globally
window.renderContactView = renderContactView;