const gameContainer = document.querySelector(".game-container"); // used class instead of id
function renderGamePage() {
  gameContainer.innerHTML = `<div class="game-info">
        <span>Time: <b id="time">0</b>s</span>
        <span>Moves: <b id="moves">0</b></span>
        <span>Matched: <b id="match">0</b>/8</span>
        </div>
        <div class="card-container"></div>
        <button id="reset-btn" class="reset-btn" type="submit">Reset Game</button>
        <p class="win-message"></p>`;
}
renderGamePage();

// const cardsData = [
//   { id: 1, image: "./assets/cardImages-1/img-1.png", name: "img-1" },
//   { id: 2, image: "./assets/cardImages-1/img-2.png", name: "img-2" },
//   { id: 3, image: "./assets/cardImages-1/img-3.png", name: "img-3" },
//   { id: 4, image: "./assets/cardImages-1/img-4.png", name: "img-4" },
//   { id: 5, image: "./assets/cardImages-1/img-5.png", name: "img-5" },
//   { id: 6, image: "./assets/cardImages-1/img-6.png", name: "img-6" },
//   { id: 7, image: "./assets/cardImages-1/img-7.png", name: "img-7" },
//   { id: 8, image: "./assets/cardImages-1/img-8.png", name: "img-8" },
// ];

const cardContainer = document.querySelector(".card-container");
const timeEl = document.getElementById("time");
const movesEl = document.getElementById("moves");
const matchEl = document.getElementById("match");
const msg = document.querySelector(".win-message");
const resetBtn = document.getElementById("reset-btn");

const flipSound = new Audio("assets/sounds/sound_flip_card.ogg");
const correctSound = new Audio("assets/sounds/sound_win.wav");
const wrongSound = new Audio("assets/sounds/sound_wrong.wav");
const shuffleSound = new Audio("assets/sounds/sound_shuffle.wav");

let cards = [];
let firstCard = null;
let secondCard = null;
let lock = false; // to prevent more click
let moves = 0;
let match = 0;
let time = 0;
let timer = null;

async function startGame() {
  cardContainer.innerHTML = "";

  moves = 0;
  match = 0;
  time = 0;
  firstCard = null;
  secondCard = null;
  lock = false;
  timeEl.textContent = 0;
  movesEl.textContent = 0;
  matchEl.textContent = 0;
  msg.textContent = "";
  clearInterval(timer);
  timer = null;

  //-- fetch data(cards)
  const response = await fetch("http://localhost:3000/cards/random-pack");
  const data = await response.json();
  const cardData = data.cards;

  //duplicate every pack cards
  cards = shuffleCards([...cardData, ...cardData]);

  cards.forEach((cardData) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = cardData.id;

    card.innerHTML = `
        <div class="face front"></div>
        <div class="face back">
          <img src="${cardData.image_path}" alt="${cardData.name}">
        </div>
    `;

    card.addEventListener("click", () => flip(card));
    cardContainer.appendChild(card);
  });
}

function shuffleCards(a) {
  playSound(shuffleSound);
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
  playSound(flipSound);

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
    playSound(correctSound);
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchEl.textContent = ++match;

    if (match === 8) {
      clearInterval(timer);
      msg.textContent = "🎉Congratulations, you have Matched all cards!🤩";
    }
  } else {
    playSound(wrongSound);
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
  }

  firstCard = null;
  secondCard = null;
  lock = false;
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

resetBtn.onclick = startGame;

startGame();
