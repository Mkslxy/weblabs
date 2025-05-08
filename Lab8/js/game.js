const game = document.querySelector('.game');
const level = document.getElementById('lvl');
const startBtn = document.getElementById('startBtn');
const newGameBtn = document.getElementById('newGameBtn');
const timer = document.getElementById('timer');
const score = document.getElementById('score');
const namePl = document.getElementById('name');
const rowsInput = document.getElementById('rows');
const columnsInput = document.getElementById('columns');
const setNameBtn = document.getElementById('setNameBtn');
const users = document.getElementById('users');
const nameInputs = document.getElementById('nameInputs');
const round = document.getElementById('round');
const restartBtn = document.getElementById('restartBtn');


const images = [
    'images/1.jpg', 'images/2.jpeg', 'images/3.jpeg', 'images/4.jpeg',
    'images/5.jpeg', 'images/6.jpeg', 'images/7.jpeg', 'images/8.jpeg',
    'images/9.jpeg', 'images/10.jpeg', 'images/11.jpeg', 'images/12.jpeg',
    'images/13.jpeg', 'images/14.jpeg', 'images/15.jpeg',
];

let playerScore = 0;
let interval = null;
let flippedCards = [];
let matched = 0;
let totalRounds = 1;
let currRound = 1;
let totalCards;

function roundCount() {
    totalRounds = parseInt(round.value);
    currRound = 1;
    updateRound();
}

function updateRound() {
    const roundsDiv = document.getElementById("rounds");
    roundsDiv.innerHTML = `Раунд: ${currRound} з ${totalRounds}`;
}

function nextRound() {
    if (currRound < totalRounds) {
        currRound++;
        alert(`Раунд ${currRound} починається!`);
        updateRound();
        startGame();
    } else {
        alert(`Гру завершено.`);
        currRound = 1;
        updateRound();
    }
}

// ending
function endGame() {
    alert(`Раунд ${currRound} завершено! Ваш рахунок ${playerScore}`);
    nextRound();
}

function updatePlayerCount() {
    let numUser = users.value;
    nameInputs.innerHTML = ''; //очищає блок , щоб не було старих полів

    for (let i = 1; i <= numUser; i++) {
        const label = document.createElement('label');
        label.textContent = `Введіть імя гравця ${i}`;
        const input = document.createElement('input');
        input.type = "text";
        input.id = `name${i}`;
        input.placeholder = `Ім'я гравця ${i}`;

        const div = document.createElement('div');
        div.appendChild(label);
        div.appendChild(input);
        nameInputs.appendChild(div);
    }

    const button = document.createElement('button');
    button.textContent = "OK";
    button.onclick = saveNames;
    nameInputs.appendChild(button);
}

function saveNames() {
    let numUser = users.value;
    const usersNamesDiv = document.getElementById('usersName');
    usersNamesDiv.innerHTML = '';

    for (let i = 1; i <= numUser; i++) {
        const name = document.getElementById(`name${i}`).value;
        const nameDiv = document.createElement('div');
        nameDiv.textContent = `Гравець ${i}: ${name}`;
        usersNamesDiv.appendChild(nameDiv);
    }
}



setNameBtn.addEventListener('click', () => {
    let playerName = namePl.value.trim();
    const nameDiv = document.querySelector('.name');

    if (playerName) {
        nameDiv.textContent = playerName;
    } else {
        alert('Введіть імя');
    }
});


function startTimer() {
    const levelVal = level.value;
    let timeLeft = levelVal === 'easy' ? 180 : levelVal === 'normal' ? 120 : 60;
    timer.textContent = `Час: ${timeLeft}`;
    interval = setInterval(() => {
        timeLeft--;
        timer.textContent = `Час: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(interval);
            alert('Час закінчився! Спробуй ще');
            resetGame();
        }
    }, 1000);
}

function updateScore() {
    score.textContent = playerScore;
}

function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        card.querySelector('img').style.display = 'block';
        flippedCards.push(card);
        if (flippedCards.length === 2) checkMatch();
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function checkMatch() {
    const [first, second] = flippedCards;
    if (first.querySelector('img').src === second.querySelector('img').src) {
        matched++;
        console.log(matched);
        playerScore++;
        updateScore();
        flippedCards = [];
        if (matched === totalCards / 2) {
            clearInterval(interval);
            alert(`Вітаю! Ви виграли! Ваш рахунок: ${playerScore}`);
            endGame();
        }
    } else {
        setTimeout(() => {
            first.classList.remove('flipped');
            second.classList.remove('flipped');
            first.querySelector('img').style.display = 'none';
            second.querySelector('img').style.display = 'none';
            flippedCards = [];
        }, 1000);
    }
}



function startGame() {

    resetGame();

    const rows = parseInt(rowsInput.value);
    const columns = parseInt(columnsInput.value);

    totalCards = rows * columns;

    if (totalCards < 16) {
        alert('Мінімальна кількість карток — 16 (поле 4x4)!');
        return;
    }

    const cardImages = images.slice(0, totalCards / 2);
    const allCards = [...cardImages, ...cardImages];
    shuffleArray(allCards);

    allCards.forEach((image) => {
        const card = document.createElement('div');
        card.classList.add('card');
        const img = document.createElement('img');
        img.src = image;
        img.style.display = 'none';
        card.appendChild(img);
        card.addEventListener('click', () => flipCard(card));
        game.appendChild(card);
    });

    game.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    game.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    updateRound();
    startTimer();
}


newGameBtn.addEventListener('click', resetGame);


startBtn.addEventListener('click', () => {
    roundCount();
    startGame();
});

function resetGame() {
    game.innerHTML = '';
    score.textContent = 0;
    playerScore = 0;
    matched = 0;
    flippedCards = [];
    if (interval) clearInterval(interval);
}

function resetAll() {
    resetGame();

    rowsInput.value = 4;
    columnsInput.value = 4;
    level.value = 'easy';
    users.value = 1;
    round.value = 1;


    nameInputs.innerHTML = `
        <label for="name">Введіть ім'я</label>
        <input type="text" id="name" placeholder="Ім'я гравця">
        <button id="setNameBtn">OK</button>
    `;

    document.getElementById('setNameBtn').addEventListener('click', () => {
        let playerName = document.getElementById('name').value.trim();
        const nameDiv = document.querySelector('.name');

        if (playerName) {
            nameDiv.textContent = playerName;
        } else {
            alert('Введіть ім\'я');
        }
    });


    document.getElementById('usersName').innerHTML = '';
    document.getElementById('rounds').innerHTML = '';
    score.textContent = 0;
    timer.textContent = 'Час: 0';
    playerScore = 0;
    matched = 0;
    currRound = 1;
}

restartBtn.addEventListener('click', resetAll);

