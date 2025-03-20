import { images } from './images.js';
const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const resetBtn = document.getElementById('restart-btn');
const gameContainer = document.getElementById('game-container')
const difficultyMenu = document.getElementById('difficulty-menu');
const gameInfo = document.getElementById('game-info');
const backBtn = document.getElementById('back-btn');

let cards = [];
let flippedCards = [];
let moves = 0;
let lockBoard;
let timer = 0;
let timerInterval;
let pairsFound = 0;
let totalPairs = 0;

function difficultySelection(e) {
    if (!e.target.classList.contains('difficulty-btn')) return;
    totalPairs = parseInt(e.target.dataset.pairs);

    difficultyMenu.style.display = 'none';
    gameContainer.style.display = 'block';
    gameBoard.style.display = 'grid';
    gameInfo.style.display = 'block';
    resetBtn.style.display = 'inline';
    backBtn.style.display = 'block';
    resetGame();
}

backBtn.addEventListener('click', () => {
    difficultyMenu.style.display = 'flex';
    gameContainer.style.display = 'block';
    gameBoard.style.display = 'none';
    gameInfo.style.display = 'none';
    resetBtn.style.display = 'none';
    backBtn.style.display = 'none';
})

function createCards() {
    const cardsImage = images.slice(0, totalPairs);
    const cardImages = [...cardsImage, ...cardsImage];
    cardImages.sort(() => 0.5 - Math.random());

    cards = cardImages.map(image => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.name = image.name;

        const cardFront = document.createElement("div");
        cardFront.classList.add("card-front");
        cardFront.style.backgroundImage = `url(${image.image})`;

        const cardBack = document.createElement("div");
        cardBack.classList.add("card-back");

        card.append(cardFront, cardBack);
        card.addEventListener("click", flipCard);
        return card;
    });
    switch (totalPairs) {
        case 6:
            gameBoard.style.gridTemplateColumns = `repeat(4,90px)`
            break;
        case 14:
            gameBoard.style.gridTemplateColumns = `repeat(7,80px)`
            break;
        case 16:
            gameBoard.style.gridTemplateColumns = `repeat(8,90px)`
            break;
    }
    gameBoard.append(...cards)
}

function flipCard() {
    if (lockBoard) return;
    if (this.classList.contains('flipped') || flippedCards === 2) return;
    this.classList.add('flipped');
    flippedCards.push(this);
    if (flippedCards.length === 2) {
        lockBoard = true;
        isMatch();
    }
}

function isMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.name === card2.dataset.name) {
        card1.classList.add('success');
        card2.classList.add('success');
        flippedCards = [];
        pairsFound++;

        if (pairsFound === totalPairs) {
            clearInterval(timerInterval);
            setTimeout(() => {
                alert(`Congratulations! You won in ${moves} moves and ${formatTimer(timer)}!`);
            }, 500);
        }

        lockBoard = false;
    } else {
        card1.classList.add('failed');
        card2.classList.add('failed');
        setTimeout(() => {
            card1.classList.remove('failed');
            card2.classList.remove('failed');
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            lockBoard = false;
        }, 1000);
    }
    moves++
    movesDisplay.textContent = moves;
}

function startTimer() {
    timer = 0;
    timerDisplay.textContent = formatTimer(timer);
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer++
        timerDisplay.textContent = formatTimer(timer);
    }, 1000);
}

function formatTimer(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`
}

function resetGame() {
    gameBoard.textContent = "";
    moves = 0;
    movesDisplay.textContent = moves;
    clearInterval(timerInterval);
    startTimer();
    createCards();
    pairsFound = 0;
}

resetBtn.addEventListener('click', resetGame);
difficultyMenu.addEventListener('click', difficultySelection);