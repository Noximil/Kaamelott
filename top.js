const GET_URL = "https://script.google.com/macros/s/AKfycby67hep7a1FB8DGrJ1_cOkPm8QzvMTEM5STVxzrvoq_7odGE4cbDQQSpI70RQS9octd/exec";

function getTopLiked(period) {
  fetch(GET_URL)
    .then(res => res.json())
    .then(data => {
      const now = new Date();
      const days = { day: 1, week: 7, month: 30, year: 365 }[period];
      const filtered = data.filter(q => {
        if (!q.timestamp) return false;
        const ts = new Date(q.timestamp);
        return (now - ts) / (1000 * 60 * 60 * 24) <= days;
      });

      const top3 = filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 3);
      renderTop(top3);
    });
}

function renderTop(list) {
  const container = document.getElementById("top-results");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>Aucune citation populaire pour cette période.</p>";
    return;
  }

  list.forEach(c => {
    const el = document.createElement("div");
    el.className = "quote-box";
    el.innerHTML = `
      <p>“${c.quote}”</p>
      <p><em>${c.character}</em> — ${c.actor}</p>
      <p>${c.season} – ${c.title} (épisode ${c.episode})</p>
      <p>❤️ ${c.likes || 0} likes</p>
    `;
    container.appendChild(el);
  });
}

document.getElementById("top-day").addEventListener("click", () => getTopLiked("day"));
document.getElementById("top-week").addEventListener("click", () => getTopLiked("week"));
document.getElementById("top-month").addEventListener("click", () => getTopLiked("month"));
document.getElementById("top-year").addEventListener("click", () => getTopLiked("year"));
