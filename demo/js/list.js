window.addEventListener("load", () => {
  // ===== header scroll style (index.html과 동일 패턴) =====
  const header = document.getElementById("header");
  const SCROLL_Y = 10;

  const onScroll = () => {
    if (window.scrollY > SCROLL_Y) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ===== genre/status buttons =====
  const genreBtns = document.querySelectorAll(".genre-btn");
  const statusBtns = document.querySelectorAll(".status-btn");

  const exhibitionContent = document.getElementById("exhibition-content");
  const musicalContent = document.getElementById("musical-content");
  const loadingIndicator = document.getElementById("loading-indicator");

  let currentGenre = "exhibition";
  let currentStatus = "all";
  let isLoading = false;

  const setActive = (buttons, target) => {
    buttons.forEach((b) => b.classList.remove("is-active"));
    target.classList.add("is-active");
  };

  genreBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      setActive(genreBtns, btn);
      currentGenre = btn.getAttribute("data-genre");

      if (currentGenre === "exhibition") {
        exhibitionContent.classList.remove("is-hidden");
        musicalContent.classList.add("is-hidden");
      } else {
        exhibitionContent.classList.add("is-hidden");
        musicalContent.classList.remove("is-hidden");
      }
    });
  });

  statusBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      setActive(statusBtns, btn);
      currentStatus = btn.getAttribute("data-status");
      // 여기서 currentStatus에 맞춰 필터링 로직 붙이면 됨
      // (지금은 UI만 전환)
    });
  });

  // ===== infinite loading mock =====
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 500;

      if (nearBottom && !isLoading) {
        isLoading = true;
        loadingIndicator.classList.remove("is-hidden");

        setTimeout(() => {
          loadingIndicator.classList.add("is-hidden");
          isLoading = false;
        }, 1500);
      }
    }, 100);
  });
});
