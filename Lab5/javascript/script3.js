// === ГОДИННИК ===
function clock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    document.querySelector('.hours').textContent = hours;
    document.querySelector('.minutes').textContent = minutes;
    document.querySelector('.seconds').textContent = seconds;
}

setInterval(clock, 1000);
clock();

// === ТАЙМЕР ===
const endTime = document.getElementById('endTime');
let timer = document.getElementById('timer');
let timerInterval;

const formatTime = (time) => String(time).padStart(2, '0');

function startTimer() {
    const endTimer = new Date(endTime.value).getTime();
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        const now = Date.now();
        const timeLeft = endTimer - now;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timer.textContent = '00:00:00:00';
            alert('Таймер завершився!');
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
        const seconds = Math.floor((timeLeft / 1000) % 60);

        timer.textContent = `${formatTime(days)}:${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
    }, 1000);
}

document.getElementById('startTimer').addEventListener('click', startTimer);

// === КАЛЕНДАР ===
const currentMonth = document.getElementById('currentMonthYear');
const calendarGrid = document.getElementById('calendarGrid');
const daysOfWeek = document.getElementById('daysOfWeek');
let currentDate = new Date();



const weekDays = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П’ятниця', 'Субота'];

function renderWeekDays() {

    daysOfWeek.innerHTML = weekDays
        .map(day => `<div>${day}</div>`)
        .join('');
    daysOfWeek.style.display = 'grid';
    daysOfWeek.style.gridTemplateColumns = 'repeat(7, 1fr)';
}

function calendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    currentMonth.textContent = `${new Intl.DateTimeFormat('uk', { month: 'long' }).format(date)} ${year}`;
    calendarGrid.innerHTML = '';

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarGrid.innerHTML += `<div></div>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        calendarGrid.innerHTML += `<div>${day}</div>`;
    }
}

document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    calendar(currentDate);
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    calendar(currentDate);
});


renderWeekDays();
calendar(currentDate);

// === ДЕНЬ НАРОДЖЕННЯ ===
const birthdayInput = document.getElementById('birthdayInput');
const countdown = document.getElementById('birthdayCountdown');

function calculateBirthday() {
    const birthday = new Date(birthdayInput.value);
    const now = new Date();

    birthday.setFullYear(now.getFullYear());
    if (birthday < now) {
        birthday.setFullYear(now.getFullYear() + 1);
    }

    const timeLeft = birthday - now;

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    countdown.textContent = `${days}:${hours}:${minutes}:${seconds}`;
}

document.getElementById('calculateBirthdayTime').addEventListener('click', calculateBirthday);
