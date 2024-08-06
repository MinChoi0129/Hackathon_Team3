function oninputPhone(target) {
  target.value = target.value
    .replace(/[^0-9]/g, "")
    .replace(/(^02.{0}|^01.{1}|[0-9]{3,4})([0-9]{3,4})([0-9]{4})/g, "$1-$2-$3");
}

function onPINCode(target) {
  target.value = target.value.replace(/[^0-9]/g, "");
}

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

alert("원활한 이용을 위해 크롬을 이용해주세요.");
alert(
  "For 심사위원 : 김멋사 / 010-1234-1234 / 1234 로 로그인하시면 샘플 데이터로 체험하실 수 있습니다."
);

if (getCookie("login_error") == "True") {
  alert("일치하는 회원이 없습니다.");
} else if (getCookie("form_error") == "True") {
  alert("입력한 정보가 형식에 맞지 않습니다.");
}
