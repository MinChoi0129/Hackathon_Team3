window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = "ko-KR";

let p = null;
let recognizing = false; // 음성 인식 상태를 추적하기 위한 변수

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");

startButton.addEventListener("click", () => {
  recognition.start();
  recognizing = true;
  startButton.disabled = true;
  stopButton.disabled = false;
});

stopButton.addEventListener("click", () => {
  recognition.stop();
  recognizing = false;
  startButton.disabled = false;
  stopButton.disabled = true;
});

recognition.onstart = function () {
  p = document.createElement("p");
  document.querySelector(".words").appendChild(p);
};

recognition.onend = function () {
  if (recognizing) {
    recognition.start();
  }
};

recognition.onresult = function (e) {
  const texts = Array.from(e.results)
    .map((results) => results[0].transcript)
    .join("");

  texts.replace(/느낌표|강조|뿅/gi, "❗️");

  p.textContent = texts;
};
