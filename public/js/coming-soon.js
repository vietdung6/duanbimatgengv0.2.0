const leaksData = [
  { title: "Tính năng 1", desc: "Mô tả ngắn", img: "/images/anh1.jpg" },
  { title: "Tính năng 2", desc: "Mô tả ngắn", img: "/images/anh2.jpg" },
  { title: "Tính năng 3", desc: "Mô tả ngắn", img: "/images/anh3.jpg" },
  { title: "Tính năng 4", desc: "Mô tả ngắn", img: "/images/anh4.jpg" },
  { title: "Tính năng 5", desc: "Mô tả ngắn", img: "/images/anh5.jpg" },
  { title: "Tính năng 6", desc: "Mô tả ngắn", img: "/images/anh6.jpg" },
  { title: "Tính năng 7", desc: "Mô tả ngắn", img: "/images/anh7.jpg" },
  { title: "Tính năng 8", desc: "Mô tả ngắn", img: "/images/anh8.jpg" },
];

function renderLeaks() {
  const container = document.getElementById("leaks-container");
  if (!container) return;
  container.innerHTML = leaksData
    .map(
      (item) => `
        <div class="cs-card">
          <a href="${item.img}" target="_blank" rel="noopener">
            <img src="${item.img}" alt="${item.title}" onerror="this.style.display='none';">
          </a>
          <div class="cs-card-body">
            <div class="cs-card-title">${item.title}</div>
            <div class="cs-card-desc">${item.desc}</div>
          </div>
        </div>
      `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", renderLeaks);
