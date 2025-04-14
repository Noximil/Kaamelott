// 🌟 Sélecteurs DOM
const textEl = document.getElementById("text");
const actorEl = document.getElementById("actor");
const characterEl = document.getElementById("character");
const infoEl = document.getElementById("extra-info");
const newQuoteBtn = document.getElementById("new-quote");
const prevQuoteBtn = document.getElementById("prev-quote");
const copyQuoteBtn = document.getElementById("copy-quote");
const searchInput = document.getElementById("search");
const modal = document.getElementById("formModal");
const openBtn = document.getElementById("open-form-btn");
const closeBtn = document.querySelector(".modal .close");
const form = document.getElementById("quote-form");

// 🌐 API Endpoints
const GET_URL = "https://script.google.com/macros/s/AKfycbyOXWslK-djsAMZyQNa049U9g4xEWGfpBbEpO3ANZ53-Utkail2iqUlHlGHvDqETdWK/exec";
const POST_URL = "https://script.google.com/macros/s/AKfycbyOXWslK-djsAMZyQNa049U9g4xEWGfpBbEpO3ANZ53-Utkail2iqUlHlGHvDqETdWK/exec";

// 📦 Données
let quotes = [];
let filteredQuotes = [];
let history = [];
let currentIndex = -1;

// 🔁 Récupération des citations
async function fetchQuotes() {
  try {
    const response = await fetch(GET_URL);
    quotes = await response.json();
    filteredQuotes = [...quotes];
    showNewQuote();
  } catch (error) {
    textEl.textContent = "Erreur de chargement depuis Google Sheets.";
    console.error(error);
  }
}

// 🎲 Affichage d'une citation
function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

function showQuote(quote) {
  textEl.textContent = `“${quote.quote}”`;
  actorEl.textContent = `— ${quote.character}`;
  characterEl.textContent = `Acteur : ${quote.actor}`;
  infoEl.textContent = `${quote.season} – ${quote.title} (épisode ${quote.episode})`;
}

function showNewQuote() {
  if (filteredQuotes.length === 0) {
    textEl.textContent = "Aucune citation ne correspond à votre recherche.";
    actorEl.textContent = "";
    characterEl.textContent = "";
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

// 🔍 Recherche dynamique (accent-insensitive)
function removeAccents(str) {
  return (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function filterQuotes(keyword) {
  const lower = removeAccents(keyword.toLowerCase());

  filteredQuotes = quotes.filter(q => {
    return (
      removeAccents(q.quote?.toLowerCase()).includes(lower) ||
      removeAccents(q.actor?.toLowerCase()).includes(lower) ||
      removeAccents(q.character?.toLowerCase()).includes(lower) ||
      removeAccents(q.character?.toLowerCase()).includes(lower) ||
      removeAccents(q.season?.toLowerCase()).includes(lower) ||
      removeAccents(q.title?.toLowerCase()).includes(lower)
    );
  });

  if (filteredQuotes.length === 0) {
    textEl.textContent = "Aucune citation ne correspond à votre recherche.";
    actorEl.textContent = "";
    characterEl.textContent = "";
    infoEl.textContent = "";
    return;
  }

  history = [];
  currentIndex = -1;
  showNewQuote();
}

// 📋 Copier la citation
function copyQuote() {
  const quoteText = `${textEl.textContent} ${actorEl.textContent} (${infoEl.textContent})`;
  navigator.clipboard.writeText(quoteText).then(() => {
    copyQuoteBtn.textContent = "Copié !";
    setTimeout(() => copyQuoteBtn.textContent = "Copier la citation", 2000);
  });
}

// 📝 Envoi du formulaire (silencieux)
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const citation = {
    quote: form.quote.value,
    actor: form.actor.value,
    character: form.character.value,
    season: form.season.value,
    title: form.title.value,
    episode: form.episode.value
  };

  // Envoi sans gestion de réponse (évite les erreurs CORS)
  fetch(POST_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(citation)
  });

  form.reset();
  modal.style.display = "none";
  fetchQuotes(); // Recharge les citations après envoi
});

// 🎛️ Événements UI
searchInput.addEventListener("input", (e) => filterQuotes(e.target.value));
newQuoteBtn.addEventListener("click", showNewQuote);
prevQuoteBtn.addEventListener("click", showPreviousQuote);
copyQuoteBtn.addEventListener("click", copyQuote);
openBtn.addEventListener("click", () => modal.style.display = "block");
closeBtn.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// 🚀 Initialisation
window.onload = fetchQuotes;
