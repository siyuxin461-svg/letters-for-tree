const scrollWindow = document.querySelector(".scroll-window");
const scrollTrack = document.getElementById("scrollTrack");

let isPaused = false;
let userIsScrolling = false;
let userScrollTimer = null;

// 克隆一遍内容，让滚动更长、更连续
const originalItems = Array.from(document.querySelectorAll(".letter-item"));

originalItems.forEach((item) => {
  const clone = item.cloneNode(true);
  scrollTrack.appendChild(clone);
});

// hover 到任意 item 时暂停自动滚动
function bindHoverPause() {
  const allItems = document.querySelectorAll(".letter-item");

  allItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      isPaused = true;
      scrollTrack.classList.add("is-paused");
    });

    item.addEventListener("mouseleave", () => {
      isPaused = false;
      scrollTrack.classList.remove("is-paused");
    });
  });
}

bindHoverPause();

// 用户自己用滚轮时，短暂停止自动滚动
scrollWindow.addEventListener("wheel", () => {
  userIsScrolling = true;

  clearTimeout(userScrollTimer);

  userScrollTimer = setTimeout(() => {
    userIsScrolling = false;
  }, 900);
});

// JS 自动滚动
function autoScroll() {
  if (!isPaused && !userIsScrolling) {
    scrollWindow.scrollTop += 0.45;
  }

  // 滚到底后回到顶部，形成循环感
  if (scrollWindow.scrollTop >= scrollTrack.scrollHeight / 2) {
    scrollWindow.scrollTop = 0;
  }

  requestAnimationFrame(autoScroll);
}

autoScroll();