const textEl = document.getElementById("text");
const authorEl = document.getElementById("author");
const newQuoteBtn = document.getElementById("new-quote");
const prevQuoteBtn = document.getElementById("prev-quote");

let quotes = [];
let history = []; // Liste des index
let currentIndex = -1; // Position actuelle dans l'historique

async function fetchQuotes() {
  try {
    const response = await fetch("./kaamelott-quotes.json");
    quotes = await response.json();
    showNewQuote();
  } catch (error) {
    console.error("Erreur de chargement :", error);
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
  const quote = quotes[index];
  textEl.textContent = quote.quote;
  authorEl.textContent = `— ${quote.author}`;
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
    const index = history[currentIndex];
    showQuoteByIndex(index);
  }
}

window.onload = fetchQuotes;
newQuoteBtn.addEventListener("click", showNewQuote);
prevQuoteBtn.addEventListener("click", showPreviousQuote);
