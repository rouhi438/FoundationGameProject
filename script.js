const gameContainer = document.querySelector(".game-container"); // used class instead of id
function renderGamePage() {
  gameContainer.innerHTML = `<div class="game-info">
        <span>Time: <b id="time">0</b>s</span>
        <span>Moves: <b id="moves">0</b></span>
        <span>Matched: <b id="match">0</b>/8</span>
        </div>
        <div class="card-container"></div>
        <button id="reset-btn">Reset Game</button>
        <p id="win-message"></p>`;
}
renderGamePage();

const cardsData = [
  { id: 1, image: "./assets/soccer 1.png", name: "Soccer Ball 1" },
  { id: 2, image: "./assets/soccer 2.png", name: "Soccer Ball 2" },
  { id: 3, image: "./assets/soccer 3.png", name: "Soccer Ball 3" },
  { id: 4, image: "./assets/soccer 4.png", name: "Soccer Ball 4" },
  { id: 5, image: "./assets/soccer 5.png", name: "Soccer Ball 5" },
  { id: 6, image: "./assets/soccer 6.png", name: "Soccer Ball 6" },
  { id: 7, image: "./assets/soccer 7.png", name: "Soccer Ball 7" },
  { id: 8, image: "./assets/soccer 8.png", name: "Soccer Ball 8" },
];

// ====== VARIABLES ======
const cardContainer = document.querySelector(".card-container");
const timeEl = document.getElementById("time");
const movesEl = document.getElementById("moves");
const matchEl = document.getElementById("match");
const msg = document.getElementById("win-message");
const resetBtn = document.getElementById("reset-btn");

let cards = [];
let firstCard = null;
let secondCard = null;
let lock = false;
let moves = 0;
let match = 0;
let time = 0;
let timer = null;

function startGame() {
  cardContainer.innerHTML = "";
  cards = shuffleCards([...cardsData, ...cardsData]);
  moves = match = time = 0;
  firstCard = secondCard = null;
  lock = false;
  timeEl.textContent = movesEl.textContent = matchEl.textContent = 0;
  msg.textContent = "";
  clearInterval(timer);
  timer = null;

  cards.forEach((cardData) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = cardData.id;

    card.innerHTML = `
      <div class="inner">
        <div class="face front"></div>
        <div class="face back">
          <img src="${cardData.image}" alt="${cardData.name}">
        </div>
      </div>
    `;

    card.addEventListener("click", () => flip(card));
    cardContainer.appendChild(card);
  });
}

function shuffleCards(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function flip(card) {
  if (
    lock ||
    card === firstCard ||
    card.classList.contains("flipped") ||
    card.classList.contains("matched")
  )
    return;

  if (!timer) {
    timer = setInterval(() => (timeEl.textContent = ++time), 1000);
  }

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lock = true;
  movesEl.textContent = ++moves;

  setTimeout(check, 700);
}

function check() {
  if (firstCard.dataset.id === secondCard.dataset.id) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchEl.textContent = ++match;

    if (match === 8) {
      clearInterval(timer);
      msg.textContent = "YOU WIN THE GAME 🎉";
    }
  } else {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
  }

  firstCard = null;
  secondCard = null;
  lock = false;
}

resetBtn.onclick = startGame;

startGame();
