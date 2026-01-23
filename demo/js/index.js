window.addEventListener("load", () => {
  let currentTime = 3;
  const maxTime = 10;

  const currentEl = document.getElementById("current-time");
  const prevBtn = document.getElementById("prev-slide");
  const nextBtn = document.getElementById("next-slide");

  function render() {
    if (!currentEl) return;
    currentEl.textContent = String(currentTime);
  }

  // 원본처럼 1초마다 숫자만 증가(슬라이드 UI 흉내)
  const timer = setInterval(() => {
    currentTime++;
    if (currentTime > maxTime) currentTime = 1;
    render();
  }, 1000);

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentTime = currentTime > 1 ? currentTime - 1 : maxTime;
      render();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentTime = currentTime < maxTime ? currentTime + 1 : 1;
      render();
    });
  }

  render();
});

window.addEventListener("load", () => {
  const header = document.getElementById("header");
  const hero = document.getElementById("hero-banner");

  function handleHeaderStyle() {
    const threshold = hero ? hero.offsetHeight - 80 : 120; // 대충 배너 끝 근처
    const y = window.scrollY || window.pageYOffset;

    if (y > 20) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }

  window.addEventListener("scroll", handleHeaderStyle, { passive: true });
  handleHeaderStyle(); // 초기 1회
});
