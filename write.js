const stage = document.getElementById("typewriterStage");
const paperWrap = document.getElementById("paperWrap");
const paper = document.getElementById("paper");
const input = document.getElementById("letterInput");
const typeHead = document.getElementById("typeHead");
const sendBtn = document.getElementById("sendBtn");
const hint = document.getElementById("hint");

const keySound = document.getElementById("keySound");
const returnSound = document.getElementById("returnSound");
const sendSound = document.getElementById("sendSound");

/* 添加图片按钮 */
const addPictureBtn = document.getElementById("addPictureBtn");
const pictureInput = document.getElementById("pictureInput");

/*
  这些数值可以微调：
  headOffsetX：头针相对文字起点的偏移
  charWidth：每输入一个字符，头针往右走多少
  paperMovePerLine：每回车一行，纸张上移多少
*/
const headOffsetX = 40;
const charWidth = 7;
const paperMovePerLine = -36;

let lastLineCount = 1;
let audioContext = null;

/* 页面加载后聚焦输入区 */
window.addEventListener("load", () => {
  if (input) {
    input.focus();
  }

  updatePaperAndHead();
});

/* 点击纸张聚焦 */
if (paper && input) {
  paper.addEventListener("click", () => {
    input.focus();

    if (hint) {
      hint.classList.add("hide");
    }
  });
}

/* 点击舞台也聚焦 */
if (stage && input) {
  stage.addEventListener("click", () => {
    input.focus();

    if (hint) {
      hint.classList.add("hide");
    }
  });
}

/* 播放真实音效；如果没有音频文件，就用 WebAudio 生成一个轻微咔哒声 */
function playTypeSound(isReturn = false) {
  const sound = isReturn ? returnSound : keySound;

  if (sound && sound.querySelector("source")?.getAttribute("src")) {
    sound.currentTime = 0;
    sound.volume = isReturn ? 0.55 : 0.42;

    sound.play().catch(() => {
      playFallbackClick(isReturn);
    });
  } else {
    playFallbackClick(isReturn);
  }
}

function playFallbackClick(isReturn = false) {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "square";
    oscillator.frequency.value = isReturn ? 110 : 190;

    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      isReturn ? 0.08 : 0.045,
      audioContext.currentTime + 0.01
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + 0.055
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.06);
  } catch (error) {
    // 静音失败不影响打字
  }
}

/* 获取当前光标前的行与列 */
function getCaretInfo() {
  if (!input) {
    return {
      line: 0,
      column: 0,
      lineCount: 1
    };
  }

  const valueBeforeCaret = input.value.slice(0, input.selectionStart);
  const lines = valueBeforeCaret.split("\n");

  return {
    line: lines.length - 1,
    column: lines[lines.length - 1].length,
    lineCount: input.value.split("\n").length
  };
}

/* 更新纸张上移和头针位置 */
function updatePaperAndHead() {
  if (!paper || !typeHead || !stage) return;

  const info = getCaretInfo();

  const paperY = info.line * paperMovePerLine;
  paper.style.setProperty("--paper-y", `${paperY}px`);

  updateTypeHead(info.column);
}

/* 更新头针位置：从纸张左侧文字起点开始移动 */
function updateTypeHead(column) {
  if (!stage || !paper || !typeHead) return;

  const stageRect = stage.getBoundingClientRect();
  const paperInner = paper.querySelector(".paper-inner");

  if (!paperInner) return;

  const paperInnerRect = paperInner.getBoundingClientRect();

  const textStartX = paperInnerRect.left - stageRect.left;
  const x = textStartX + column * charWidth + headOffsetX;

  typeHead.style.left = `${x}px`;

  typeHead.classList.remove("hit");
  void typeHead.offsetWidth;
  typeHead.classList.add("hit");
}

/* 每次输入 */
if (input) {
  input.addEventListener("input", () => {
    const currentLineCount = input.value.split("\n").length;
    const isReturn = currentLineCount > lastLineCount;

    lastLineCount = currentLineCount;

    if (hint) {
      hint.classList.add("hide");
    }

    if (paper) {
      paper.classList.remove("shake");
      void paper.offsetWidth;
      paper.classList.add("shake");
    }

    playTypeSound(isReturn);
    updatePaperAndHead();
  });

  /* 方向键、点击改变光标时，也更新头针 */
  input.addEventListener("keyup", () => {
    updatePaperAndHead();
  });

  input.addEventListener("click", () => {
    updatePaperAndHead();
  });

  /* 按键声音：Backspace 等不会触发 input 的特殊键也给声音 */
  input.addEventListener("keydown", (event) => {
    if (hint) {
      hint.classList.add("hide");
    }

    if (event.key === "Tab") {
      event.preventDefault();

      const start = input.selectionStart;
      const end = input.selectionEnd;
      const value = input.value;

      input.value = value.substring(0, start) + "    " + value.substring(end);
      input.selectionStart = input.selectionEnd = start + 4;

      updatePaperAndHead();
      playTypeSound(false);
      return;
    }

    if (event.key === "Backspace") {
      setTimeout(() => {
        lastLineCount = input.value.split("\n").length;
        updatePaperAndHead();
      }, 0);

      playTypeSound(false);
    }

    if (event.key === "Enter") {
      playTypeSound(true);
    }
  });
}

/* 窗口尺寸变化时重新对齐头针 */
window.addEventListener("resize", () => {
  updatePaperAndHead();
});

/* Send */
if (sendBtn) {
  sendBtn.addEventListener("click", () => {
    if (sendSound) {
      sendSound.currentTime = 0;
      sendSound.volume = 0.75;
      sendSound.play().catch(() => {});
    }

    document.querySelector(".typewriter-page").classList.add("sent");

    setTimeout(() => {
      window.location.href = "./1.2single-letter.html";
    }, 1400);
  });
}

/* Add picture：点击圆形按钮打开本地图片选择 */
if (addPictureBtn && pictureInput) {
  addPictureBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    pictureInput.click();
  });

  pictureInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    console.log("你选择了图片：", file.name);
    console.log("图片临时地址：", imageUrl);

    /*
      现在这里只负责打开图片选择窗口。
      下一步如果你想让图片出现在信纸上，
      我们再加一个 image-preview 插入到 paper 里面。
    */
  });
}