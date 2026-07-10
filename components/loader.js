(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const slots = document.querySelectorAll("[data-component]");
    const promises = Array.from(slots).map(function (slot) {
      const src = slot.getAttribute("data-component");
      if (!src) return Promise.resolve();

      return fetch(src)
        .then(function (res) {
          if (!res.ok) throw new Error("Failed to load component: " + src);
          return res.text();
        })
        .then(function (html) {
          slot.innerHTML = html;
        })
        .catch(function (err) {
          console.error(err);
        });
    });

    Promise.all(promises).then(function () {
      document.dispatchEvent(new CustomEvent("componentsLoaded"));
    });
  });
})();
