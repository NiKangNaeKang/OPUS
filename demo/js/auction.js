// auction.js

// 와이어프레임/목업용: 링크 이동, 폼 제출, window.open, history 조작 막기
(function () {
  function blockEvent(e) {
    if (!e) return false;
    if (typeof e.preventDefault === "function") e.preventDefault();
    if (typeof e.stopPropagation === "function") e.stopPropagation();
    if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
    return false;
  }

  // a[href] 클릭 막기
  document.addEventListener(
    "click",
    function (e) {
      var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (!a) return;
      return blockEvent(e);
    },
    true
  );

  // form submit 막기
  document.addEventListener(
    "submit",
    function (e) {
      return blockEvent(e);
    },
    true
  );

  // programmatic navigation 막기
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
