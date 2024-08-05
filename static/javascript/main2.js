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
    startButton.src = "../static/images/mic.svg";
    recognizing = true;
  }
});

recognition.onend = function () {
  if (texts.trim() == "") {
    if (recognizing) {
      recognition.start();
    }
    return;
  } // 아무 말 안하면 자동 종료됨
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
//chatInput.value값은 매번 바뀜.  미리 가져오면 안되기 때문에 여기 x

function addMessage(text, className) {
  var chatWindow = document.getElementById("chat-window");
  var messageElement = document.createElement("div");
  messageElement.classList.add("chat-message", className);
  messageElement.textContent = text;
  chatWindow.insertBefore(messageElement, chatWindow.firstChild);
}

function addProfile() {
  let profileCreate = document.createElement("div");
  profileCreate.classList.add("chat-message", "profile-img");
  chatWindow.insertBefore(profileCreate, chatWindow.firstChild);
}

function typeMessage() {
  if (chatInput.value.trim() !== "") {
    if (chatInput.value == "대화종료할게") {
      addProfile();
      addMessage(chatInput.value, "sent-message");
      const formData2 = new FormData(); // post 보내는 방식은 formdata
      formData2.append("user_message", "exit_chat");
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
        .then()
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    addProfile();
    addMessage(chatInput.value, "sent-message");
    formData2 = new FormData(); // post 보내는 방식은 formdata
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
