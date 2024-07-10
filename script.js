document.getElementById("startButton").addEventListener("click", function () {
  document.getElementById("home").style.display = "none";
  document.getElementById("timerPage").style.display = "block";
});

document.getElementById("backButton").addEventListener("click", function () {
  document.getElementById("timerPage").style.display = "none";
  document.getElementById("home").style.display = "block";
});

let proTime = 0;
let conTime = 0;
let overallTime = 0;
let proInterval, conInterval, overallInterval;

function updateTime(element, time) {
  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");
  element.innerText = `${minutes}:${seconds}`;
}

function startTimer(duration, display, button) {
  let timer = duration,
    minutes,
    seconds;
  return setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

    if (--timer < 0) {
      clearInterval(this);
      button.innerText = "▶";
      alert("시간 종료");
    }
  }, 1000);
}

document.getElementById("proPlayPause").addEventListener("click", function () {
  if (this.innerText === "▶") {
    this.innerText = "⏸";
    proInterval = startTimer(proTime, document.getElementById("proTime"), this);
  } else {
    this.innerText = "▶";
    clearInterval(proInterval);
  }
});

document.getElementById("conPlayPause").addEventListener("click", function () {
  if (this.innerText === "▶") {
    this.innerText = "⏸";
    conInterval = startTimer(conTime, document.getElementById("conTime"), this);
  } else {
    this.innerText = "▶";
    clearInterval(conInterval);
  }
});

document.getElementById("mainPlayPause").addEventListener("click", function () {
  if (this.innerText === "▶") {
    this.innerText = "⏸";
    overallInterval = startTimer(overallTime, document.getElementById("overallTime"), this);
  } else {
    this.innerText = "▶";
    clearInterval(overallInterval);
  }
});

document.querySelectorAll(".debateStage").forEach((button) => {
  button.addEventListener("click", function () {
    const stage = this.id;
    switch (stage) {
      case "introSpeech":
        proTime = 60;
        conTime = 60;
        overallTime = 0;
        break;
      case "questions":
        proTime = 60;
        conTime = 60;
        overallTime = 0;
        break;
      case "freeDebate":
        proTime = 80;
        conTime = 80;
        overallTime = 600;
        break;
      case "closingSpeech":
        proTime = 60;
        conTime = 60;
        overallTime = 0;
        break;
    }
    updateTime(document.getElementById("proTime"), proTime);
    updateTime(document.getElementById("conTime"), conTime);
    updateTime(document.getElementById("overallTime"), overallTime);
    document.querySelectorAll(".debateStage").forEach((btn) => (btn.style.color = "black"));
    this.style.color = "red";
  });
});
