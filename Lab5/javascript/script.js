const bulb = document.getElementById('bulb');
const button = document.getElementById('button');
const type = document.getElementById('bulbType');
const change = document.getElementById('changeBright');


let bulbType = 'regular';
let bright = 1;
let lastAct = Date.now();
let maxTime = 5000;
let isBulbOff = false;


button.addEventListener('click', () => {
    button.classList.toggle('onBt');
    button.classList.toggle('off');
    if (button.classList.contains('onBt')) {
        bulb.classList.remove('off'); 
        bulb.classList.add(type.value); 
        button.textContent = 'Виключити';
        isBulbOff = false;
    } else {
        bulb.classList.remove(bulbType);
        bulb.classList.add('off');
        button.textContent = 'Включити';
        isBulbOff = true;
    }
});

type.addEventListener('change', () => {
    if (button.classList.contains('onBt')) {
        bulb.classList.remove(bulbType);
        bulbType = type.value;
        bulb.classList.add(bulbType);
    } else {
        bulbType = type.value;
    }
});

changeBright.addEventListener('click', () => {
    if (button.classList.contains('onBt')) {
        let message = prompt("Веддіть число(від 0.5 до 1.5)", 1);
        bright = parseFloat(message);
        if (!isNaN(bright) && bright >= 0.5 && bright <= 1.5) {
            bulb.style.filter = `brightness(${bright})`;
            alert(`Яскравість змінена на ${bright}`);
        } else {
            alert("Введіть число від 0.5 до 1.5");
        }
    } else {
        alert("Лампочка вимкнена");
    }
});

function newlastAct() {
    console.log("Оновлено lastAct");
    lastAct = Date.now();
}

["mousemove", "keydown", "click"].forEach(event => {
    document.removeEventListener(event, newlastAct); // видаляєм попередній обробник
    document.addEventListener(event, newlastAct);   // додаєм новий
});

if (!window.intervalStarted) {
    window.intervalStarted = true; 
    setInterval(() => {
        let currTime = Date.now();
        let timeLastAct = currTime - lastAct;

        console.log(`Час бездіяльності: ${timeLastAct}`);
        if (timeLastAct > maxTime && !isBulbOff && button.classList.contains('onBt')) {
            console.log("Викликаємо bublOff()");
            bublOff();
            alert("виключено лампочку через бездіяльність");

        }
    }, 1000);
};

function bublOff() {
    if (!isBulbOff) { 
        console.log("Функція bublOff викликана");
        bulb.classList.remove(type.value);
        bulb.classList.add('off');
        button.textContent = 'Включити';
        isBulbOff = true; 
    }
}


