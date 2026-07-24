/**
 * Standalone Contact Module (src/contact.js)
 * Official Municipality Department Phone Directory (3-Column Grid) & Google Map
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

  const deptGridHtml = departments.map(dept => `
    <div class="p-4 sm:p-5 bg-slate-50/80 border border-slate-200/70 rounded-2xl hover:border-brand-teal/40 hover:bg-teal-50/30 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-2 group">
      <h3 class="text-sm sm:text-base font-bold text-red-800 group-hover:text-brand-teal transition-colors">
        ${dept.name}
      </h3>

      <div class="flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-teal pt-1 border-t border-gray-100">
        <i class="fi fi-rr-phone-call text-xs"></i>
        <span>${dept.phone}</span>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="bg-transparent rounded-3xl p-6 sm:p-10 space-y-8 animate-fade-in font-prompt">

      <!-- รายชื่อหน่วยงาน -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
        ${deptGridHtml}
      </div>

      <!-- Google Maps -->
      <div class="space-y-4 pt-6 border-t border-gray-200">
        <div class="w-full h-[380px] sm:h-[460px] rounded-2xl overflow-hidden border border-gray-200 shadow-lg">

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