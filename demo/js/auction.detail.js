// auction-item.js

// 1) Countdown (원본 로직 유지 + data-end 지원)
(function () {
  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function updateCountdown() {
    const timerEl = document.querySelector(".timer");
    const endStr = timerEl ? timerEl.getAttribute("data-end") : null;

    // fallback: 원본 날짜
    const endDate = endStr ? new Date(endStr) : new Date("2024-01-28T15:00:00");
    const now = new Date();
    const diff = endDate - now;

    if (diff <= 0) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const d = document.getElementById("days");
    const h = document.getElementById("hours");
    const m = document.getElementById("minutes");

    if (d) d.textContent = pad2(days);
    if (h) h.textContent = pad2(hours);
    if (m) m.textContent = pad2(minutes);
  }

  window.addEventListener("load", function () {
    updateCountdown();
    setInterval(updateCountdown, 60000);
  });
})();

// 2) 썸네일 클릭 시 메인 이미지 교체 (UX 보너스)
(function () {
  const main = document.getElementById("mainImage");
  const thumbs = document.getElementById("thumbs");
  if (!main || !thumbs) return;

  function setActive(btn) {
    thumbs.querySelectorAll(".thumb").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
  }

  thumbs.addEventListener("click", function (e) {
    const btn = e.target.closest ? e.target.closest(".thumb") : null;
    if (!btn) return;

    const img = btn.querySelector("img");
    if (!img || !img.getAttribute("src")) return;

    main.src = img.src;
    main.alt = img.alt || main.alt;

    setActive(btn);
  });

  // 첫 썸네일을 active로
  const first = thumbs.querySelector(".thumb");
  if (first) first.classList.add("is-active");
})();

// 3) 와이어프레임용: 링크 이동/폼 제출/네비게이션 막기 (원본 유지)
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
