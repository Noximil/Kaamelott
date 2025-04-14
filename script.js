const textEl = document.getElementById("text");
const actorEl = document.getElementById("actor");
const authorEl = document.getElementById("author");
const infoEl = document.getElementById("extra-info");
const newQuoteBtn = document.getElementById("new-quote");
const prevQuoteBtn = document.getElementById("prev-quote");
const copyQuoteBtn = document.getElementById("copy-quote");
const searchInput = document.getElementById("search");

let quotes = [];
let filteredQuotes = [];
let history = [];
let currentIndex = -1;

async function fetchQuotes() {
  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbx4o-8T-kqlvib5hkeGAxCfu-QxjN-PKeP9ESI_h2hH5ATiwrr8Mnr1b7q6gz7Q0QaCxg/exec");
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

// Recherche aléatoire à chaque frappe
searchInput.addEventListener("input", (e) => {
  filterQuotes(e.target.value);
});

newQuoteBtn.addEventListener("click", showNewQuote);
prevQuoteBtn.addEventListener("click", showPreviousQuote);
copyQuoteBtn.addEventListener("click", copyQuote);

window.onload = fetchQuotes;
