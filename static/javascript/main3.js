let button = document.querySelector(".button");

button.addEventListener("click", diary_contentPOST);

function diary_contentPOST() {
  let diaryContent = document.getElementById("diary_content");
  let diaryInput = diaryContent.value;

  if (diaryInput != "") {
    const formData = new FormData();
    formData.append("diary_string", diaryInput);
    fetch(`/api/diaries/`, {
      method: "post",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        alert("일기가 성공적으로 저장되었습니다!");
        diaryInput = "";
        setTimeout(function () {
          window.location.href = "/main";
        }, 1000);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    alert("일기 내용을 입력하세요.");
  }
}
