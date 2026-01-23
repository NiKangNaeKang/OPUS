(function () {
  function blockEvent(e) {
    if (!e) return false;
    if (typeof e.preventDefault === "function") e.preventDefault();
    if (typeof e.stopPropagation === "function") e.stopPropagation();
    if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
    return false;
  }

  // 링크/폼 동작 막기(와이어프레임용)
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
    window.open = function () { return null; };
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

  // ===== 작품소개 "더보기" 토글 =====
  var desc = document.getElementById("descText");
  var toggle = document.getElementById("descToggle");

  if (desc && toggle) {
    // 처음엔 접힌 상태로 시작(원하면 제거 가능)
    desc.classList.add("is-collapsed");

    toggle.addEventListener("click", function () {
      var isCollapsed = desc.classList.contains("is-collapsed");
      if (isCollapsed) {
        desc.classList.remove("is-collapsed");
        toggle.querySelector("span").textContent = "접기";
        var icon = toggle.querySelector("i");
        if (icon) icon.classList.remove("fa-chevron-down");
        if (icon) icon.classList.add("fa-chevron-up");
      } else {
        desc.classList.add("is-collapsed");
        toggle.querySelector("span").textContent = "더보기";
        var icon2 = toggle.querySelector("i");
        if (icon2) icon2.classList.remove("fa-chevron-up");
        if (icon2) icon2.classList.add("fa-chevron-down");
      }
    });
  }
})();
