const GET_URL = "https://script.google.com/macros/s/AKfycby67hep7a1FB8DGrJ1_cOkPm8QzvMTEM5STVxzrvoq_7odGE4cbDQQSpI70RQS9octd/exec";
const POST_URL = "https://script.google.com/macros/s/AKfycby67hep7a1FB8DGrJ1_cOkPm8QzvMTEM5STVxzrvoq_7odGE4cbDQQSpI70RQS9octd/exec";

const textEl = document.getElementById("text");
const actorEl = document.getElementById("actor");
const authorEl = document.getElementById("author");
const infoEl = document.getElementById("extra-info");
const likeBtn = document.getElementById("like-quote");
const likeCountEl = document.getElementById("like-count");
const searchInput = document.getElementById("search");

let quotes = [];
let filteredQuotes = [];
let history = [];
let currentIndex = -1;

async function fetchQuotes() {
  try {
    const res = await fetch(GET_URL);
    quotes = await res.json();
    filteredQuotes = [...quotes];
    showNewQuote();
  } catch (e) {
    textEl.textContent = "Erreur de chargement.";
  }
}

function showQuote(quote) {
  textEl.textContent = `“${quote.quote}”`;
  actorEl.textContent = `— ${quote.character}`;
  authorEl.textContent = `Acteur : ${quote.actor}`;
  infoEl.textContent = `${quote.season} – ${quote.title} (épisode ${quote.episode})`;
  likeCountEl.textContent = quote.likes || 0;
  likeBtn.dataset.quoteId = quote.id;
}

function getRandomIndex(array) {
  return Math.floor(Math.random() * array.length);
}

function showNewQuote() {
  if (filteredQuotes.length === 0) return;
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

searchInput.addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  filteredQuotes = quotes.filter(q =>
    q.quote.toLowerCase().includes(term) ||
    q.actor.toLowerCase().includes(term) ||
    q.character.toLowerCase().includes(term) ||
    q.title.toLowerCase().includes(term)
  );
  showNewQuote();
});

document.getElementById("new-quote").addEventListener("click", showNewQuote);
document.getElementById("prev-quote").addEventListener("click", showPreviousQuote);
document.getElementById("copy-quote").addEventListener("click", () => {
  const quoteText = `${textEl.textContent} ${actorEl.textContent} (${infoEl.textContent})`;
  navigator.clipboard.writeText(quoteText);
});

likeBtn.addEventListener("click", async () => {
  const quoteId = likeBtn.dataset.quoteId;
  const ip = await fetch("https://api64.ipify.org?format=json").then(res => res.json()).then(data => data.ip);

  fetch(POST_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ quote_id: quoteId, ip })
  }).then(() => {
    const count = parseInt(likeCountEl.textContent);
    likeCountEl.textContent = count + 1;
  });
});

window.onload = fetchQuotes;

const likeCountEl = document.getElementById("like-count");

// Gestion du bouton ❤️
likeBtn.addEventListener("click", async () => {
  const quoteId = likeBtn.dataset.quoteId;

  // Récupérer l'IP publique de l'utilisateur
  const ip = await fetch("https://api64.ipify.org?format=json")
    .then(res => res.json())
    .then(data => data.ip);

  // Envoyer le like au script Google Apps Script
  fetch("https://script.google.com/macros/s/TON_SCRIPT_ID_LIKE/exec", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ quote_id: quoteId, ip })
  }).then(res => res.text())
    .then(response => {
      if (response === "Liked") {
        let count = parseInt(likeCountEl.textContent);
        likeCountEl.textContent = count + 1;
      }
    }).catch(err => {
      console.error("Erreur lors de l'envoi du like :", err);
    });
});
