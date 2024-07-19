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

if (getCookie("login_error") == "True") {
  alert("계정을 다시 확인해주세요");
}
