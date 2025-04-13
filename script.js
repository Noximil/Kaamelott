const textEl = document.getElementById("text");
const actorEl = document.getElementById("actor");
const authorEl = document.getElementById("author");
const infoEl = document.getElementById("extra-info");
const newQuoteBtn = document.getElementById("new-quote");
const prevQuoteBtn = document.getElementById("prev-quote");

let quotes = [];
let history = [];
let currentIndex = -1;

async function fetchQuotes() {
  try {
    const response = await fetch("./kaamelott-quotes.json");
    quotes = await response.json();
    showNewQuote();
  } catch (error) {
    textEl.textContent = "Impossible de charger les citations.";
    authorEl.textContent = "";
  }
}

function getRandomIndex() {
  let index;
  const recent = history.slice(-10);
  do {
    index = Math.floor(Math.random() * quotes.length);
  } while (recent.includes(index) && quotes.length > 10);
  return index;
}

function showQuoteByIndex(index) {
  const q = quotes[index];
  textEl.textContent = `“${q.quote}”`;
  actorEl.textContent = `— ${q.actor}`;
  authorEl.textContent = `Auteur : ${q.author}`;
  infoEl.textContent = `${q.season} – ${q.title} (épisode ${q.episode})`;
}

function showNewQuote() {
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

window.onload = fetchQuotes;
newQuoteBtn.addEventListener("click", showNewQuote);
prevQuoteBtn.addEventListener("click", showPreviousQuote);
