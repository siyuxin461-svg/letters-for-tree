const words = document.querySelectorAll(".float-word");
const preview = document.getElementById("preview");
const previewImage = document.getElementById("previewImage");
const intro = document.getElementById("intro");

const defaultIntro = [
  "给一棵树写信，",
  "记录一次停留，一片树影，一段没有说出口的记忆。",
  "让故事被看见，也让行动慢慢发生。"
];

function renderIntroPlain(lines) {
  if (!intro) return;
  intro.innerHTML = lines.map((line) => `<p>${line}</p>`).join("");
}

function renderIntroByChars(lines) {
  if (!intro) return;

  let charIndex = 0;

  intro.innerHTML = lines
    .map((line) => {
      const chars = [...line]
        .map((char) => {
          charIndex++;

          if (char === " ") {
            return `<span class="char space" style="--i:${charIndex}">&nbsp;</span>`;
          }

          return `<span class="char" style="--i:${charIndex}">${char}</span>`;
        })
        .join("");

      return `<p>${chars}</p>`;
    })
    .join("");
}

function changeIntroWithCharEffect(lines) {
  if (!intro) return;

  intro.classList.add("fade-out");

  setTimeout(() => {
    intro.classList.remove("fade-out");
    renderIntroByChars(lines);
  }, 220);
}

function resetIntroPlain() {
  if (!intro) return;

  intro.classList.add("fade-out");

  setTimeout(() => {
    intro.classList.remove("fade-out");
    renderIntroPlain(defaultIntro);
  }, 220);
}

// 页面初始状态：底部文字固定显示，不加动画
renderIntroPlain(defaultIntro);

words.forEach((word) => {
  word.addEventListener("mouseenter", () => {
    const imageUrl = word.dataset.image;
    const introText = word.dataset.intro;

    if (preview && previewImage && imageUrl) {
      preview.classList.add("show");
      previewImage.style.backgroundImage = `url(${imageUrl})`;
    }

    if (introText) {
      const lines = introText.split("|");
      changeIntroWithCharEffect(lines);
    }
  });

  word.addEventListener("mouseleave", () => {
    if (preview && previewImage) {
      preview.classList.remove("show");

      setTimeout(() => {
        if (!preview.classList.contains("show")) {
          previewImage.style.backgroundImage = "";
        }
      }, 300);
    }

    resetIntroPlain();
  });
});
