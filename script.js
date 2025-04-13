const textEl = document.getElementById("text");
const authorEl = document.getElementById("author");
const newQuoteBtn = document.getElementById("new-quote");
const prevQuoteBtn = document.getElementById("prev-quote"); // ← Ajoute ce bouton dans ton HTML
const tweetBtn = document.getElementById("tweet-quote");

let quotes = [];
let history = []; // stocke les index des dernières citations
let currentIndex = -1; // position actuelle dans l'historique

async function fetchQuotes() {
  try {
    const response = await fetch("https://raw.githubusercontent.com/Noximil/Kaamelott/d11fbad79d5a1e649bac2f127e8fadc2bc0b5a3b/kaamelott-quotes.json");
    quotes = await response.json();
    showNewQuote();
  } catch (error) {
    console.error("Erreur de chargement des citations :", error);
    textEl.textContent = "Impossible de charger les citations.";
    authorEl.textContent = "";
  }
}

function getRandomIndex() {
  let index;
  const recentIndexes = history.slice(-10);
  do {
    index = Math.floor(Math.random() * quotes.length);
  } while (recentIndexes.includes(index) && quotes.length > 10);
  return index;
}

function showQuoteByIndex(index) {
  const quote = quotes[index];
  textEl.textContent = quote.text;
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
    showQuoteByIndex(history[currentIndex]);
  }
}

window.onload = fetchQuotes;
newQuoteBtn.addEventListener("click", showNewQuote);
prevQuoteBtn.addEventListener("click", showPreviousQuote);
