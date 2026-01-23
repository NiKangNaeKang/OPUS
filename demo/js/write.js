// post-new.js
(function () {
  // ✅ 토글(스위치) 상태에 따른 클래스 조작 (원본 기능 유지)
  window.addEventListener("load", function () {
    const toggles = document.querySelectorAll('input[type="checkbox"]');

    toggles.forEach((toggle) => {
      toggle.addEventListener("change", function () {
        // (기존 tailwind 방식에선 nextElementSibling로 class 토글했는데)
        // 지금은 CSS에서 :checked로 처리하므로 여기서 굳이 조작할 필요는 없음.
        // 그래도 "원래 있던 JS"를 유지하고 싶다면 최소한의 형태로 둠.
      });
    });
  });

  // ✅ (원본) 링크/폼 이동 막기 스크립트 그대로 유지
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
