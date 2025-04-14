const textEl = document.getElementById("text");
const actorEl = document.getElementById("actor");
const authorEl = document.getElementById("author");
const infoEl = document.getElementById("extra-info");
const newQuoteBtn = document.getElementById("new-quote");
const prevQuoteBtn = document.getElementById("prev-quote");
const copyQuoteBtn = document.getElementById("copy-quote");
const searchInput = document.getElementById("search");
const modal = document.getElementById("formModal");
const openBtn = document.getElementById("open-form-btn");
const closeBtn = document.querySelector(".modal .close");

let quotes = [];
let filteredQuotes = [];
let history = [];
let currentIndex = -1;

async function fetchQuotes() {
  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbxGIGh0PkfGSbXVbdzLxZWmQlAPuOLYBXDvHaMiCgFFFGZvgYKPLLINDUNCQYULnSaxOA/exec");
    quotes = await response.json();
    filteredQuotes = [...quotes];
    showNewQuote();
  } catch (error) {
    textEl.textContent = "Erreur de chargement depuis Google Sheets.";
    console.error(error);
  }
}

function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

function showQuote(quote) {
  textEl.textContent = `“${quote.quote}”`;
  actorEl.textContent = `— ${quote.character}`;
  authorEl.textContent = `Acteur : ${quote.actor}`;
  infoEl.textContent = `${quote.season} – ${quote.title} (épisode ${quote.episode})`;
}

function showNewQuote() {
  if (filteredQuotes.length === 0) {
    textEl.textContent = "Aucune citation ne correspond à votre recherche.";
    actorEl.textContent = "";
    authorEl.textContent = "";
    infoEl.textContent = "";
    return;
  }

  const quote = filteredQuotes[getRandomIndex(filteredQuotes)];
  showQuote(quote);
  history.push(quote);
  currentIndex = history.length - 1;
}

function showPreviousQuote() {
  if (currentIndex > 0) {
    currentIndex--;
    showQuote(history[currentIndex]);
  }
}

function filterQuotes(keyword) {
  const lower = keyword.toLowerCase();
  filteredQuotes = quotes.filter(q =>
    q.quote?.toLowerCase().includes(lower) ||
    q.actor?.toLowerCase().includes(lower) ||
    q.character?.toLowerCase().includes(lower) ||
    q.author?.toLowerCase().includes(lower) ||
    q.season?.toLowerCase().includes(lower) ||
    q.title?.toLowerCase().includes(lower)
  );
  history = [];
  currentIndex = -1;
  showNewQuote();
}

function copyQuote() {
  const quoteText = `${textEl.textContent} ${actorEl.textContent} (${infoEl.textContent})`;
  navigator.clipboard.writeText(quoteText).then(() => {
    copyQuoteBtn.textContent = "Copié !";
    setTimeout(() => copyQuoteBtn.textContent = "Copier la citation", 2000);
  });
}


// Gestion de la soumission du formulaire
document.getElementById("quote-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const citation = {
    quote: form.quote.value,
    actor: form.actor.value,
    character: form.character.value,
    season: form.season.value,
    title: form.title.value,
    episode: form.episode.value
  };

  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbxGIGh0PkfGSbXVbdzLxZWmQlAPuOLYBXDvHaMiCgFFFGZvgYKPLLINDUNCQYULnSaxOA/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(citation)
    });
    const text = await res.text();
    alert("✅ Citation ajoutée !");
    form.reset();
    modal.style.display = "none";
  } catch (err) {
    alert("❌ Une erreur est survenue");
    console.error(err);
  }
});


// Recherche aléatoire à chaque frappe
searchInput.addEventListener("input", (e) => {
  filterQuotes(e.target.value);
});

newQuoteBtn.addEventListener("click", showNewQuote);
prevQuoteBtn.addEventListener("click", showPreviousQuote);
copyQuoteBtn.addEventListener("click", copyQuote);
openBtn.addEventListener("click", () => {
  modal.style.display = "block";
});
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

window.onload = fetchQuotes;
