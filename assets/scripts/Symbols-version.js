const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const resetBtn = document.getElementById('restart-btn');
let cards = [];
let flippedCards = [];
let moves = 0;
let lockBoard;
let timer = 0;
let timerInterval;
let pairsFound = 0;


function createCards() {
    const symbols = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const cardSymbols = [...symbols, ...symbols];
    cardSymbols.sort(() => 0.5 - Math.random());

    cards = cardSymbols.map(symbol => {
        const card = document.createElement('div');
        card.classList.add("card");
        card.dataset.symbol = symbol;
        card.addEventListener('click', flipCard);
        return card;
    });
    gameBoard.style.gridTemplateColumns = `repeat(${Math.sqrt(cards.length)}, 1fr)`
    gameBoard.append(...cards)
}

function flipCard() {
    if (lockBoard) return;
    if (this.classList.contains('flipped') || flippedCards === 2) return;
    this.classList.add('flipped');
    this.textContent = this.dataset.symbol;
    flippedCards.push(this);
    if (flippedCards.length === 2) {
        lockBoard = true;
        isMatch();
    }
}

function isMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.symbol === card2.dataset.symbol) {
        card1.classList.add('success');
        card2.classList.add('success');
        flippedCards = [];
        pairsFound++;

        if (pairsFound === cards.length / 2) {
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
            card1.textContent = "";
            card2.textContent = "";
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

resetGame();