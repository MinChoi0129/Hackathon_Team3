function getCookie(cookieName) {
  cookieName = `${cookieName}=`;
  let cookieData = document.cookie;

  let cookieValue = "";
  let start = cookieData.indexOf(cookieName);

  if (start !== -1) {
    start += cookieName.length;
    let end = cookieData.indexOf(";", start);
    if (end === -1) end = cookieData.length;
    cookieValue = cookieData.substring(start, end);
  }

  return cookieValue;
}

function removeCookie(cookieName) {
  // Set the cookie with an expired date
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

if (getCookie("welcome_new_user") == "True") {
  alert("회원가입이 완료되어 홈 화면으로 이동합니다.");
  removeCookie("welcome_new_user");
}

let ari_talk_button = document.querySelector("#lets_talk_ari");
let diary_button = document.querySelector("#writing");
let ariImg = document.getElementsByClassName("ari_image");
let computedStyle_ari = window.getComputedStyle(ariImg[[0]]);

function bringIframe_aritalk() {}
function bringIframe_diary() {}

function makeAriMove() {
  // computedStyle_ari.style.width = '750px';
  // ariImg.style.heignt = 'auto';
  // ariImg.style.top = '70px';
  // ariImg.style.right = '45px';
}

function makeEclipseMove() {
  let eclipse = document.getElementsByClassName("eclipse");
  // const width2 = 430px;
  // const height2 ='auto';
  // const newTop = '30px';
  // const newLeft = '100px';
  eclipse.style.width = "430px";
  eclipse.style.heignt = "auto";

  eclipse.style.top = "30px";
  eclipse.style.left = "100px";
}
function hi() {}
// ari_talk_button.addEventListener("click",bringIframe_aritalk(),makeAriMove(),makeEclipseMove() );
// diary_button.addEventListener("click", bringIframe_diary(),makeAriMove(),makeEclipseMove());
//ari_talk_button.addEventListener("click", makeAriMove);
