const searchInput = document.getElementById("citySearch");
const cityCards = document.querySelectorAll(".city-card");

/* 搜索城市 */
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.trim().toLowerCase();

    cityCards.forEach((card) => {
      const cityName = card.dataset.city.toLowerCase();

      if (!keyword || cityName.includes(keyword)) {
        card.classList.remove("is-hidden");
      } else {
        card.classList.add("is-hidden");
      }
    });
  });
}

/* 点击搜索框时，让页面有一点轻微聚焦感 */
if (searchInput) {
  searchInput.addEventListener("focus", () => {
    document.body.classList.add("is-searching");
  });

  searchInput.addEventListener("blur", () => {
    document.body.classList.remove("is-searching");
  });
}