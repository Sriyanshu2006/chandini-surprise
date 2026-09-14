const screens = document.querySelectorAll(".screen");
const buttons = document.querySelectorAll("[data-next]");
const percentage = document.getElementById("percentage");
const progressBar = document.getElementById("progressBar");
const warning = document.getElementById("warning");
const meterNext = document.getElementById("meterNext");
const typedText = document.getElementById("typedText");
const finalBtn = document.getElementById("finalBtn");

const note = `You know what's funny?
I could write a hundred things about you,
but somehow none of them would be enough.

So I'll keep it simple:
I'm really glad you exist. 💗

Keep smiling, keep being you,
and remember that someone out there
thinks you're pretty amazing.`;

let meterStarted = false;
let noteStarted = false;

function showScreen(id) {
  screens.forEach(screen => screen.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) target.classList.add("active");

  if (id === "meter" && !meterStarted) {
    meterStarted = true;
    runMeter();
  }
  if (id === "note" && !noteStarted) {
    noteStarted = true;
    typeNote();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

buttons.forEach(button => {
  button.addEventListener("click", () => showScreen(button.dataset.next));
});

function runMeter() {
  let value = 0;
  const target = 120;
  const timer = setInterval(() => {
    value += value < 80 ? 3 : 1;
    if (value >= target) {
      value = target;
      clearInterval(timer);
      percentage.textContent = "120%";
      progressBar.style.width = "100%";
      warning.textContent = "⚠️ WARNING: TOO CUTE TO HANDLE";
      meterNext.classList.remove("hidden");
      return;
    }
    percentage.textContent = `${value}%`;
    progressBar.style.width = `${Math.min(value, 100)}%`;
    if (value > 70) warning.textContent = "Cuteness levels getting dangerous...";
    else if (value > 35) warning.textContent = "Still calculating...";
  }, 55);
}

function typeNote() {
  typedText.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    typedText.textContent += note[i];
    i++;
    if (i >= note.length) {
      clearInterval(timer);
      finalBtn.classList.remove("hidden");
    }
  }, 28);
}

/* Draggable photo deck */
const deck = document.getElementById("memoryDeck");
const deckHelp = document.getElementById("deckHelp");
const deckCount = document.getElementById("deckCount");
let deckCards = deck ? [...deck.querySelectorAll(".memory-card")] : [];
let dragging = null;
let startX = 0, startY = 0, currentX = 0, currentY = 0;

function updateDeck() {
  deckCards.forEach((card, index) => {
    const depth = Math.min(index, 9);
    const scale = 1 - depth * .025;
    const y = depth * 8;
    const rot = depth % 2 ? 1.3 : -1.1;
    card.style.zIndex = String(20 - depth);
    card.style.transform = `translateY(${y}px) scale(${scale}) rotate(${rot}deg)`;
  });
  deckCount.textContent = `${deckCards.length} photo${deckCards.length === 1 ? "" : "s"} left`;
  if (deckCards.length === 0) {
    deckHelp.textContent = "That's all of them. ❤️";
    setTimeout(() => showScreen("sorry"), 750);
  }
}

function pointerDown(e) {
  if (!deckCards.length || e.currentTarget !== deckCards[0]) return;
  dragging = e.currentTarget;
  const point = e.touches ? e.touches[0] : e;
  startX = point.clientX;
  startY = point.clientY;
  currentX = 0; currentY = 0;
  dragging.style.transition = "none";
  dragging.setPointerCapture?.(e.pointerId);
}

function pointerMove(e) {
  if (!dragging) return;
  const point = e.touches ? e.touches[0] : e;
  currentX = point.clientX - startX;
  currentY = point.clientY - startY;
  const rotation = currentX * .055;
  dragging.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg)`;
}

function pointerUp() {
  if (!dragging) return;
  const card = dragging;
  const threshold = Math.max(90, window.innerWidth * .18);
  const direction = currentX >= 0 ? "right" : "left";

  if (Math.abs(currentX) > threshold || Math.abs(currentY) > 150) {
    card.classList.add(direction === "right" ? "fly-right" : "fly-left");
    const oldCards = deckCards;
    deckCards = deckCards.slice(1);
    setTimeout(() => {
      card.remove();
      updateDeck();
    }, 430);
  } else {
    card.style.transition = "transform .3s ease";
    card.style.transform = "translate(0,0) rotate(0deg)";
  }
  dragging = null;
}

if (deck) {
  deckCards.forEach(card => {
    card.addEventListener("pointerdown", pointerDown);
    card.addEventListener("pointermove", pointerMove);
    card.addEventListener("pointerup", pointerUp);
    card.addEventListener("pointercancel", pointerUp);
  });
  updateDeck();
}

document.getElementById("restart").addEventListener("click", () => {
  meterStarted = false;
  noteStarted = false;
  percentage.textContent = "0%";
  progressBar.style.width = "0%";
  warning.textContent = "Calculating cuteness...";
  meterNext.classList.add("hidden");
  finalBtn.classList.add("hidden");
  typedText.textContent = "";
  showScreen("welcome");
});
