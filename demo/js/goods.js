(() => {
  // ====== UI State ======
  let currentKind = "musical";   // musical | exhibition
  let currentCat = "all";        // all | clothes | accessory | stationery | poster | dvd | etc

  const kindBtns = document.querySelectorAll("[data-toggle]");
  const chipBtns = document.querySelectorAll("[data-chip]");
  const categorySelect = document.getElementById("categorySelect");
  const goodsItemsWrap = document.getElementById("goodsItems");
  const totalCountEl = document.getElementById("totalCount");
  const moreBtn = document.getElementById("moreBtn");

  function setActive(elList, activeEl, activeClass = "is-active") {
    elList.forEach((el) => el.classList.remove(activeClass));
    if (activeEl) activeEl.classList.add(activeClass);
  }

  function filterItems() {
    const cards = goodsItemsWrap.querySelectorAll(".card");
    let visibleCount = 0;
    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";

    cards.forEach((card) => {
      const kind = card.getAttribute("data-kind");
      const cat = card.getAttribute("data-cat");
      const title = card.querySelector(".card__title")?.textContent.toLowerCase() || "";

      const matchKind = kind === currentKind;
      const matchCat = (currentCat === "all") ? true : (cat === currentCat);
      const matchSearch = keyword === "" || title.includes(keyword);

      const show = matchKind && matchCat && matchSearch;
      card.style.display = show ? "" : "none";
      if (show) visibleCount += 1;
    });

    totalCountEl.textContent = String(visibleCount);
  }

  // ====== Kind Toggle (뮤지컬/미술전시) ======
  kindBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentKind = btn.getAttribute("data-toggle") || "musical";
      setActive(kindBtns, btn);
      kindBtns.forEach((b) => b.setAttribute("aria-selected", b === btn ? "true" : "false"));
      filterItems();
    });
  });

  // ====== Chips ======
  chipBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentCat = btn.getAttribute("data-chip") || "all";
      setActive(chipBtns, btn);
      if (categorySelect) categorySelect.value = currentCat;
      filterItems();
    });
  });

  // ====== Select Category ======
  if (categorySelect) {
    categorySelect.addEventListener("change", () => {
      currentCat = categorySelect.value;
      // 칩 active도 동기화
      const activeChip = [...chipBtns].find((b) => b.getAttribute("data-chip") === currentCat);
      if (activeChip) setActive(chipBtns, activeChip);
      else chipBtns.forEach((b) => b.classList.remove("is-active"));
      filterItems();
    });
  }

    if (searchBtn) {
    searchBtn.addEventListener("click", filterItems);
  }

  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") filterItems();
    });
  }


  // ====== Wish 버튼(하트) 토글 (데모) ======
  document.addEventListener("click", (e) => {
    const wishBtn = e.target.closest && e.target.closest(".wish");
    if (!wishBtn) return;

    e.preventDefault();
    e.stopPropagation();

    const icon = wishBtn.querySelector("i");
    if (!icon) return;

    const isOn = icon.classList.contains("fa-solid");
    icon.classList.toggle("fa-solid", !isOn);
    icon.classList.toggle("fa-regular", isOn);
  });

  // ====== More Button (데모) ======
  if (moreBtn) {
    moreBtn.addEventListener("click", () => {
      alert("더보기 기능 연결 필요 (API/페이지네이션)");
    });
  }

  // 초기 필터 적용
  filterItems();

  // ====== (iframe에 있던) 데모용 네비게이션 차단 스크립트 ======
  // 실제 서비스 연결할 땐 삭제해도 됨.
  (function blockNavigationDemoOnly() {
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
      window.open = function () { return null; };
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
})();
