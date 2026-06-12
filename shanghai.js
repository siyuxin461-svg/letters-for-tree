const stampItems = document.querySelectorAll(".stamp-item");
const stampDescription = document.getElementById("stampDescription");
const descText = document.getElementById("descText");

stampItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    const title = item.dataset.title;
    const desc = item.dataset.desc;

    if (!stampDescription || !descText) return;

    stampDescription.classList.add("is-active");

    descText.innerHTML = `
      <strong>${title}</strong><br />
      ${desc}
    `;
  });

  item.addEventListener("mouseleave", () => {
    if (!stampDescription || !descText) return;

    stampDescription.classList.remove("is-active");

    setTimeout(() => {
      if (!stampDescription.classList.contains("is-active")) {
        descText.innerHTML = "";
      }
    }, 380);
  });
});