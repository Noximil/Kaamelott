const textEl = document.getElementById("text");
const authorEl = document.getElementById("author");
const newQuoteBtn = document.getElementById("new-quote");
const tweetBtn = document.getElementById("tweet-quote");

let quotes = [];

async function fetchQuotes() {
  try {
    const response = await fetch("https://tonsite.com/kaamelott-quotes.json");
    quotes = await response.json();
    displayQuote(); // Affiche une citation dès que c’est chargé
  } catch (error) {
    console.error("Erreur de chargement des citations :", error);
    textEl.textContent = "Impossible de charger les citations.";
    authorEl.textContent = "";
  }
}

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function displayQuote() {
  if (quotes.length === 0) return;
  const quote = getRandomQuote();
  textEl.textContent = quote.text;
  authorEl.textContent = `— ${quote.author}`;
  tweetBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `"${quote.text}" — ${quote.author}`
  )}`;
}

window.onload = fetchQuotes;
newQuoteBtn.addEventListener("click", displayQuote);
