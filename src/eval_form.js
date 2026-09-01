/**
 * Module: eval_form.js
 * Dedicated Satisfaction Evaluation Form view renderer and Supabase database submission handler.
 * Design: Premium, Chic, Modern & Elegant State-of-the-Art Interface (เริ่ดๆ ไม่เอางาน AI ดั้งเดิม)
 */

window.renderEvalFormView = function (container) {
  if (!container) return;

  // Hide top page header banner on eval_form page
  const headerBanner = document.getElementById("page-header-banner");
  if (headerBanner) {
    headerBanner.style.display = "none";
  }

  container.innerHTML = `
    <div class="w-full font-kanit pb-10">
      
      <!-- Premium Hero Header Banner (Deep Emerald Gradient + Glassmorphism Pill) -->
      <div class="relative bg-gradient-to-br from-[#1B3834] via-[#008675] to-[#0A4D45] text-white p-6 sm:p-9 rounded-xl shadow-lg mb-8 overflow-hidden">
        <!-- Background Ambient Decorative Elements -->
        <div class="absolute -top-12 -right-12 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-16 -left-16 w-60 h-60 bg-emerald-400/15 rounded-full blur-2xl pointer-events-none"></div>
        
        <div class="relative z-10">
 
          <h2 class="text-xl sm:text-3xl font-medium mb-2.5 tracking-tight leading-snug">
            ประเมินความพึงพอใจการใช้งานเว็บไซต์
          </h2>
          <p class="text-teal-100 text-xs sm:text-sm font-normal leading-relaxed max-w-2xl opacity-90">
            ศูนย์ข้อมูลข่าวสารอิเล็กทรอนิกส์ของราชการ เทศบาลนครเจ้าพระยาสุรศักดิ์
          </p>
        </div>
      </div>

      <!-- Main Satisfaction Form Container -->
      <form id="satisfaction-eval-form" onsubmit="submitSatisfactionEval(event)" class="bg-white border border-gray-200/90 rounded-xl p-6 sm:p-9 shadow-xs space-y-8">
        
        <!-- Question Section 1: 3-Level Satisfaction Selection -->
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-6 bg-[#008675] rounded-full inline-block"></span>
            <label class="block text-sm sm:text-base font-medium text-gray-800 leading-snug">
              ท่านมีความพึงพอใจต่อการใช้งานเว็บไซต์ ศูนย์ข้อมูลข่าวสารอิเล็กทรอนิกส์เพียงใด? <span class="text-rose-500 font-bold">*</span>
            </label>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            
            <!-- Option 1: พึงพอใจมาก (Very Satisfied) -->
            <label class="relative flex flex-col justify-between p-5 bg-white hover:bg-emerald-50/40 border-2 border-gray-200/90 has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50/60 has-[:checked]:shadow-md rounded-xl cursor-pointer transition-all duration-200 group hover:-translate-y-0.5">
              <div class="flex items-start justify-between mb-3">
                <div class="w-12 h-12 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-2xs">
                  😍
                </div>
                <input type="radio" name="satisfaction_level" value="1" required onchange="toggleImprovementField(this.value)" class="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 mt-1 cursor-pointer">
              </div>

              <div>
                <div class="font-medium text-sm sm:text-base text-gray-800 group-hover:text-emerald-800 mb-1">
                  1 = พึงพอใจมาก
                </div>
                <div class="flex items-center gap-0.5 text-amber-400 text-xs">
                  <i class="fi fi-sr-star"></i>
                  <i class="fi fi-sr-star"></i>
                  <i class="fi fi-sr-star"></i>
                  <i class="fi fi-sr-star"></i>
                  <i class="fi fi-sr-star"></i>
                  <span class="text-gray-400 text-[11px] font-normal ml-1">(ดีเยี่ยม)</span>
                </div>
              </div>
            </label>

            <!-- Option 2: พึงพอใจ (Satisfied) -->
            <label class="relative flex flex-col justify-between p-5 bg-white hover:bg-teal-50/40 border-2 border-gray-200/90 has-[:checked]:border-[#008675] has-[:checked]:bg-teal-50/60 has-[:checked]:shadow-md rounded-xl cursor-pointer transition-all duration-200 group hover:-translate-y-0.5">
              <div class="flex items-start justify-between mb-3">
                <div class="w-12 h-12 rounded-xl bg-teal-100/80 text-teal-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-2xs">
                  🙂
                </div>
                <input type="radio" name="satisfaction_level" value="2" onchange="toggleImprovementField(this.value)" class="w-5 h-5 text-brand-teal focus:ring-brand-teal border-gray-300 mt-1 cursor-pointer">
              </div>

              <div>
                <div class="font-medium text-sm sm:text-base text-gray-800 group-hover:text-teal-800 mb-1">
                  2 = พึงพอใจ
                </div>
                <div class="flex items-center gap-0.5 text-amber-400 text-xs">
                  <i class="fi fi-sr-star"></i>
                  <i class="fi fi-sr-star"></i>
                  <i class="fi fi-sr-star"></i>
                  <i class="fi fi-rr-star text-gray-300"></i>
                  <i class="fi fi-rr-star text-gray-300"></i>
                  <span class="text-gray-400 text-[11px] font-normal ml-1">(ปานกลาง)</span>
                </div>
              </div>
            </label>

            <!-- Option 3: ควรปรับปรุง (Needs Improvement) -->
            <label class="relative flex flex-col justify-between p-5 bg-white hover:bg-amber-50/40 border-2 border-gray-200/90 has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50/60 has-[:checked]:shadow-md rounded-xl cursor-pointer transition-all duration-200 group hover:-translate-y-0.5">
              <div class="flex items-start justify-between mb-3">
                <div class="w-12 h-12 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-2xs">
                  🙁
                </div>
                <input type="radio" name="satisfaction_level" value="3" onchange="toggleImprovementField(this.value)" class="w-5 h-5 text-amber-500 focus:ring-amber-400 border-gray-300 mt-1 cursor-pointer">
              </div>
              <div>
                <div class="font-medium text-sm sm:text-base text-gray-800 group-hover:text-teal-800 mb-1">
                  3 = ควรปรับปรุง
                </div>
                <div class="flex items-center gap-0.5 text-amber-400 text-xs">
                  <i class="fi fi-sr-star"></i>
                  <i class="fi fi-rr-star text-gray-300"></i>
                  <i class="fi fi-rr-star text-gray-300"></i>
                  <i class="fi fi-rr-star text-gray-300"></i>
                  <i class="fi fi-rr-star text-gray-300"></i>
                  <span class="text-gray-400 text-[11px] font-normal ml-1">(น้อย)</span>
                </div>
              </div>
            </label>

          </div>
        </div>

        <!-- Conditional Section: โปรดแนะนำการปรับปรุง (Shown when Option 3 is selected) -->
        <div id="improvement-field-container" class="hidden transition-all duration-300 space-y-2 bg-amber-50/70 p-5 border border-amber-200 rounded-xl shadow-2xs">
          <div class="flex items-center gap-2 text-amber-900 mb-1">
            <i class="fi fi-rr-comment-alt text-amber-600 text-base"></i>
            <label for="improvement_suggestion" class="block text-xs sm:text-sm font-medium text-amber-900">
              โปรดแนะนำการปรับปรุง <span class="text-rose-500 font-bold">*</span>
            </label>
          </div>
          <textarea id="improvement_suggestion" name="improvement_suggestion" rows="3" placeholder="โปรดพิมพ์ระบุประเด็นที่ท่านต้องการให้เทศบาลปรับปรุงแก้ไข..." class="w-full p-3.5 bg-white border border-amber-300/80 rounded-lg text-xs sm:text-sm font-normal text-gray-800 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all placeholder:text-gray-400"></textarea>
        </div>

        <!-- Question Section 2: ข้อเสนอแนะเพิ่มเติม -->
        <div class="space-y-2">
          <div class="flex items-center gap-2 mb-1">
            <span class="w-2.5 h-6 bg-slate-300 rounded-full inline-block"></span>
            <label for="additional_comments" class="block text-xs sm:text-sm font-medium text-gray-800">
              ข้อเสนอแนะเพิ่มเติม
            </label>
          </div>
          <textarea id="additional_comments" name="additional_comments" rows="4" placeholder="พิมพ์ข้อเสนอแนะ หรือความคิดเห็นเพิ่มเติมที่ท่านต้องการเสนอแนะต่อเทศบาล..." class="w-full p-4 bg-slate-50/50 border border-gray-200 rounded-xl text-xs sm:text-sm font-normal text-gray-800 focus:bg-white focus:outline-none focus:border-[#008675] focus:ring-4 focus:ring-[#008675]/10 transition-all placeholder:text-gray-400"></textarea>
        </div>

        <!-- Dynamic Status Notification Box -->
        <div id="eval-status-msg" class="hidden p-4 rounded-xl text-xs sm:text-sm font-normal transition-all"></div>

        <!-- Form Submission Footer Actions -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button type="button" onclick="document.getElementById('satisfaction-eval-form').reset(); toggleImprovementField('');" class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-normal text-xs sm:text-sm rounded-lg transition-all cursor-pointer">
            ล้างข้อมูล
          </button>
          
          <button type="submit" id="eval-submit-btn" class="px-7 py-3 bg-gradient-to-r from-[#008675] to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-medium text-xs sm:text-sm rounded-lg shadow-md shadow-[#008675]/20 hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2 group">
            <i class="fi fi-rr-paper-plane text-xs group-hover:translate-x-0.5 transition-transform"></i>
            <span>ส่งแบบประเมิน</span>
          </button>
        </div>

      </form>
    </div>
  `;
};

// Toggle Conditional Improvement Field
window.toggleImprovementField = function (val) {
  const container = document.getElementById("improvement-field-container");
  const textarea = document.getElementById("improvement_suggestion");

  if (!container) return;

  if (val === "3" || val === 3) {
    container.classList.remove("hidden");
    if (textarea) textarea.required = true;
  } else {
    container.classList.add("hidden");
    if (textarea) {
      textarea.required = false;
      textarea.value = "";
    }
  }
};

// Handle Form Submission & Save to Supabase
window.submitSatisfactionEval = async function (e) {
  e.preventDefault();

  const submitBtn = document.getElementById("eval-submit-btn");
  const statusMsg = document.getElementById("eval-status-msg");
  const form = document.getElementById("satisfaction-eval-form");

  if (!form) return;

  const formData = new FormData(form);
  const satisfactionLevel = formData.get("satisfaction_level");
  const improvementSuggestion = formData.get("improvement_suggestion") || "";
  const additionalComments = formData.get("additional_comments") || "";

  if (!satisfactionLevel) {
    if (statusMsg) {
      statusMsg.className = "p-4 rounded-xl text-xs sm:text-sm font-normal bg-rose-50 text-rose-700 border border-rose-200 block shadow-2xs";
      statusMsg.innerHTML = "กรุณาเลือกระดับความพึงพอใจก่อนกดส่งแบบประเมิน";
    }
    return;
  }

  // Label Map
  const labelMap = {
    "1": "พึงพอใจมาก",
    "2": "พึงพอใจ",
    "3": "ควรปรับปรุง"
  };

  // Disable button while processing
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> กำลังบันทึกข้อมูล...`;
  }

  const payload = {
    category: "evaluations",
    satisfaction_level: parseInt(satisfactionLevel, 10),
    level_label: labelMap[satisfactionLevel] || "พึงพอใจ",
    improvement_suggestion: improvementSuggestion,
    comments: additionalComments,
    created_at: new Date().toISOString()
  };

  try {
    const client = (typeof window !== "undefined" && window.supabase && typeof window.supabase.from === "function") ? window.supabase : (typeof supabase !== "undefined" ? supabase : null);

    if (!client || typeof client.from !== "function") {
      throw new Error("Supabase client is not available");
    }

    // Direct Awaited Insert into 'evaluations' table
    const { data, error } = await client.from("evaluations").insert([payload]);

    if (error) {
      console.error("Supabase evaluations insert error:", error);
      throw error;
    }

    console.log("Evaluations saved successfully to Supabase:", data);

    if (statusMsg) {
      statusMsg.className = "p-4 rounded-xl text-xs sm:text-sm font-normal bg-emerald-50 text-emerald-800 border border-emerald-200/90 block shadow-2xs";
      statusMsg.innerHTML = `
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <i class="fi fi-rr-check text-sm font-bold"></i>
          </div>
          <div>
            <div class="font-medium text-emerald-900">บันทึกแบบประเมินความพึงพอใจสำเร็จแล้ว</div>
            <div class="text-xs text-emerald-700 opacity-90">ขอบพระคุณสำหรับข้อเสนอแนะและเวลาอันมีค่าของท่านครับ</div>
          </div>
        </div>
      `;
    }

    form.reset();
    toggleImprovementField("");

  } catch (err) {
    console.error("Evaluation submission error:", err);
    if (statusMsg) {
      statusMsg.className = "p-4 rounded-xl text-xs sm:text-sm font-normal bg-rose-50 text-rose-700 border border-rose-200 block shadow-2xs";
      statusMsg.innerHTML = `เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${err.message || 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้'}`;
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fi fi-rr-paper-plane text-xs"></i> <span>ส่งแบบประเมิน</span>`;
    }
  }
};
