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
let isFreeDebate = false;
let activeTeam = "con"; // 자유토론 시 반대팀부터 시작

function updateTime(element, time) {
  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");
  element.innerText = `${minutes}:${seconds}`;
}

function startTimer(duration, display, callback) {
  let timer = duration,
    minutes,
    seconds;
  const interval = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

    if (--timer < 0) {
      clearInterval(interval);
      if (callback) callback();
    }
  }, 1000);
  return interval;
}

function showEndMessage(message) {
  const endMessage = document.createElement("div");
  endMessage.id = "endMessage";
  endMessage.style.position = "fixed";
  endMessage.style.top = "50%";
  endMessage.style.left = "50%";
  endMessage.style.transform = "translate(-50%, -50%)";
  endMessage.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  endMessage.style.color = "white";
  endMessage.style.padding = "20px";
  endMessage.style.borderRadius = "10px";
  endMessage.style.zIndex = "1000";
  endMessage.innerText = message;
  document.body.appendChild(endMessage);
  setTimeout(() => {
    document.body.removeChild(endMessage);
  }, 1500);
}

document.getElementById("proPlayPause").addEventListener("click", function () {
  if (this.innerText === "▶") {
    this.innerText = "⏸";
    proInterval = startTimer(proTime, document.getElementById("proTime"), function () {
      if (isFreeDebate && overallTime > 0) {
        document.getElementById("proFinish").click();
      } else {
        showEndMessage("찬성팀 시간 종료");
      }
    });
  } else {
    this.innerText = "▶";
    clearInterval(proInterval);
  }
});

document.getElementById("conPlayPause").addEventListener("click", function () {
  if (this.innerText === "▶") {
    this.innerText = "⏸";
    conInterval = startTimer(conTime, document.getElementById("conTime"), function () {
      if (isFreeDebate && overallTime > 0) {
        document.getElementById("conFinish").click();
      } else {
        showEndMessage("반대팀 시간 종료");
      }
    });
  } else {
    this.innerText = "▶";
    clearInterval(conInterval);
  }
});

document.getElementById("mainPlayPause").addEventListener("click", function () {
  if (this.innerText === "▶") {
    this.innerText = "⏸";
    overallInterval = startTimer(overallTime, document.getElementById("overallTime"), function () {
      showEndMessage("전체 시간 종료");
      clearInterval(proInterval);
      clearInterval(conInterval);
    });
    if (activeTeam === "con") {
      conInterval = startTimer(conTime, document.getElementById("conTime"), function () {
        if (overallTime > 0) {
          document.getElementById("conFinish").click();
        }
      });
    } else {
      proInterval = startTimer(proTime, document.getElementById("proTime"), function () {
        if (overallTime > 0) {
          document.getElementById("proFinish").click();
        }
      });
    }
  } else {
    this.innerText = "▶";
    clearInterval(overallInterval);
    clearInterval(proInterval);
    clearInterval(conInterval);
  }
});

document.querySelectorAll(".debateStage").forEach((button) => {
  button.addEventListener("click", function () {
    const stage = this.id;
    const debateStage = document.getElementById("debateStage").value;

    isFreeDebate = stage === "freeDebate";
    activeTeam = "con";

    switch (stage) {
      case "introSpeech":
        proTime = debateStage === "결승" ? 120 : 60;
        conTime = debateStage === "결승" ? 120 : 60;
        overallTime = 0;
        document.getElementById("proPlayPause").style.display = "inline";
        document.getElementById("conPlayPause").style.display = "inline";
        document.getElementById("mainPlayPause").style.display = "none";
        document.getElementById("overallTime").style.display = "none";
        document.querySelectorAll(".finishButton").forEach((btn) => (btn.style.display = "none"));
        break;
      case "questions":
        proTime = 60;
        conTime = 60;
        overallTime = 0;
        document.getElementById("proPlayPause").style.display = "inline";
        document.getElementById("conPlayPause").style.display = "inline";
        document.getElementById("mainPlayPause").style.display = "none";
        document.getElementById("overallTime").style.display = "none";
        document.querySelectorAll(".finishButton").forEach((btn) => (btn.style.display = "none"));
        break;
      case "freeDebate":
        proTime = 80;
        conTime = 80;
        overallTime = debateStage === "결승" ? 900 : 600;
        document.getElementById("proPlayPause").style.display = "none";
        document.getElementById("conPlayPause").style.display = "none";
        document.getElementById("mainPlayPause").style.display = "inline";
        document.getElementById("overallTime").style.display = "block";
        document.querySelectorAll(".finishButton").forEach((btn) => (btn.style.display = "inline"));
        break;
      case "closingSpeech":
        proTime = 60;
        conTime = 60;
        overallTime = 0;
        document.getElementById("proPlayPause").style.display = "inline";
        document.getElementById("conPlayPause").style.display = "inline";
        document.getElementById("mainPlayPause").style.display = "none";
        document.getElementById("overallTime").style.display = "none";
        document.querySelectorAll(".finishButton").forEach((btn) => (btn.style.display = "none"));
        break;
    }
    updateTime(document.getElementById("proTime"), proTime);
    updateTime(document.getElementById("conTime"), conTime);
    updateTime(document.getElementById("overallTime"), overallTime);
    document.querySelectorAll(".debateStage").forEach((btn) => (btn.style.color = "black"));
    this.style.color = "red";
  });
});

document.querySelectorAll(".finishButton").forEach((button) => {
  button.addEventListener("click", function () {
    if (this.id === "proFinish") {
      clearInterval(proInterval);
      proTime = 80; // 초기화
      updateTime(document.getElementById("proTime"), proTime);
      document.getElementById("conPlayPause").click();
      activeTeam = "con";
    } else {
      clearInterval(conInterval);
      conTime = 80; // 초기화
      updateTime(document.getElementById("conTime"), conTime);
      document.getElementById("proPlayPause").click();
      activeTeam = "pro";
    }
  });
});
