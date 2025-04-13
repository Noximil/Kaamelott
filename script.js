const textEl = document.getElementById("text");
const actorEl = document.getElementById("actor");
const authorEl = document.getElementById("author");
const infoEl = document.getElementById("extra-info");
const newQuoteBtn = document.getElementById("new-quote");
const prevQuoteBtn = document.getElementById("prev-quote");
const copyQuoteBtn = document.getElementById("copy-quote");
const searchInput = document.getElementById("search");
const searchResultsEl = document.getElementById("search-results");

let quotes = [];
let filteredQuotes = [];
let history = [];
let currentIndex = -1;

async function fetchQuotes() {
  try {
    const response = await fetch("./kaamelott-quotes.json");
    quotes = await response.json();
    filteredQuotes = [...quotes];
    showNewQuote();
  } catch (error) {
    textEl.textContent = "Erreur de chargement des citations.";
  }
}

function getRandomIndex() {
  let index;
  const recent = history.slice(-10);
  do {
    index = Math.floor(Math.random() * filteredQuotes.length);
  } while (recent.includes(index) && filteredQuotes.length > 10);
  return index;
}

function showQuoteByIndex(index) {
  const q = filteredQuotes[index];
  textEl.textContent = `“${q.quote}”`;
  actorEl.textContent = `— ${q.actor}`;
  authorEl.textContent = `Auteur : ${q.author}`;
  infoEl.textContent = `${q.season} – ${q.title} (épisode ${q.episode})`;
}

function showNewQuote() {
  if (filteredQuotes.length === 0) {
    textEl.textContent = "Aucune citation ne correspond à votre recherche.";
    actorEl.textContent = "";
    authorEl.textContent = "";
    infoEl.textContent = "";
    searchResultsEl.innerHTML = "";
    return;
  }

  const index = getRandomIndex();
  showQuoteByIndex(index);
  history.push(index);
  currentIndex = history.length - 1;
}

function showPreviousQuote() {
  if (currentIndex > 0) {
    currentIndex--;
    showQuoteByIndex(history[currentIndex]);
  }
}

function filterQuotes(keyword) {
  const lower = keyword.toLowerCase();
  filteredQuotes = quotes.filter(q =>
    q.quote.toLowerCase().includes(lower) ||
    q.actor.toLowerCase().includes(lower) ||
    q.author.toLowerCase().includes(lower) ||
    q.season.toLowerCase().includes(lower) ||
    q.title.toLowerCase().includes(lower)
  );
  history = [];
  currentIndex = -1;
  showNewQuote();
  updateSearchResults();
}

function updateSearchResults() {
  searchResultsEl.innerHTML = "";
  filteredQuotes.forEach((q, i) => {
    const li = document.createElement("li");
    li.textContent = `"${q.quote}" — ${q.actor}`;
    li.addEventListener("click", () => {
      showQuoteByIndex(i);
      history.push(i);
      currentIndex = history.length - 1;
    });
    searchResultsEl.appendChild(li);
  });
}

function copyQuote() {
  const quoteText = `${textEl.textContent} ${actorEl.textContent} (${infoEl.textContent})`;
  navigator.clipboard.writeText(quoteText).then(() => {
    copyQuoteBtn.textContent = "Copié !";
    setTimeout(() => copyQuoteBtn.textContent = "Copier la citation", 2000);
  });
}

searchInput.addEventListener("input", (e) => {
  filterQuotes(e.target.value);
});

newQuoteBtn.addEventListener("click", showNewQuote);
prevQuoteBtn.addEventListener("click", showPreviousQuote);
copyQuoteBtn.addEventListener("click", copyQuote);

window.onload = fetchQuotes;
