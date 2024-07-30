leaf = [
  [380, 400],
  [300, 420],
  [280, 460],
  [200, 480],
  [750, 250],
  [750, 200],
  [740, 230],
  [760, 200],
];

data = {
  1: ["0싫다", "0싫어", "1홈런", "1단디"],
  2: ["1꾸준히", "0번아웃", "0슬퍼", "0하기싫다"],
};

let picture = document.getElementsByClassName("pictures")[0];
let index = 0;
for (let i = 1; i <= 2; i++) {
  let words = data[i];
  for (let j = 0; j < words.length; j++) {
    let word = words[j];
    let cleanword = word.slice(1, word.length);

    let div = document.createElement("div");
    div.innerText = cleanword;

    if (word.charAt(0) == "0") {
      div.style.color = "red";
    } else {
      div.style.color = "blue";
    }

    if (index < leaf.length) {
      let x = leaf[index][0];
      let y = leaf[index][1];
      div.style.transform = `translate(${x}px, ${y}px)`;
      index++;
    }
    picture.appendChild(div);
  }
}

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

let today = new Date();
let currentMonth = today.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더해줌
let recentMonths = [];

// 최근 3개월을 계산
for (let i = 0; i < 3; i++) {
  let month = currentMonth - i;
  if (month <= 0) {
    month += 12;
  }
  recentMonths.push(month);
}

let monthsigns = document.getElementsByClassName("months")[0];
let signindex = 0;

for (let i = 0; i < recentMonths.length; i++) {
  let month = recentMonths[i];
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
