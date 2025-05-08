let lights = document.querySelectorAll('.light');
let changeLength = document.getElementById('changeLength');
let switchState = document.getElementById('switchState');
let stateDisplay = document.getElementById('stateDisplay');



let durations = [5000, 3000, 7000];
let currLight = 0;
let isRunning = true; 
const colorNames = ['червоний', 'жовтий', 'зелений'];

function traffic() {

    lights.forEach(light => light.classList.remove('active'));

    lights[currLight].classList.add('active');

    stateDisplay.textContent = colorNames[currLight];

    const duration = durations[currLight];
    if (currLight === 2) {
        setTimeout(() => {
            blinkYellow(3, () => {
                currLight = 0;
                traffic();
            });
        }, duration);
    } else {
        timer = setTimeout(() => {
            currLight = (currLight + 1) % 3;
            traffic();
        }, duration);
    }
};

function blinkYellow(count, callback) {
    let blinks = 0;

    function toggleYellow() {
        lights.forEach(light => light.classList.remove('active'));
        if (blinks % 2 === 0) {
            lights[1].classList.add('active');
        }

        blinks++;
        if (blinks < count * 2) {
            setTimeout(toggleYellow, 500);
            stateDisplay.textContent = "миготливий жовтий";
        } else {
            callback();
        }
    }
    toggleYellow();
};

function changeDuration() {
    const colorNames = ['червоний', 'жовтий', 'зелений'];

    for (let i = 0; i < durations.length; i++) {
        const timeChange = prompt(`введіть тривалість для ${colorNames[i]}`, durations[i]);


        const newDuration = parseFloat(timeChange);
        if (!isNaN(newDuration) && newDuration > 0) {
            durations[i] = newDuration;
        } else {
            alert("Введіть коректне значення");
        };
    }
    if (!isRunning) {
        currLight = 0;
        traffic();
    };

};

switchState.addEventListener('click', () => {
    clearTimeout(timer);
    currLight = (currLight + 1) % 3;
    traffic(); 
});

changeLength.addEventListener('click', changeDuration);

traffic();

