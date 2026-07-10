/**
 * Lottie Sidebar Icons
 * เปลี่ยนไอคอนทุกรายการใน sidebar ให้เป็น Lottie file (document.json สีน้ำเงิน)
 */

(function () {
  var BASE = "./assets/icons/";

  var ICONS = {
    document: BASE + "document.json",      // ไอคอนสีน้ำเงินสำหรับทุกเมนู (ของเดิม)
    matra7: BASE + "Upload file icon Animation.json",     // <--- เอาชื่อไฟล์ Lottie ใหม่มาใส่ตรงนี้ครับ!
  };

  /**
   * สร้าง <dotlottie-wc> element ขนาดเล็ก
   */
  function makeLottie(src, size) {
    var el = document.createElement("dotlottie-wc");
    el.setAttribute("src", src);
    el.setAttribute("autoplay", "");
    el.setAttribute("loop", "");
    el.style.cssText =
      "width:" + size + "px;" +
      "height:" + size + "px;" +
      "display:inline-flex;" +
      "flex-shrink:0;" +
      "pointer-events:none;";
    return el;
  }

  /**
   * เปลี่ยนไอคอนทุกรายการด้วย Lottie
   */
  function replaceAllIcons() {
    var replaced = 0;

    // 1. เปลี่ยนไอคอนของหัวข้อหลัก (section headers)
    document.querySelectorAll(".sidebar-group > summary.sidebar-link").forEach(function (summary) {
      var iconEl = summary.querySelector(".sidebar-icon");
      var text = summary.textContent.trim();

      if (iconEl) {
        iconEl.innerHTML = "";
        
        // เช็คว่าเป็น "มาตรา 7", "มาตรา 9" หรือ "ประเมินผลฯ" ให้ใช้ไอคอนตัวพิเศษ (ICONS.matra7)
        if (text.includes("มาตรา 7") || text.includes("มาตรา 9") || text.includes("ประเมินผล") || text.includes("ถาม-ตอบ")) {
          iconEl.appendChild(makeLottie(ICONS.matra7, 45)); // ปรับขนาดไอคอนพิเศษได้ที่นี่
        } else {
          // ถ้าไม่ใช่ ก็ใช้ไอคอนสีน้ำเงินปกติ
          iconEl.appendChild(makeLottie(ICONS.document, 24)); 
        }
        
        replaced++;
      }
    });

    // 2. เปลี่ยนไอคอนของรายการย่อย (leaf items)
    document.querySelectorAll(".sidebar-link[data-id]").forEach(function (link) {
      var iconEl = link.querySelector(".sidebar-icon");
      if (iconEl) {
        iconEl.innerHTML = "";
        iconEl.appendChild(makeLottie(ICONS.document, 28)); // ขนาดปกติ
        replaced++;
      }
    });

    console.log("[lottie-icons] Replaced " + replaced + " sidebar icons with blue Lottie.");
  }

  // รอ componentsLoaded event จาก loader.js
  document.addEventListener("componentsLoaded", function () {
    setTimeout(replaceAllIcons, 100);
  });

  // Fallback บน window load
  window.addEventListener("load", function () {
    setTimeout(replaceAllIcons, 300);
  });
})();
