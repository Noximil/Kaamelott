const textEl = document.getElementById("text");
const authorEl = document.getElementById("author");
const newQuoteBtn = document.getElementById("new-quote");
const prevQuoteBtn = document.getElementById("prev-quote");


let quotes = [];
let history = [];
let currentIndex = -1;

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

showNewQuote();
