(function () {
  // ===== Helpers =====
  function formatKRW(n) {
    // n: number
    const s = Math.max(0, Math.floor(n)).toString();
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원";
  }

  // ===== Image thumbs -> main image =====
  const mainImage = document.getElementById("mainImage");
  const thumbGrid = document.getElementById("thumbGrid");

  if (mainImage && thumbGrid) {
    thumbGrid.addEventListener("click", (e) => {
      const btn = e.target.closest(".thumb");
      if (!btn) return;

      const src = btn.getAttribute("data-src");
      if (src) mainImage.src = src;

      thumbGrid.querySelectorAll(".thumb").forEach((t) => t.classList.remove("is-active"));
      btn.classList.add("is-active");
    });
  }

  // ===== Quantity & total price =====
  const unitPrice = 69000; // 판매가 기준 (원본: 69,000원)
  const qtyInput = document.getElementById("qtyInput");
  const minusBtn = document.getElementById("qtyMinus");
  const plusBtn = document.getElementById("qtyPlus");
  const totalPriceText = document.getElementById("totalPriceText");
  const unitPriceText = document.getElementById("unitPriceText");

  function clampQty(v) {
    const n = Number(v);
    if (!Number.isFinite(n)) return 1;
    return Math.max(1, Math.floor(n));
  }

  function renderTotal() {
    const qty = clampQty(qtyInput ? qtyInput.value : 1);
    if (qtyInput) qtyInput.value = String(qty);

    if (unitPriceText) unitPriceText.textContent = formatKRW(unitPrice);
    if (totalPriceText) totalPriceText.textContent = formatKRW(unitPrice * qty);
  }

  if (qtyInput) {
    qtyInput.addEventListener("input", renderTotal);
    qtyInput.addEventListener("change", renderTotal);
  }
  if (minusBtn && qtyInput) {
    minusBtn.addEventListener("click", () => {
      qtyInput.value = String(clampQty(qtyInput.value) - 1);
      renderTotal();
    });
  }
  if (plusBtn && qtyInput) {
    plusBtn.addEventListener("click", () => {
      qtyInput.value = String(clampQty(qtyInput.value) + 1);
      renderTotal();
    });
  }
  renderTotal();

  // ===== Tabs =====
  const tabButtons = document.querySelectorAll(".tab[data-tab]");
  const panels = {
    detail: document.getElementById("tab-detail"),
    review: document.getElementById("tab-review"),
    shipping: document.getElementById("tab-shipping"),
  };

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-tab");

      tabButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      Object.values(panels).forEach((p) => p && p.classList.remove("is-active"));
      if (panels[key]) panels[key].classList.add("is-active");
    });
  });

  // ===== (원본) 링크/폼 이동 막기 스크립트 그대로 유지 =====
  (function () {
    function blockEvent(e) {
      if (!e) return false;
      if (typeof e.preventDefault === "function") e.preventDefault();
      if (typeof e.stopPropagation === "function") e.stopPropagation();
      if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
      return false;
    }

    document.addEventListener(
      "click",
      function (e) {
        var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
        if (!a) return;
        return blockEvent(e);
      },
      true
    );

    document.addEventListener(
      "submit",
      function (e) {
        return blockEvent(e);
      },
      true
    );

    try {
      window.open = function () {
        return null;
      };
    } catch (_) {}

    try {
      var noop = function () {};
      history.pushState = noop;
      history.replaceState = noop;
    } catch (_) {}

    try {
      if (window.location) {
        window.location.assign = function () {};
        window.location.replace = function () {};
      }
    } catch (_) {}
  })();
})();
