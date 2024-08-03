// 음성인식
let texts = "";
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = "ko-KR";

let p = null;
let recognizing = false; // 음성 인식 상태를 추적하기 위한 변수

const startButton = document.getElementById("mic");

startButton.addEventListener("click", () => {
  if (recognizing) {
    recognition.stop();
    startButton.src = "../static/images/nomic.svg";
    recognizing = false;
  } else {
    recognition.start();
    startButton.src = "../static/images/mic.png";
    recognizing = true;
  }
});

recognition.onend = function () {
  if (texts.trim() == "") return;
  addMessage(texts, "sent-message");
  const formData1 = new FormData(); // post 보내는 방식은 formdata
  formData1.append("user_message", texts);
  fetch(`/api/chat/`, {
    method: "post",
    body: formData1,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      addMessage(data.response, "received-message");
      texts = "";
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  if (recognizing) {
    recognition.start();
  }
};

recognition.onresult = function (e) {
  texts = Array.from(e.results)
    .map((results) => results[0].transcript)
    .join("");
};

/////////////////////////////////////////
// 채팅으로 칠 때 나오는 부분
let chatWindow = document.getElementById("chat-window");
let chatInput = document.getElementById("chat-input");
let send = document.getElementById("send-button");

function addMessage(text, className) {
  var chatWindow = document.getElementById("chat-window");
  var messageElement = document.createElement("div");
  messageElement.classList.add("chat-message", className);
  messageElement.textContent = text;
  chatWindow.insertBefore(messageElement, chatWindow.firstChild);
}

function typeMessage() {
  if (chatInput.value.trim() !== "") {
    addMessage(chatInput.value, "sent-message");
    const formData2 = new FormData(); // post 보내는 방식은 formdata
    formData2.append("user_message", chatInput.value);
    fetch(`/api/chat/`, {
      method: "post",
      body: formData2,
    })
      .then((chatInput.value = ""))
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        addMessage(data.response, "received-message");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

if (recognizing == false) {
  send.addEventListener("click", typeMessage);
}

//button click event 가 나오면 post 하는 함수 ?
