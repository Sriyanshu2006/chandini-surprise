const screens = document.querySelectorAll(".screen");
const buttons = document.querySelectorAll("[data-next]");
const percentage = document.getElementById("percentage");
const progressBar = document.getElementById("progressBar");
const warning = document.getElementById("warning");
const meterNext = document.getElementById("meterNext");
const typedText = document.getElementById("typedText");
const finalBtn = document.getElementById("finalBtn");

const note = `Dear Chandini,

I don't really know how to put everything I feel into a few lines,
but I wanted to make something that could remind you
of just how special you are.

There is something about your smile,
your little expressions, and the way you carry yourself
that makes you impossible not to notice. 💗

Maybe it's the way you make ordinary moments feel a little nicer.
Maybe it's simply because you're you.

Whatever the reason is,
I'm genuinely glad that our paths crossed.

So here's a tiny reminder for you:
keep smiling, keep being your beautiful self,
and never forget that you are more special
than you probably realise. 🌷

— Someone who thinks Chandini deserves
a little extra happiness today. ♡;

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

    if (value > 70) {
      warning.textContent = "Cuteness levels getting dangerous...";
    } else if (value > 35) {
      warning.textContent = "Still calculating...";
    }
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
