// ********************************************** 변수 설정 ******************************************************* //

// 단어 위치
let leaf = [
  [40, 40],
  [30, 42],
  [28, 46],
  [20, 48],
  [75, 25],
  [75, 20],
  [74, 23],
  [76, 20],
];

// 월  표시 사인위치
let signwhere = [
  [503, 45],
  [740, 225],
  [391, 410],
];

let monthdata = {
  1: ["1월"],
  2: ["2월"],
  3: ["3월"],
  4: ["4월"],
  5: ["5월"],
  6: ["6월"],
  7: ["7월"],
  8: ["8월"],
  9: ["9월"],
  10: ["10월"],
  11: ["11월"],
  12: ["12월"],
};

let leaf1 = document.getElementsByClassName("pictures1")[0];
let leaf2 = document.getElementsByClassName("pictures2")[0];
let leaf3 = document.getElementsByClassName("pictures3")[0];

let leafs = [leaf1, leaf2, leaf3];

//팻말 월 가져오기 (최근 3달)
let today = new Date();
let currentMonth = today.getMonth() + 1; // getMonth() is 0-based, so add 1
let recentMonths = [];
let ariname = document.getElementsByClassName("abcde")[0];
for (let i = 0; i < 3; i++) {
  let month = currentMonth - i;
  if (month <= 0) {
    month += 12;
  }
  recentMonths.push(month);
}

// ********************************************************************************************************************* //

// 사람 이름 가져오기
// fetch(`/api/user`, {
//   method: "GET",
//   //   body: formData,
// })
//   .then((response) => response.json())
//   .then((data) => {
//     ariname.innerHTML = data.username;
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });

// 긍정 부정 단어  월별 가져오기
fetch(`/api/report/jack`, {
  method: "GET",
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Success:", data);

    // 이파리에 단어 채워주기(근데 위치는 아직 지정안함)
    for (let month = 6; month <= 8; month++) {
      let month_result = data[month];

      let negatives = month_result.Negative;
      let positives = month_result.Positive;

      for (let i = 0; i < negatives.length; i++) {
        let word = negatives[i];

        let div = document.createElement("div");
        div.innerText = word;
        div.style.color = "red";
        div.className = "word_style";
        div.style.transform = `translate(${leaf[i][0]}px, ${leaf[i][1]}px)`;
        leafs[month - 6].appendChild(div);
      }

      for (let i = 0; i < positives.length; i++) {
        let word = positives[i];

        let div = document.createElement("div");
        div.innerText = word;
        div.style.color = "blue";
        div.className = "word_style";
        div.style.transform = `translate(${leaf[i][0]}px, ${leaf[i][1]}px)`;
        leafs[month - 6].appendChild(div);
      }
    }

    // Display recent 3 months
    let monthsigns = document.getElementsByClassName("months")[0];
    let signindex = 0;
    for (let month of recentMonths) {
      let sign = monthdata[month][0];
      let signdiv = document.createElement("div");
      signdiv.innerText = sign;

      if (signindex < signwhere.length) {
        let x = signwhere[signindex][0];
        let y = signwhere[signindex][1];
        signdiv.style.transform = `translate(${x}px, ${y}px)`;
        signindex++;
      }
      signdiv.style.color = "black";
      monthsigns.appendChild(signdiv);
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
