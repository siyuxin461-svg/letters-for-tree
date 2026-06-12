const cards = Array.from(document.querySelectorAll(".postcard-card"));
const pageDots = document.getElementById("pageDots");
const cardStage = document.getElementById("cardStage");

let activeIndex = 0;
let wheelLock = false;

let pointerStartX = 0;
let pointerStartY = 0;
let pointerEndX = 0;
let pointerEndY = 0;
let isPointerDown = false;

/* 生成底部圆点 */
if (pageDots) {
  cards.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `第 ${index + 1} 张`);

    dot.addEventListener("click", () => {
      activeIndex = index;
      updateCards();
    });

    pageDots.appendChild(dot);
  });
}

const dots = pageDots ? Array.from(pageDots.querySelectorAll("button")) : [];

function normalizeOffset(offset, total) {
  if (offset > total / 2) return offset - total;
  if (offset < -total / 2) return offset + total;
  return offset;
}

function updateCards() {
  cards.forEach((card, index) => {
    card.className = "postcard-card";

    let offset = index - activeIndex;
    offset = normalizeOffset(offset, cards.length);

    if (offset === 0) {
      card.classList.add("active");
    } else if (offset === -1) {
      card.classList.add("prev");
    } else if (offset === 1) {
      card.classList.add("next");
    } else if (offset === -2) {
      card.classList.add("far-prev");
    } else if (offset === 2) {
      card.classList.add("far-next");
    } else if (offset < 0) {
      card.classList.add("hidden-left");
    } else {
      card.classList.add("hidden-right");
    }

    const contentInner = card.querySelector(".content-inner");

    if (contentInner) {
      contentInner.style.transition = "transform 0.45s ease";
      contentInner.style.transform = "translateY(0)";
    }
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === activeIndex);
  });

  bindHoverTextScroll();
}

function goNext() {
  activeIndex = (activeIndex + 1) % cards.length;
  updateCards();
}

function goPrev() {
  activeIndex = (activeIndex - 1 + cards.length) % cards.length;
  updateCards();
}

/* 点击旁边卡片切换 */
cards.forEach((card, index) => {
  card.addEventListener("click", () => {
    if (index === activeIndex) return;

    activeIndex = index;
    updateCards();
  });
});

/* 键盘左右键 */
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    goNext();
  }

  if (event.key === "ArrowLeft") {
    goPrev();
  }
});

/* 鼠标滚轮 / 触控板滑动 */
if (cardStage) {
  cardStage.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();

      if (wheelLock) return;
      wheelLock = true;

      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);

      if (absX > absY) {
        if (event.deltaX > 0) {
          goNext();
        } else {
          goPrev();
        }
      } else {
        if (event.deltaY > 0) {
          goNext();
        } else {
          goPrev();
        }
      }

      setTimeout(() => {
        wheelLock = false;
      }, 520);
    },
    { passive: false }
  );
}

/* 鼠标拖拽 / 触屏拖拽 */
if (cardStage) {
  cardStage.addEventListener("pointerdown", (event) => {
    isPointerDown = true;

    pointerStartX = event.clientX;
    pointerStartY = event.clientY;
    pointerEndX = event.clientX;
    pointerEndY = event.clientY;

    cardStage.setPointerCapture(event.pointerId);
  });

  cardStage.addEventListener("pointermove", (event) => {
    if (!isPointerDown) return;

    pointerEndX = event.clientX;
    pointerEndY = event.clientY;
  });

  cardStage.addEventListener("pointerup", (event) => {
    if (!isPointerDown) return;

    isPointerDown = false;

    const diffX = pointerEndX - pointerStartX;
    const diffY = pointerEndY - pointerStartY;

    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);

    if (absX > 60 && absX > absY) {
      if (diffX < 0) {
        goNext();
      } else {
        goPrev();
      }
    } else if (absY > 60 && absY > absX) {
      if (diffY < 0) {
        goNext();
      } else {
        goPrev();
      }
    }

    try {
      cardStage.releasePointerCapture(event.pointerId);
    } catch (error) {}
  });

  cardStage.addEventListener("pointercancel", () => {
    isPointerDown = false;
  });
}

/* hover 当前卡片时，文字向上滑动阅读 */
function bindHoverTextScroll() {
  cards.forEach((card) => {
    const mask = card.querySelector(".content-mask");
    const inner = card.querySelector(".content-inner");

    if (!mask || !inner) return;

    card.onmouseenter = null;
    card.onmouseleave = null;

    card.onmouseenter = () => {
      if (!card.classList.contains("active")) return;

      const maxScroll = inner.scrollHeight - mask.clientHeight;

      if (maxScroll > 0) {
        inner.style.transition = "transform 10s linear";
        inner.style.transform = `translateY(-${maxScroll}px)`;
      }
    };

    card.onmouseleave = () => {
      inner.style.transition = "transform 0.6s ease";
      inner.style.transform = "translateY(0)";
    };
  });
}

/* 同感按钮交互：点击后保持在 hover 闪烁最深色 */
/* 同感按钮交互：点击后固定为 hover 最深色 */
document.querySelectorAll(".empathy-btn").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const countEl = btn.querySelector("span");
    if (!countEl) return;

    if (btn.classList.contains("is-liked")) return;

    const count = parseInt(countEl.textContent, 10) || 0;

    btn.classList.add("is-liked");
    countEl.textContent = count + 1;

    /* 关键：用 important 内联样式，强制变成最深色 */
    btn.style.setProperty("opacity", "1", "important");
    btn.style.setProperty("background", "rgba(238, 213, 143, 0.92)", "important");
    btn.style.setProperty("color", "rgba(120, 92, 34, 1)", "important");
    btn.style.setProperty("animation", "none", "important");
    btn.style.setProperty("transform", "none", "important");
    btn.style.setProperty(
      "box-shadow",
      "inset 0 1px 1px rgba(255, 255, 255, 0.78), 0 0 18px rgba(219, 190, 104, 0.36), 0 8px 18px rgba(165, 136, 69, 0.16)",
      "important"
    );
  });
});

updateCards();