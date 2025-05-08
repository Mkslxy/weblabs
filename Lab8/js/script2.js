let currentSlide = 0;
let totalSlides = document.querySelectorAll('.slide').length;
let autoplay = true;
let autoplayInterval;

const slider = document.getElementById("slider");
const slidesContainer = document.querySelector('.slides');
const dots = document.querySelectorAll('.dot');
const speed = 500;
const autoplaySpeed = 3000; 

function moveSlide(direction) {
  currentSlide += direction;

  if (currentSlide < 0) {
    currentSlide = totalSlides - 1;
  } else if (currentSlide >= totalSlides) {
    currentSlide = 0;
  }

  updateSlider();
}


function currentSlideFunc(index) {
  currentSlide = index;
  updateSlider();
}


function updateSlider() {
  slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

  dots.forEach(dot => dot.classList.remove('active'));
  dots[currentSlide].classList.add('active');
}

function startAutoplay() {
  if (autoplay) {
    autoplayInterval = setInterval(() => {
      moveSlide(1);
    }, autoplaySpeed);
  }
}


slider.addEventListener('mouseenter', () => {
  clearInterval(autoplayInterval);
});


slider.addEventListener('mouseleave', () => {
  startAutoplay();
});


document.addEventListener('keydown', (e) => {
  if (e.key === "ArrowLeft") {
    moveSlide(-1);
  } else if (e.key === "ArrowRight") {
    moveSlide(1);
  }
});


startAutoplay();
