const echoOrbs = document.querySelectorAll(".echo-orb");

echoOrbs.forEach((orb) => {
  const title = orb.dataset.title;
  const letters = orb.dataset.letters;
  const comments = orb.dataset.comments;
  const feels = orb.dataset.feels;
  const desc = orb.dataset.desc;

  const info = orb.querySelector(".echo-info");

  if (!info) return;

  info.querySelector(".letters").textContent = letters;
  info.querySelector(".comments").textContent = comments;
  info.querySelector("h2").textContent = title;
  info.querySelector(".feels").textContent = feels;
  info.querySelector(".desc").textContent = desc;
});

/* 背景轻微视差 */
const page = document.querySelector(".echo-page");
const bg = document.querySelector(".echo-bg");
const mist = document.querySelector(".echo-mist");

if (page && bg && mist) {
  page.addEventListener("mousemove", (event) => {
    const rect = page.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    bg.style.transform = `translate(${x * -10}px, ${y * -10}px) scale(1.04)`;
    mist.style.transform = `translate(${x * 16}px, ${y * 16}px)`;
  });

  page.addEventListener("mouseleave", () => {
    bg.style.transform = "translate(0, 0) scale(1)";
    mist.style.transform = "translate(0, 0)";
  });
}

/* Select 按钮：点击后发光，并随机高亮一个光点 */
const selectBtn = document.getElementById("selectBtn");

if (selectBtn) {
  selectBtn.addEventListener("click", () => {
    selectBtn.classList.add("is-glowing");

    setTimeout(() => {
      selectBtn.classList.remove("is-glowing");
    }, 900);

    const list = Array.from(echoOrbs);
    const randomOrb = list[Math.floor(Math.random() * list.length)];

    echoOrbs.forEach((orb) => {
      orb.classList.remove("is-selected");
    });

    randomOrb.classList.add("is-selected");

    setTimeout(() => {
      randomOrb.classList.remove("is-selected");
    }, 1100);
  });
}

/* 按 Tab 聚焦 Select 时，也有发光感 */
if (selectBtn) {
  selectBtn.addEventListener("focus", () => {
    selectBtn.classList.add("is-glowing");
  });

  selectBtn.addEventListener("blur", () => {
    selectBtn.classList.remove("is-glowing");
  });
}

const echoBgSound = document.getElementById("echoBgSound");
const orbHoverSound = document.getElementById("orbHoverSound");

let bgStarted = false;

/* 第一次点击页面后启动背景音 */
function startEchoBgSound() {
  if (bgStarted) return;
  bgStarted = true;

  if (echoBgSound) {
    echoBgSound.currentTime = 0;
    echoBgSound.volume = 0.36;
    echoBgSound.play().catch(() => {});
  }
}

document.addEventListener("click", startEchoBgSound, { once: true });

/* hover 光点时播放梦幻音效 */
/* hover 光点时播放不同音高，像弹钢琴 */
const hoverSoundSrc =
  "https://raw.githubusercontent.com/siyuxin461-svg/letter-for-tree-images./b4a40cb1ec5876c00b536d4f664b05b6c19992f7/echo-orb-hover.wav";

/* 给每个光点分配不同音高 */
const orbPitchMap = {
  "orb-01": 0.78,
  "orb-02": 1.18,
  "orb-03": 1.34,
  "orb-04": 0.92,
  "orb-05": 1.48,
  "orb-06": 0.72,
  "orb-07": 1.6,
  "orb-08": 1.05,
  "orb-09": 0.86
};

echoOrbs.forEach((orb) => {
  orb.addEventListener("mouseenter", () => {
    const hoverAudio = new Audio(hoverSoundSrc);

    hoverAudio.volume = 0.18;

    let pitch = 1;

    Object.keys(orbPitchMap).forEach((className) => {
      if (orb.classList.contains(className)) {
        pitch = orbPitchMap[className];
      }
    });

    hoverAudio.playbackRate = pitch;

    /* 关键：让 playbackRate 真的改变音高 */
    hoverAudio.preservesPitch = false;
    hoverAudio.mozPreservesPitch = false;
    hoverAudio.webkitPreservesPitch = false;

    hoverAudio.play().catch(() => {});
  });
});