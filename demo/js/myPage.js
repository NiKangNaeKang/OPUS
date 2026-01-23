// mypage.js

// ✅ 와이어프레임에서만 "외부 이동 차단"이 필요하면 true로 바꿔서 사용
const BLOCK_ALL_NAVIGATION = false;

/**
 * 1) 사이드바 클릭 시:
 * - active 스타일 적용
 * - 해당 섹션으로 부드럽게 스크롤
 */
(function sidebarScrollAndActive() {
  window.addEventListener("load", () => {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    const navLinks = sidebar.querySelectorAll('a[href^="#"]');

    function setActive(targetLink) {
      navLinks.forEach((l) => l.classList.remove("is-active"));
      targetLink.classList.add("is-active");
    }

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        // 기본: 해시 점프 방지 후 부드러운 스크롤
        e.preventDefault();

        setActive(link);

        const targetId = link.getAttribute("href").slice(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  });
})();

/**
 * 2) (옵션) 모든 a 이동/폼 제출/프로그램 네비게이션을 막기
 * - ⚠️ 이걸 켜면 위의 사이드바 해시 스크롤도 막힐 수 있어서,
 *   BLOCK_ALL_NAVIGATION=false가 기본값.
 */
(function blockNavigationOptional() {
  if (!BLOCK_ALL_NAVIGATION) return;

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
      const a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
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

  try { window.open = function () { return null; }; } catch (_) {}

  try {
    const noop = function () {};
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
