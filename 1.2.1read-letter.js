const letterAudioBtn = document.getElementById("letterAudioBtn");
const letterRainSound = document.getElementById("letterRainSound");

let isLetterRainPlaying = false;

if (letterAudioBtn && letterRainSound) {
  letterAudioBtn.addEventListener("click", () => {
    const status = letterAudioBtn.querySelector(".audio-status");

    if (!isLetterRainPlaying) {
      letterRainSound.currentTime = 0;
      letterRainSound.volume = 0.42;
      letterRainSound.play().catch(() => {});

      isLetterRainPlaying = true;
      letterAudioBtn.classList.add("is-playing");

      if (status) {
        status.textContent = "playing";
      }
    } else {
      letterRainSound.pause();

      isLetterRainPlaying = false;
      letterAudioBtn.classList.remove("is-playing");

      if (status) {
        status.textContent = "click to listen";
      }
    }
  });

  letterRainSound.addEventListener("ended", () => {
    const status = letterAudioBtn.querySelector(".audio-status");

    isLetterRainPlaying = false;
    letterAudioBtn.classList.remove("is-playing");

    if (status) {
      status.textContent = "click to listen";
    }
  });
}