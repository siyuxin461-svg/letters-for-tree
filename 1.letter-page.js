const envelopes = document.querySelectorAll(".envelope-card");
const paperHoverSound = document.getElementById("paperHoverSound");

let paperSoundTimer = null;
let isPaperSoundPlaying = false;

function stopPaperSound() {
  if (!paperHoverSound) return;

  paperHoverSound.pause();
  paperHoverSound.currentTime = 0;

  isPaperSoundPlaying = false;

  if (paperSoundTimer) {
    clearTimeout(paperSoundTimer);
    paperSoundTimer = null;
  }
}

envelopes.forEach((envelope) => {
  envelope.addEventListener("mouseenter", () => {
    envelope.classList.add("is-hover");

    if (!paperHoverSound) return;

    // 同一次 hover 中不重复触发
    if (isPaperSoundPlaying) return;

    isPaperSoundPlaying = true;

    paperHoverSound.pause();
    paperHoverSound.currentTime = 0;
    paperHoverSound.volume = 0.34;
    paperHoverSound.play().catch(() => {});

    // 只播放 1 秒
    paperSoundTimer = setTimeout(() => {
      stopPaperSound();
    }, 300);
  });

  envelope.addEventListener("mouseleave", () => {
    envelope.classList.remove("is-hover");

    // 鼠标离开时立刻停止
    stopPaperSound();
  });
});