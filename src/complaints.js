// ============================================================
// public_complaint - Aceternity 3D Container Scroll Animation
// Integrated for Chaopraya Surasak Municipality Complaints Flow
// ============================================================

let complaintScrollListener = null;

// Main Render Function for #public_complaint view
async function renderPublicComplaintsView(container) {
  // Hide top page header banner on #public_complaint page
  const headerBanner = document.getElementById("page-header-banner");
  if (headerBanner) {
    headerBanner.style.display = "none";
  }

  // Clean up any previously attached scroll listener
  if (complaintScrollListener) {
    window.removeEventListener("scroll", complaintScrollListener);
    window.removeEventListener("resize", complaintScrollListener);
    complaintScrollListener = null;
  }

  // Render Full 3D Scroll Hero & Complaints Workflow Component
  container.innerHTML = `
    <div id="container-scroll-root" class="w-full relative pb-12 pt-4 select-none">
      
      <!-- Outer 3D Perspective Wrapper (Aceternity UI ContainerScroll) -->
      <div id="container-scroll-viewport" class="w-full relative py-6 sm:py-10 md:py-12" style="perspective: 1200px; -webkit-perspective: 1200px;">
        
        <!-- Animated Header Title Component -->
        <div id="scroll-header" class="max-w-5xl mx-auto text-center px-4 mb-6 sm:mb-10 transition-transform duration-100 ease-out will-change-transform">
          <h1 class="text-xl sm:text-2xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            แจ้งเรื่องร้องเรียน & ร้องทุกข์ <br class="hidden sm:inline" />
            <span class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#065757] tracking-tight">
              สะดวกรวดเร็ว ผ่าน LINE OA
            </span>
          </h1>
          <p class="text-xs sm:text-base text-slate-600 font-medium mt-3 max-w-2xl mx-auto leading-relaxed">
            ติดตามสถานะการดำเนินงานได้ตลอด 24 ชั่วโมง เพียงเพิ่มเพื่อน LINE Official Account <br> เทศบาลนครเจ้าพระยาสุรศักดิ์
          </p>
        </div>

        <!-- 3D Perspective Device / Screen Card Frame -->
        <div id="scroll-3d-card" 
             class="max-w-5xl mx-auto w-full border-[3px] sm:border-4 border-slate-700/80 p-2 sm:p-4 md:p-6 bg-[#1a2322] rounded-[26px] sm:rounded-[36px] md:rounded-[42px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] transition-transform duration-100 ease-out will-change-transform"
             style="transform: rotateX(20deg) scale(0.92); transform-style: preserve-3d;">
          
          <!-- Inner Screen Display Bezel -->
          <div class="w-full bg-slate-50 rounded-2xl sm:rounded-[24px] md:rounded-[28px] overflow-hidden border border-slate-200 shadow-inner flex flex-col">
            
            <!-- Tablet Top Bar / Window Controls -->
            <div class="px-4 py-3 bg-white border-b border-slate-200/90 flex items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-rose-400"></span>
                <span class="w-3 h-3 rounded-full bg-amber-400"></span>
                <span class="w-3 h-3 rounded-full bg-emerald-400"></span>
                <span class="text-xs font-bold text-slate-700 ml-2 hidden sm:inline">
                  ระบบรับเรื่องร้องเรียน/อุทธรณ์ออนไลน์ • เทศบาลนครเจ้าพระยาสุรศักดิ์
                </span>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#06c755] border border-emerald-200 text-[11px] font-bold inline-flex items-center gap-1">
                  <i class="fi fi-brands-line text-xs"></i> LINE Official
                </span>
                <span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold hidden md:inline">
                  @chaopraya
                </span>
              </div>
            </div>

            <!-- Inside Screen Content: 3-Step Guide Section -->
            <div class="p-5 sm:p-8 md:p-10 bg-gradient-to-b from-white via-slate-50/70 to-slate-100/80">
              
              <!-- Title Inside Screen -->
              <div class="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
                <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-prompt">
                  เพียง 3 ขั้นตอนง่ายๆ ในการส่งเรื่อง
                </h2>
                <p class="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                  เจ้าหน้าที่พร้อมรับเรื่องและประสานงานแก้ไขปัญหาให้ประชาชนอย่างรวดเร็ว
                </p>
              </div>

              <!-- 3-Column Step Cards -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
                
                <!-- STEP 1 -->
                <div class="flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all duration-300 group">
                  <div class="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto flex items-center justify-center mb-5">
                    <div class="absolute inset-0 rounded-full bg-gradient-to-b from-emerald-100/90 to-teal-50 shadow-inner group-hover:scale-105 transition-transform duration-300"></div>
                    <div class="relative z-10 w-16 h-22 bg-white rounded-2xl shadow-md border-2 border-emerald-400/30 overflow-hidden flex flex-col transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                      <div class="w-6 h-1 bg-gray-200 rounded-full mx-auto mt-1"></div>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2e/LINE_New_App_Icon_%282020-12%29.png" alt="LINE OA" class="w-full h-full object-contain p-2">
                    </div>
                  </div>
                  <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
                    ขั้นตอนที่ 1
                  </div>
                  <h3 class="font-bold text-base sm:text-lg text-slate-900 mb-2 font-prompt">
                    เพิ่มเพื่อน LINE OA
                  </h3>
                  <p class="text-xs text-slate-500 leading-relaxed font-normal">
                    แอดไลน์บัญชีทางการของเทศบาลนครเจ้าพระยาสุรศักดิ์เพื่อเข้าสู่ระบบ
                  </p>
                </div>

                <!-- STEP 2 -->
                <div class="flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-amber-300 transition-all duration-300 group">
                  <div class="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto flex items-center justify-center mb-5">
                    <div class="absolute inset-0 rounded-full bg-gradient-to-b from-amber-100/90 to-amber-50 shadow-inner group-hover:scale-105 transition-transform duration-300"></div>
                    <div class="relative z-10 flex items-center justify-center">
                      <div class="w-16 h-22 bg-white rounded-xl shadow-md border border-amber-300 p-2 flex flex-col justify-between transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
                        <div class="flex items-center gap-1 text-[8px] font-bold text-amber-700 border-b border-amber-100 pb-1">
                          <i class="fi fi-sr-marker text-rose-500 text-[9px]"></i> แจ้งเรื่อง
                        </div>
                        <div class="space-y-1">
                          <div class="w-full h-1 bg-amber-300 rounded"></div>
                          <div class="w-full h-1 bg-gray-200 rounded"></div>
                        </div>
                        <div class="w-full bg-[#06c755] text-white text-[7px] font-bold py-0.5 rounded text-center">
                          ส่งเรื่อง
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold mb-2">
                    ขั้นตอนที่ 2
                  </div>
                  <h3 class="font-bold text-base sm:text-lg text-slate-900 mb-2 font-prompt">
                    ส่งข้อมูลเรื่องร้องเรียน
                  </h3>
                  <p class="text-xs text-slate-500 leading-relaxed font-normal">
                    กดปุ่ม "แจ้งเรื่อง" ระบุพิกัดสถานที่ รายละเอียดปัญหา พร้อมแนบรูปถ่าย
                  </p>
                </div>

                <!-- STEP 3 -->
                <div class="flex flex-col items-center text-center p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-sky-300 transition-all duration-300 group">
                  <div class="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto flex items-center justify-center mb-5">
                    <div class="absolute inset-0 rounded-full bg-gradient-to-b from-sky-100/90 to-teal-50 shadow-inner group-hover:scale-105 transition-transform duration-300"></div>
                    <div class="relative z-10 w-16 h-22 bg-white rounded-2xl shadow-md border-2 border-sky-400/30 overflow-hidden flex flex-col p-1.5 justify-between transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
                      <div class="bg-emerald-50 border border-emerald-200 rounded p-1 text-[7px] font-bold text-emerald-700 flex items-center gap-0.5">
                        <span class="w-1 h-1 rounded-full bg-emerald-500 animate-ping"></span>
                        <span>รับเรื่องแล้ว</span>
                      </div>
                      <div class="w-full bg-[#06c755] text-white text-[7px] font-bold py-0.5 rounded text-center">
                        <i class="fi fi-sr-check-circle text-[7px]"></i> อัปเดตสถานะ
                      </div>
                    </div>
                  </div>
                  <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold mb-2">
                    ขั้นตอนที่ 3
                  </div>
                  <h3 class="font-bold text-base sm:text-lg text-slate-900 mb-2 font-prompt">
                    ติดตามผลแบบเรียลไทม์
                  </h3>
                  <p class="text-xs text-slate-500 leading-relaxed font-normal">
                    รับการแจ้งเตือนสถานะทันทีเมื่อเจ้าหน้าที่ดำเนินการแก้ไขเสร็จสิ้น
                  </p>
                </div>

              </div>

              <!-- Interactive Action Buttons Bar -->
              <div class="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onclick="openLineQrModal()" class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#06c755] hover:bg-[#00b900] text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-[#06c755]/25 hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer">
                  <i class="fi fi-brands-line text-xl"></i>
                  <span>เปิดสแกน LINE QR Code</span>
                </button>
                <a href="https://lin.ee/pl0cUeM" target="_blank" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base rounded-2xl shadow-md transition-all transform hover:-translate-y-0.5">
                  <span>เปิดในแอป LINE</span>
                  <i class="fi fi-rr-arrow-up-right text-xs"></i>
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

    <!-- MODAL: LINE QR Code Modal -->
    <div id="line-qr-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 hidden">
      <div class="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
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

  // Initialize Aceternity 3D Scroll Physics Engine
  setupContainerScrollAnimation();
}

function setupContainerScrollAnimation() {
  const root = document.getElementById("container-scroll-root");
  const card = document.getElementById("scroll-3d-card");
  const header = document.getElementById("scroll-header");
  if (!root || !card || !header) return;

  function updateScroll() {
    if (!root || !card || !header) return;
    const rect = root.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    // Calculate scroll progress (0 when entering view from bottom, 1 when centered/scrolled into focus)
    const totalDistance = windowHeight + rect.height;
    const currentPos = windowHeight - rect.top;
    let progress = currentPos / (totalDistance * 0.75);
    progress = Math.max(0, Math.min(1, progress));

    const isMobile = window.innerWidth <= 768;
    const minScale = isMobile ? 0.85 : 0.92;
    const maxScale = isMobile ? 0.98 : 1.0;
    
    // Aceternity 3D Transform Formula: rotateX 20deg -> 0deg, scale 0.92 -> 1.0
    const rotateX = 20 * (1 - progress);
    const scale = minScale + (maxScale - minScale) * progress;
    const translateY = -30 * progress;
    const headerTranslateY = -20 * progress;

    card.style.transform = `rotateX(${rotateX.toFixed(2)}deg) scale(${scale.toFixed(3)}) translateY(${translateY.toFixed(1)}px)`;
    header.style.transform = `translateY(${headerTranslateY.toFixed(1)}px)`;
  }

  // Mouse 3D Parallax Tilt Effect on Hover
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const tiltX = (y / rect.height) * -8;
    const tiltY = (x / rect.width) * 8;
    card.style.transform = `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale(1.01)`;
  });

  card.addEventListener("mouseleave", () => {
    updateScroll();
  });

  complaintScrollListener = updateScroll;
  window.addEventListener("scroll", updateScroll, { passive: true });
  window.addEventListener("resize", updateScroll, { passive: true });

  // Initial trigger
  requestAnimationFrame(updateScroll);
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
window.renderPublicComplaintsView = renderPublicComplaintsView;
window.openLineQrModal = openLineQrModal;
window.closeLineQrModal = closeLineQrModal;
