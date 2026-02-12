const gameContainer = document.getElementById("game-container");

function renderGamePage() {
  gameContainer.innerHTML = `
    <header>
      <h1>Memory Matching Game</h1>
    </header>

    <section class="game-info">
      <p>Time: <span id="time">0</span></p>
      <p>Moves: <span id="moves">0</span></p>
      <p>Matches: <span id="match">0</span>/8</p>
    </section>

    <section class="card-container"></section>
    <div class="btns">
      <button id="reset-btn">Reset Game</button>
      <button id="hard-level">Hard Level</button>
    </div>

    <p class="win-message"></p>
    <div class="emoji-icon"></div>

    <footer>
      <p>
        Coded by <a href="https://github.com/Idesta1" target="_blank">Iglesia</a> and
        <a href="https://github.com/rouhi438" target="_blank">Abbas, </a>
        <a class="HYF" href="https://www.hackyourfuture.dk/about" target="_blank">HYF</a>
        &copy Feb 2026, open-sourced on
        <a href="https://github.com/Idesta1/FoundationGameProject" target="_blank">Github</a>
        and hosted on <a href="#">Netlify</a> 🖤
      </p>
    </footer>
  `;
}
renderGamePage();

const cardContainer = document.querySelector(".card-container");
const timeEl = document.getElementById("time");
const movesEl = document.getElementById("moves");
const matchEl = document.getElementById("match");
const msg = document.querySelector(".win-message");
const resetBtn = document.getElementById("reset-btn");
const hardBtn = document.getElementById("hard-level");
const emojiIcon = document.querySelector(".emoji-icon");

const flipSound = new Audio("assets/sounds/sound_flip_card.ogg");
const correctSound = new Audio("assets/sounds/sound_win.wav");
const wrongSound = new Audio("assets/sounds/sound_wrong.wav");
const shuffleSound = new Audio("assets/sounds/sound_shuffle.wav");

let cards = [];
let firstCard = null;
let secondCard = null;
let lock = false;
let moves = 0;
let match = 0;
let time = 0;
let timer = null;
let hardLevel = false;
let hardTime = 30;
let hardTimer = null;
let emojiVisible = false;

resetBtn.onclick = () => startGame();
hardBtn.onclick = () => {
  hardLevel = true;
  startGame(true);
};

async function startGame(isHard = false) {
  // reset game state
  cardContainer.innerHTML = "";
  firstCard = null;
  secondCard = null;
  lock = false;
  moves = 0;
  match = 0;
  time = 0;
  hardTime = 30;
  emojiVisible = false;

  if (cardContainer.timeoutId) {
    clearTimeout(cardContainer.timeoutId);
    cardContainer.timeoutId = null;
  }

  timeEl.textContent = isHard ? hardTime : 0;
  movesEl.textContent = 0;
  matchEl.textContent = 0;
  matchEl.style.color = "";
  timeEl.style.color = "";
  msg.textContent = "";
  emojiIcon.style.opacity = 0;
  emojiIcon.style.animation = "";

  clearInterval(timer);
  timer = null;
  clearInterval(hardTimer);
  hardTimer = null;

  const response = await fetch("http://localhost:3000/cards/random-pack");
  const data = await response.json();
  const cardData = data.cards;

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

function shuffleCards(array) {
  playSound(shuffleSound);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function flip(card) {
  if (
    lock ||
    card.classList.contains("flipped") ||
    card.classList.contains("matched")
  )
    return;

  card.classList.add("flipped");
  playSound(flipSound);

  if (!timer && !hardLevel) {
    timer = setInterval(() => (timeEl.textContent = ++time), 1000);
  }
  if (!hardTimer && hardLevel) {
    hardTimer = setInterval(() => {
      hardTime--;
      timeEl.textContent = hardTime;

      if (hardTime <= 10) {
        timeEl.style.color = "red";
      } else {
        timeEl.style.color = "";
      }
      if (hardTime <= 0) gameOver(false);
    }, 1000);
  }

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lock = true;
  movesEl.textContent = ++moves;

  if (cardContainer.timeoutId) clearTimeout(cardContainer.timeoutId);
  cardContainer.timeoutId = setTimeout(checkMatch, 700);
}

function checkMatch() {
  if (cardContainer.timeoutId) {
    clearTimeout(cardContainer.timeoutId);
    cardContainer.timeoutId = null;
  }

  if (firstCard.dataset.id === secondCard.dataset.id) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchEl.textContent = ++match;
    matchEl.style.color = "Yellow";
    playSound(correctSound);

    if (match === 8) {
      gameOver(true);
    }
  } else {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    playSound(wrongSound);
  }

  firstCard = null;
  secondCard = null;
  lock = false;
}

function gameOver(win) {
  if (cardContainer.timeoutId) {
    clearTimeout(cardContainer.timeoutId);
    cardContainer.timeoutId = null;
  }

  clearInterval(timer);
  timer = null;
  clearInterval(hardTimer);
  hardTimer = null;

  lock = true;

  if (win) {
    msg.innerHTML = "Congratulations, you <strong>WON</strong> the game! 😎";
    if (!emojiVisible && hardLevel) showEmoji("🎉");
  } else {
    msg.textContent = "Game over, try again";
    if (!emojiVisible && hardLevel) showEmoji("☹️");
    timeEl.textContent = 0;
  }

  hardLevel = false;
}

function showEmoji(emoji) {
  emojiIcon.textContent = emoji;
  emojiIcon.style.opacity = 1;
  emojiIcon.style.animation = "emoji-pulse 1s infinite alternate";
  emojiVisible = true;
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}
startGame();
