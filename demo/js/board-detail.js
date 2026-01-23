(() => {
  // 1) Back to List 버튼: 히스토리 뒤로가기(없으면 임시로 alert)
  const backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (history.length > 1) history.back();
      else alert("목록 페이지로 이동 (연결 필요)");
    });
  }

  // 2) (iframe에 있던) 데모용: 링크 클릭/submit 막기 스크립트
  // 실제 서비스에선 제거하면 됨.
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

  try {
    window.open = function () {
      return null;
    };
  } catch (_) {}

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
