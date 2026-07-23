// ============================================================
// public_complaint - LINE Complaints Flow Component
// (Decorated to match Starbucks-style simple steps workflow)
// ============================================================

// Main Render Function for #public_complaint view
async function renderPublicComplaintsView(container) {
  if (!container) return;

  // Render Full Decorated View
  container.innerHTML = `
    <div class="w-full space-y-8 py-2">
      
      <!-- HERO STEP GUIDE SECTION (Matching Reference Image) -->
      <div class="w-full bg-white rounded-3xl p-6 sm:p-10 md:p-14 border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] text-center relative overflow-hidden">
        
        <!-- Header Title & Subtitle -->
        <div class="max-w-2xl mx-auto mb-10 md:mb-14">
          <h2 class="text-3xl sm:text-4xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3 font-prompt">
            เพียงขั้นตอนง่ายๆ
          </h2>
          <p class="text-sm sm:text-base text-gray-500 font-normal leading-relaxed">
            ให้คุณแจ้งเรื่องร้องเรียน อุทธรณ์ และติดตามสถานะการดำเนินงานผ่าน LINE ได้สะดวกยิ่งขึ้น
          </p>
        </div>

        <!-- 3-Column Steps Container -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-12 max-w-5xl mx-auto items-start">
          
          <!-- STEP 1 -->
          <div class="flex flex-col items-center group">
            <!-- Circle Illustration 1 -->
            <div class="relative w-36 h-36 md:w-40 md:h-40 mx-auto flex items-center justify-center mb-6">
              <div class="absolute inset-0 rounded-full bg-gradient-to-b from-emerald-100/80 to-teal-50 shadow-inner flex items-center justify-center transition-transform duration-300 group-hover:scale-105"></div>
              
              <!-- Floating Star Accent -->
              <div class="absolute top-2 right-2 w-6 h-6 text-amber-400 animate-pulse z-20">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>
              
              <!-- Smartphone SVG Illustration -->
              <div class="relative z-10 w-20 h-28 bg-white rounded-2xl shadow-lg border-2 border-emerald-400/30 overflow-hidden flex flex-col transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                <div class="w-7 h-1.5 bg-gray-200 rounded-full mx-auto mt-1"></div>
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2e/LINE_New_App_Icon_%282020-12%29.png" alt="LINE OA" class="w-full h-full object-contain rounded-lg">
              </div>
            </div>

            <!-- Step Title & Description -->
            <h3 class="font-bold text-lg md:text-xl text-gray-900 mb-2 leading-snug font-prompt">
              เพิ่มเพื่อน LINE OA
            </h3>
            <p class="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-xs font-light">
              เพิ่มเพื่อน LINE Official Account ของเทศบาลนครเจ้าพระยาสุรศักดิ์ เพื่อเริ่มต้นการใช้งานและแจ้งเรื่องร้องเรียน
            </p>
          </div>

          <!-- STEP 2 -->
          <div class="flex flex-col items-center group">
            <!-- Circle Illustration 2 -->
            <div class="relative w-36 h-36 md:w-40 md:h-40 mx-auto flex items-center justify-center mb-6">
              <div class="absolute inset-0 rounded-full bg-gradient-to-b from-amber-100/80 to-amber-50 shadow-inner flex items-center justify-center transition-transform duration-300 group-hover:scale-105"></div>
              
              <!-- Floating Star Accent -->
              <div class="absolute top-2 left-2 w-5 h-5 text-amber-400 animate-pulse z-20">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>

              <!-- Smartphone & Form Illustration -->
              <div class="relative z-10 flex items-center justify-center">
                <div class="w-16 h-20 bg-white rounded-xl shadow-md border border-amber-200 p-1.5 flex flex-col justify-between transform -rotate-12 z-0">
                  <div class="w-full h-9 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                    <i class="fi fi-rr-camera text-sm"></i>
                  </div>
                  <div class="w-full h-1 bg-gray-200 rounded"></div>
                  <div class="w-2/3 h-1 bg-gray-200 rounded"></div>
                </div>
                <div class="w-18 h-24 bg-white rounded-xl shadow-lg border border-amber-300 p-2 flex flex-col justify-between transform rotate-6 -ml-5 z-10">
                  <div class="flex items-center gap-1 text-[8px] font-bold text-amber-700 border-b border-amber-100 pb-1">
                    <i class="fi fi-sr-marker text-rose-500 text-[10px]"></i> แจ้งเรื่อง
                  </div>
                  <div class="space-y-1">
                    <div class="w-full h-1 bg-amber-300 rounded"></div>
                    <div class="w-full h-1 bg-gray-200 rounded"></div>
                    <div class="w-3/4 h-1 bg-gray-200 rounded"></div>
                  </div>
                  <div class="w-full bg-[#06c755] text-white text-[8px] font-bold py-0.5 rounded text-center">
                    ส่งข้อมูล
                  </div>
                </div>
              </div>
            </div>

            <!-- Step Title & Description -->
            <h3 class="font-bold text-lg md:text-xl text-gray-900 mb-2 leading-snug font-prompt">
              ส่งรายละเอียดเรื่องร้องเรียน
            </h3>
            <p class="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-xs font-light">
              กดเมนู "แจ้งเรื่องร้องเรียน" ระบุตำแหน่ง สถานที่เกิดเหตุ รายละเอียดปัญหา พร้อมแนบรูปภาพเพื่อให้เจ้าหน้าที่ตรวจสอบ
            </p>
          </div>

          <!-- STEP 3 -->
          <div class="flex flex-col items-center group">
            <!-- Circle Illustration 3 -->
            <div class="relative w-36 h-36 md:w-40 md:h-40 mx-auto flex items-center justify-center mb-6">
              <div class="absolute inset-0 rounded-full bg-gradient-to-b from-sky-100/80 to-teal-50 shadow-inner flex items-center justify-center transition-transform duration-300 group-hover:scale-105"></div>

              <!-- Floating Star Accent -->
              <div class="absolute -bottom-1 left-2 w-6 h-6 text-amber-400 z-20">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>

              <!-- Smartphone Notification Screen -->
              <div class="relative z-10 w-20 h-28 bg-white rounded-2xl shadow-lg border-2 border-sky-400/30 overflow-hidden flex flex-col transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
                <div class="w-7 h-1.5 bg-gray-200 rounded-full mx-auto mt-1"></div>
                <div class="flex-1 p-1.5 flex flex-col justify-between bg-slate-50">
                  <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-1 text-[7px] font-bold text-emerald-700 flex items-center gap-1 shadow-2xs">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>🟢 แก้ไขเสร็จสิ้น</span>
                  </div>
                  <div class="bg-white rounded-lg p-1 shadow-2xs border border-gray-100 text-[7px]">
                    <div class="font-bold text-gray-800">เจ้าหน้าที่รับเรื่องแล้ว</div>
                    <div class="text-[6px] text-gray-400">อัปเดตเรียบร้อย</div>
                  </div>
                  <div class="w-full bg-[#06c755] text-white text-[7px] font-bold py-0.5 rounded text-center flex items-center justify-center gap-0.5">
                    <i class="fi fi-sr-check-circle text-[8px]"></i> เรียบร้อย
                  </div>
                </div>
              </div>
            </div>

            <!-- Step Title & Description -->
            <h3 class="font-bold text-lg md:text-xl text-gray-900 mb-2 leading-snug font-prompt">
              ติดตามสถานะการดำเนินงาน
            </h3>
            <p class="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-xs font-light">
              ระบบจะส่งการแจ้งเตือนเมื่อเจ้าหน้าที่รับเรื่องและเข้าดำเนินการ แก้ไขปัญหาได้ทันท่วงทีพร้อมแจ้งผลกลับทันที
            </p>
          </div>

        </div>

        <!-- LINE Official CTA Bar -->
        <div class="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onclick="openLineQrModal()" class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#06c755] hover:bg-[#00b900] text-white font-bold text-sm rounded-2xl shadow-lg shadow-[#06c755]/25 transition-all transform hover:-translate-y-0.5 cursor-pointer">
            <i class="fi fi-brands-line text-lg"></i>
            <span>เพิ่มเพื่อน LINE OA (@chaopraya)</span>
          </button>
        </div>

      </div>

    </div>

    <!-- MODAL: LINE QR Code Modal -->
    <div id="line-qr-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 hidden">
      <div class="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative border border-gray-100">
        <button onclick="closeLineQrModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <i class="fi fi-rr-cross-small"></i>
        </button>

        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2e/LINE_New_App_Icon_%282020-12%29.png" alt="LINE OA" class="w-12 h-12 mx-auto mb-3 rounded-2xl shadow-lg">

        <h3 class="font-bold text-lg text-gray-900 mb-1 font-prompt">สแกนเพื่อเพิ่มเพื่อน LINE OA</h3>
        <p class="text-xs text-gray-500 mb-5">เทศบาลนครเจ้าพระยาสุรศักดิ์ (@chaopraya)</p>

        <!-- QR Code Graphic -->
        <div class="w-48 h-48 mx-auto bg-white p-3 border-2 border-emerald-500/30 rounded-2xl shadow-inner flex flex-col items-center justify-center relative group mb-4">
          <img src="https://qr-official.line.me/gs/M_631zdwzo_BW.png?oat_content=qr" alt="LINE QR Code" class="w-full h-full object-contain rounded-lg">
        </div>

        <p class="text-xs text-gray-600 font-medium mb-4">
          สแกนผ่านแอป LINE บนมือถือ เพื่อแจ้งเรื่องร้องเรียนและรับการแจ้งเตือนสถานะทันที
        </p>

        <a href="https://lin.ee/pl0cUeM" target="_blank" class="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#06c755] hover:bg-[#00b900] text-white font-bold text-xs rounded-xl shadow-md transition-all">
          <i class="fi fi-brands-line text-base"></i> เปิดแอป LINE บนมือถือ
        </a>
      </div>
    </div>
  `;
}

function openLineQrModal() {
  const modal = document.getElementById("line-qr-modal");
  if (modal) modal.classList.remove("hidden");
}

function closeLineQrModal() {
  const modal = document.getElementById("line-qr-modal");
  if (modal) modal.classList.add("hidden");
}

// Make functions available globally
window.openLineQrModal = openLineQrModal;
window.closeLineQrModal = closeLineQrModal;
